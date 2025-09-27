
import { storageService } from './storageService';
import { cryptoApi } from './cryptoApi';
import { Transaction, PortfolioAsset, Portfolio } from '../types/crypto';

export interface TradeResult {
  success: boolean;
  message: string;
  transaction?: Transaction;
  newBalance?: number;
}

class TradingService {
  async executeTrade(
    symbol: string,
    type: 'buy' | 'sell',
    amount: number,
    price: number
  ): Promise<TradeResult> {
    try {
      console.log(`Executing ${type} order: ${amount} ${symbol} at $${price}`);
      
      const userData = await storageService.getUserData();
      const total = amount * price;
      
      // Validate trade
      if (type === 'buy') {
        if (userData.balance < total) {
          return {
            success: false,
            message: 'Insufficient balance for this purchase',
          };
        }
      } else {
        // For sell orders, check if user has enough of the asset
        const existingAsset = userData.portfolio.assets.find(
          (asset) => asset.symbol === symbol
        );
        
        if (!existingAsset || existingAsset.amount < amount) {
          return {
            success: false,
            message: `Insufficient ${symbol} balance for this sale`,
          };
        }
      }
      
      // Create transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        type,
        symbol,
        amount,
        price,
        total,
        timestamp: new Date(),
        status: 'completed',
      };
      
      // Update balance
      const newBalance = type === 'buy' 
        ? userData.balance - total 
        : userData.balance + total;
      
      // Update portfolio
      const updatedPortfolio = this.updatePortfolioAfterTrade(
        userData.portfolio,
        symbol,
        type,
        amount,
        price
      );
      
      // Save changes
      await storageService.updateBalance(newBalance);
      await storageService.updatePortfolio(updatedPortfolio);
      await storageService.addTransaction(transaction);
      
      console.log(`Trade executed successfully: ${type} ${amount} ${symbol}`);
      
      return {
        success: true,
        message: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${amount} ${symbol}`,
        transaction,
        newBalance,
      };
      
    } catch (error) {
      console.error('Trade execution error:', error);
      return {
        success: false,
        message: 'Trade execution failed. Please try again.',
      };
    }
  }
  
  private updatePortfolioAfterTrade(
    portfolio: Portfolio,
    symbol: string,
    type: 'buy' | 'sell',
    amount: number,
    price: number
  ): Portfolio {
    const assets = [...portfolio.assets];
    const existingAssetIndex = assets.findIndex(asset => asset.symbol === symbol);
    
    if (type === 'buy') {
      if (existingAssetIndex >= 0) {
        // Update existing asset
        const existingAsset = assets[existingAssetIndex];
        const newAmount = existingAsset.amount + amount;
        const newValue = newAmount * price;
        
        assets[existingAssetIndex] = {
          ...existingAsset,
          amount: newAmount,
          value: newValue,
          price,
        };
      } else {
        // Add new asset
        const newAsset: PortfolioAsset = {
          id: symbol.toLowerCase(),
          symbol,
          name: symbol, // Will be updated with real name from API
          amount,
          value: amount * price,
          price,
          change24h: 0,
          changePercent24h: 0,
        };
        assets.push(newAsset);
      }
    } else {
      // Sell order
      if (existingAssetIndex >= 0) {
        const existingAsset = assets[existingAssetIndex];
        const newAmount = existingAsset.amount - amount;
        
        if (newAmount <= 0) {
          // Remove asset if amount becomes 0 or negative
          assets.splice(existingAssetIndex, 1);
        } else {
          // Update existing asset
          assets[existingAssetIndex] = {
            ...existingAsset,
            amount: newAmount,
            value: newAmount * price,
            price,
          };
        }
      }
    }
    
    // Recalculate portfolio totals
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    return {
      ...portfolio,
      assets,
      totalValue,
      totalChange: 0, // Will be calculated when prices are updated
      totalChangePercent: 0,
    };
  }
  
  async updatePortfolioPrices(): Promise<Portfolio> {
    try {
      const userData = await storageService.getUserData();
      const { portfolio } = userData;
      
      if (portfolio.assets.length === 0) {
        return portfolio;
      }
      
      // Get current prices for all assets
      const symbols = portfolio.assets.map(asset => asset.id).join(',');
      const cryptoData = await cryptoApi.getCryptocurrencies(50);
      
      let totalValue = 0;
      let totalChange = 0;
      
      const updatedAssets = portfolio.assets.map(asset => {
        const currentData = cryptoData.find(
          crypto => crypto.symbol.toLowerCase() === asset.symbol.toLowerCase()
        );
        
        if (currentData) {
          const convertedData = cryptoApi.convertApiResponse(currentData);
          const newValue = asset.amount * convertedData.price;
          const oldValue = asset.amount * asset.price;
          const change = newValue - oldValue;
          
          totalValue += newValue;
          totalChange += change;
          
          return {
            ...asset,
            price: convertedData.price,
            value: newValue,
            change24h: convertedData.change24h,
            changePercent24h: convertedData.changePercent24h,
            name: convertedData.name,
          };
        }
        
        // If no current data, keep existing values
        totalValue += asset.value;
        return asset;
      });
      
      const totalChangePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;
      
      const updatedPortfolio: Portfolio = {
        totalValue,
        totalChange,
        totalChangePercent,
        assets: updatedAssets,
      };
      
      await storageService.updatePortfolio(updatedPortfolio);
      return updatedPortfolio;
      
    } catch (error) {
      console.error('Error updating portfolio prices:', error);
      const userData = await storageService.getUserData();
      return userData.portfolio;
    }
  }
}

export const tradingService = new TradingService();
