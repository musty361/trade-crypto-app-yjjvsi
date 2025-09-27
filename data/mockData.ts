
import { CryptoAsset, Portfolio, Transaction, TradingPair } from '../types/crypto';

// Fallback data used when API is unavailable
export const mockCryptoAssets: CryptoAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 43250.50,
    change24h: 1250.30,
    changePercent24h: 2.98,
    marketCap: 847000000000,
    volume24h: 28500000000,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2650.75,
    change24h: -85.25,
    changePercent24h: -3.11,
    marketCap: 318000000000,
    volume24h: 15200000000,
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    price: 315.80,
    change24h: 12.45,
    changePercent24h: 4.10,
    marketCap: 47000000000,
    volume24h: 1800000000,
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 98.45,
    change24h: 5.67,
    changePercent24h: 6.12,
    marketCap: 43000000000,
    volume24h: 2100000000,
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.485,
    change24h: -0.025,
    changePercent24h: -4.90,
    marketCap: 17000000000,
    volume24h: 850000000,
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    price: 0.625,
    change24h: 0.045,
    changePercent24h: 7.76,
    marketCap: 34000000000,
    volume24h: 1200000000,
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 7.85,
    change24h: -0.32,
    changePercent24h: -3.92,
    marketCap: 9800000000,
    volume24h: 280000000,
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    price: 14.75,
    change24h: 0.89,
    changePercent24h: 6.42,
    marketCap: 8200000000,
    volume24h: 420000000,
  },
];

// Default portfolio for new users
export const mockPortfolio: Portfolio = {
  totalValue: 0,
  totalChange: 0,
  totalChangePercent: 0,
  assets: [],
};

// Sample transactions for demonstration
export const mockTransactions: Transaction[] = [];

export const mockTradingPairs: TradingPair[] = [
  {
    symbol: 'BTCUSDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    price: 43250.50,
    change24h: 1250.30,
    changePercent24h: 2.98,
    volume24h: 28500000000,
  },
  {
    symbol: 'ETHUSDT',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    price: 2650.75,
    change24h: -85.25,
    changePercent24h: -3.11,
    volume24h: 15200000000,
  },
  {
    symbol: 'BNBUSDT',
    baseAsset: 'BNB',
    quoteAsset: 'USDT',
    price: 315.80,
    change24h: 12.45,
    changePercent24h: 4.10,
    volume24h: 1800000000,
  },
];
