
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Portfolio, Transaction, PortfolioAsset } from '../types/crypto';

export interface UserData {
  portfolio: Portfolio;
  transactions: Transaction[];
  balance: number;
  settings: {
    notifications: boolean;
    biometric: boolean;
    currency: string;
  };
}

class StorageService {
  private readonly KEYS = {
    USER_DATA: 'user_data',
    PORTFOLIO: 'portfolio',
    TRANSACTIONS: 'transactions',
    SETTINGS: 'settings',
    BALANCE: 'balance',
  };

  async getUserData(): Promise<UserData> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.USER_DATA);
      if (data) {
        const parsed = JSON.parse(data);
        // Convert transaction timestamps back to Date objects
        parsed.transactions = parsed.transactions.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        }));
        return parsed;
      }
      
      // Return default data if none exists
      return this.getDefaultUserData();
    } catch (error) {
      console.error('Error loading user data:', error);
      return this.getDefaultUserData();
    }
  }

  async saveUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.USER_DATA, JSON.stringify(userData));
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  async updatePortfolio(portfolio: Portfolio): Promise<void> {
    try {
      const userData = await this.getUserData();
      userData.portfolio = portfolio;
      await this.saveUserData(userData);
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  }

  async addTransaction(transaction: Transaction): Promise<void> {
    try {
      const userData = await this.getUserData();
      userData.transactions.unshift(transaction); // Add to beginning
      
      // Keep only last 100 transactions
      if (userData.transactions.length > 100) {
        userData.transactions = userData.transactions.slice(0, 100);
      }
      
      await this.saveUserData(userData);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async updateBalance(balance: number): Promise<void> {
    try {
      const userData = await this.getUserData();
      userData.balance = balance;
      await this.saveUserData(userData);
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }

  async updateSettings(settings: Partial<UserData['settings']>): Promise<void> {
    try {
      const userData = await this.getUserData();
      userData.settings = { ...userData.settings, ...settings };
      await this.saveUserData(userData);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.KEYS.USER_DATA);
      console.log('All user data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  private getDefaultUserData(): UserData {
    return {
      portfolio: {
        totalValue: 10000, // Starting with $10,000 virtual money
        totalChange: 0,
        totalChangePercent: 0,
        assets: [],
      },
      transactions: [],
      balance: 10000, // Starting balance
      settings: {
        notifications: true,
        biometric: false,
        currency: 'USD',
      },
    };
  }
}

export const storageService = new StorageService();
