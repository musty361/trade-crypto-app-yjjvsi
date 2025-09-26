
export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  image?: string;
}

export interface Portfolio {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  assets: PortfolioAsset[];
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  price: number;
  change24h: number;
  changePercent24h: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
}
