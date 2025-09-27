
import { CryptoAsset } from '../types/crypto';

export interface PriceUpdate {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  timestamp: number;
}

type PriceUpdateCallback = (update: PriceUpdate) => void;
type ConnectionStatusCallback = (connected: boolean) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private subscribedSymbols = new Set<string>();
  private priceCallbacks = new Set<PriceUpdateCallback>();
  private statusCallbacks = new Set<ConnectionStatusCallback>();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // Using a public WebSocket API for crypto prices
  private readonly WS_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    console.log('Connecting to WebSocket...');

    try {
      this.ws = new WebSocket(this.WS_URL);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyStatusCallbacks(true);
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handlePriceUpdate(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.notifyStatusCallbacks(false);
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    console.log('Disconnecting WebSocket...');
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(symbols: string[]): void {
    symbols.forEach(symbol => {
      this.subscribedSymbols.add(symbol.toUpperCase());
    });
    console.log('Subscribed to symbols:', Array.from(this.subscribedSymbols));
  }

  unsubscribe(symbols: string[]): void {
    symbols.forEach(symbol => {
      this.subscribedSymbols.delete(symbol.toUpperCase());
    });
    console.log('Unsubscribed from symbols:', symbols);
  }

  onPriceUpdate(callback: PriceUpdateCallback): () => void {
    this.priceCallbacks.add(callback);
    return () => this.priceCallbacks.delete(callback);
  }

  onConnectionStatus(callback: ConnectionStatusCallback): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private handlePriceUpdate(data: any): void {
    try {
      // Handle Binance ticker array format
      if (Array.isArray(data)) {
        data.forEach((ticker: any) => {
          this.processTicker(ticker);
        });
      } else {
        this.processTicker(data);
      }
    } catch (error) {
      console.error('Error handling price update:', error);
    }
  }

  private processTicker(ticker: any): void {
    try {
      const symbol = ticker.s?.replace('USDT', ''); // Remove USDT suffix
      
      if (!symbol || !this.subscribedSymbols.has(symbol)) {
        return;
      }

      const update: PriceUpdate = {
        symbol,
        price: parseFloat(ticker.c || ticker.price || 0),
        change24h: parseFloat(ticker.P || ticker.priceChange || 0),
        changePercent24h: parseFloat(ticker.P || ticker.priceChangePercent || 0),
        volume24h: parseFloat(ticker.v || ticker.volume || 0),
        timestamp: Date.now(),
      };

      this.notifyPriceCallbacks(update);
    } catch (error) {
      console.error('Error processing ticker:', error);
    }
  }

  private notifyPriceCallbacks(update: PriceUpdate): void {
    this.priceCallbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in price callback:', error);
      }
    });
  }

  private notifyStatusCallbacks(connected: boolean): void {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in status callback:', error);
      }
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    console.log(`Scheduling reconnection in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        // Send ping to keep connection alive
        try {
          this.ws.send(JSON.stringify({ method: 'ping' }));
        } catch (error) {
          console.error('Error sending heartbeat:', error);
        }
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const websocketService = new WebSocketService();
