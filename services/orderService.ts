
import { Order, Transaction, PriceAlert } from '../types/crypto';
import { storageService } from './storageService';
import { websocketService } from './websocketService';

export interface OrderResult {
  success: boolean;
  message: string;
  order?: Order;
  transaction?: Transaction;
}

class OrderService {
  private orders: Order[] = [];
  private alerts: PriceAlert[] = [];
  private priceCache = new Map<string, number>();

  constructor() {
    this.loadOrders();
    this.loadAlerts();
    this.setupPriceMonitoring();
  }

  async createLimitOrder(
    symbol: string,
    type: 'buy' | 'sell',
    amount: number,
    limitPrice: number,
    expiresIn?: number // hours
  ): Promise<OrderResult> {
    try {
      console.log(`Creating limit order: ${type} ${amount} ${symbol} at $${limitPrice}`);

      const userData = await storageService.getUserData();
      const totalValue = amount * limitPrice;

      // Validate order
      if (type === 'buy' && userData.balance < totalValue) {
        return {
          success: false,
          message: 'Insufficient balance for limit order',
        };
      }

      if (type === 'sell') {
        const holding = userData.portfolio.assets.find(a => a.symbol === symbol);
        if (!holding || holding.amount < amount) {
          return {
            success: false,
            message: `Insufficient ${symbol} balance for limit order`,
          };
        }
      }

      const order: Order = {
        id: Date.now().toString(),
        type,
        orderType: 'limit',
        symbol,
        amount,
        price: limitPrice,
        limitPrice,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 60 * 60 * 1000) : undefined,
        filledAmount: 0,
        remainingAmount: amount,
      };

      this.orders.push(order);
      await this.saveOrders();

      // Reserve funds for buy orders
      if (type === 'buy') {
        await storageService.updateBalance(userData.balance - totalValue);
      }

      console.log('Limit order created successfully');
      return {
        success: true,
        message: 'Limit order placed successfully',
        order,
      };

    } catch (error) {
      console.error('Error creating limit order:', error);
      return {
        success: false,
        message: 'Failed to create limit order',
      };
    }
  }

  async createStopLossOrder(
    symbol: string,
    amount: number,
    stopPrice: number
  ): Promise<OrderResult> {
    try {
      console.log(`Creating stop-loss order: sell ${amount} ${symbol} at $${stopPrice}`);

      const userData = await storageService.getUserData();
      const holding = userData.portfolio.assets.find(a => a.symbol === symbol);

      if (!holding || holding.amount < amount) {
        return {
          success: false,
          message: `Insufficient ${symbol} balance for stop-loss order`,
        };
      }

      const order: Order = {
        id: Date.now().toString(),
        type: 'sell',
        orderType: 'stop-loss',
        symbol,
        amount,
        price: stopPrice,
        stopPrice,
        status: 'pending',
        createdAt: new Date(),
        filledAmount: 0,
        remainingAmount: amount,
      };

      this.orders.push(order);
      await this.saveOrders();

      console.log('Stop-loss order created successfully');
      return {
        success: true,
        message: 'Stop-loss order placed successfully',
        order,
      };

    } catch (error) {
      console.error('Error creating stop-loss order:', error);
      return {
        success: false,
        message: 'Failed to create stop-loss order',
      };
    }
  }

  async cancelOrder(orderId: string): Promise<OrderResult> {
    try {
      const orderIndex = this.orders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) {
        return {
          success: false,
          message: 'Order not found',
        };
      }

      const order = this.orders[orderIndex];
      if (order.status !== 'pending') {
        return {
          success: false,
          message: 'Cannot cancel non-pending order',
        };
      }

      // Refund reserved funds for buy limit orders
      if (order.type === 'buy' && order.orderType === 'limit') {
        const userData = await storageService.getUserData();
        const refundAmount = order.remainingAmount * order.price;
        await storageService.updateBalance(userData.balance + refundAmount);
      }

      order.status = 'cancelled';
      await this.saveOrders();

      console.log(`Order ${orderId} cancelled`);
      return {
        success: true,
        message: 'Order cancelled successfully',
        order,
      };

    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        message: 'Failed to cancel order',
      };
    }
  }

  async createPriceAlert(
    symbol: string,
    targetPrice: number,
    condition: 'above' | 'below'
  ): Promise<boolean> {
    try {
      const alert: PriceAlert = {
        id: Date.now().toString(),
        symbol,
        targetPrice,
        condition,
        isActive: true,
        createdAt: new Date(),
      };

      this.alerts.push(alert);
      await this.saveAlerts();

      console.log(`Price alert created: ${symbol} ${condition} $${targetPrice}`);
      return true;

    } catch (error) {
      console.error('Error creating price alert:', error);
      return false;
    }
  }

  async deletePriceAlert(alertId: string): Promise<boolean> {
    try {
      const alertIndex = this.alerts.findIndex(a => a.id === alertId);
      if (alertIndex === -1) return false;

      this.alerts.splice(alertIndex, 1);
      await this.saveAlerts();

      console.log(`Price alert ${alertId} deleted`);
      return true;

    } catch (error) {
      console.error('Error deleting price alert:', error);
      return false;
    }
  }

  getPendingOrders(): Order[] {
    return this.orders.filter(o => o.status === 'pending');
  }

  getAllOrders(): Order[] {
    return [...this.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getActiveAlerts(): PriceAlert[] {
    return this.alerts.filter(a => a.isActive);
  }

  getAllAlerts(): PriceAlert[] {
    return [...this.alerts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private async loadOrders(): Promise<void> {
    try {
      const userData = await storageService.getUserData();
      this.orders = (userData as any).orders || [];
      
      // Convert date strings back to Date objects
      this.orders = this.orders.map(order => ({
        ...order,
        createdAt: new Date(order.createdAt),
        expiresAt: order.expiresAt ? new Date(order.expiresAt) : undefined,
      }));

      console.log(`Loaded ${this.orders.length} orders`);
    } catch (error) {
      console.error('Error loading orders:', error);
      this.orders = [];
    }
  }

  private async saveOrders(): Promise<void> {
    try {
      const userData = await storageService.getUserData();
      (userData as any).orders = this.orders;
      await storageService.saveUserData(userData);
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }

  private async loadAlerts(): Promise<void> {
    try {
      const userData = await storageService.getUserData();
      this.alerts = (userData as any).alerts || [];
      
      // Convert date strings back to Date objects
      this.alerts = this.alerts.map(alert => ({
        ...alert,
        createdAt: new Date(alert.createdAt),
        triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
      }));

      console.log(`Loaded ${this.alerts.length} price alerts`);
    } catch (error) {
      console.error('Error loading alerts:', error);
      this.alerts = [];
    }
  }

  private async saveAlerts(): Promise<void> {
    try {
      const userData = await storageService.getUserData();
      (userData as any).alerts = this.alerts;
      await storageService.saveUserData(userData);
    } catch (error) {
      console.error('Error saving alerts:', error);
    }
  }

  private setupPriceMonitoring(): void {
    websocketService.onPriceUpdate((update) => {
      this.priceCache.set(update.symbol, update.price);
      this.checkOrders(update.symbol, update.price);
      this.checkAlerts(update.symbol, update.price);
    });
  }

  private async checkOrders(symbol: string, currentPrice: number): Promise<void> {
    const pendingOrders = this.orders.filter(
      o => o.status === 'pending' && o.symbol === symbol
    );

    for (const order of pendingOrders) {
      let shouldExecute = false;

      if (order.orderType === 'limit') {
        if (order.type === 'buy' && currentPrice <= order.limitPrice!) {
          shouldExecute = true;
        } else if (order.type === 'sell' && currentPrice >= order.limitPrice!) {
          shouldExecute = true;
        }
      } else if (order.orderType === 'stop-loss') {
        if (currentPrice <= order.stopPrice!) {
          shouldExecute = true;
        }
      }

      // Check expiration
      if (order.expiresAt && new Date() > order.expiresAt) {
        order.status = 'expired';
        await this.saveOrders();
        continue;
      }

      if (shouldExecute) {
        await this.executeOrder(order, currentPrice);
      }
    }
  }

  private async checkAlerts(symbol: string, currentPrice: number): Promise<void> {
    const activeAlerts = this.alerts.filter(
      a => a.isActive && a.symbol === symbol
    );

    for (const alert of activeAlerts) {
      let shouldTrigger = false;

      if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
        shouldTrigger = true;
      } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        alert.isActive = false;
        alert.triggeredAt = new Date();
        await this.saveAlerts();

        console.log(`Price alert triggered: ${symbol} ${alert.condition} $${alert.targetPrice}`);
        // Here you could send a push notification
      }
    }
  }

  private async executeOrder(order: Order, executionPrice: number): Promise<void> {
    try {
      console.log(`Executing order ${order.id}: ${order.type} ${order.amount} ${order.symbol} at $${executionPrice}`);

      // Create transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: order.type,
        orderType: order.orderType,
        symbol: order.symbol,
        amount: order.amount,
        price: executionPrice,
        total: order.amount * executionPrice,
        fee: order.amount * executionPrice * 0.001, // 0.1% fee
        timestamp: new Date(),
        status: 'completed',
        limitPrice: order.limitPrice,
        stopPrice: order.stopPrice,
        executedAt: new Date(),
      };

      // Update order status
      order.status = 'filled';
      order.filledAmount = order.amount;
      order.remainingAmount = 0;

      // Execute the trade using existing trading service
      const { tradingService } = await import('./tradingService');
      await tradingService.executeTrade(
        order.symbol,
        order.type,
        order.amount,
        executionPrice
      );

      await this.saveOrders();
      console.log(`Order ${order.id} executed successfully`);

    } catch (error) {
      console.error('Error executing order:', error);
      order.status = 'failed';
      await this.saveOrders();
    }
  }
}

export const orderService = new OrderService();
