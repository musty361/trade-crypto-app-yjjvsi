
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
  high24h?: number;
  low24h?: number;
  ath?: number;
  atl?: number;
  circulatingSupply?: number;
  totalSupply?: number;
}

export interface Portfolio {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  assets: PortfolioAsset[];
  performance: PortfolioPerformance;
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
  avgBuyPrice?: number;
  totalInvested?: number;
  unrealizedPnL?: number;
  unrealizedPnLPercent?: number;
}

export interface PortfolioPerformance {
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
  weekChange: number;
  weekChangePercent: number;
  monthChange: number;
  monthChangePercent: number;
  bestPerformer: string;
  worstPerformer: string;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop-loss';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  fee: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  limitPrice?: number;
  stopPrice?: number;
  executedAt?: Date;
}

export interface Order {
  id: string;
  type: 'buy' | 'sell';
  orderType: 'limit' | 'stop-loss';
  symbol: string;
  amount: number;
  price: number;
  limitPrice?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'expired';
  createdAt: Date;
  expiresAt?: Date;
  filledAmount?: number;
  remainingAmount?: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface MarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
  volumeChange24h: number;
  fearGreedIndex?: number;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevantSymbols: string[];
}
