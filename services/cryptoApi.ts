
// Real cryptocurrency API service
export interface CryptoApiResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

export interface MarketStatsResponse {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number };
}

class CryptoApiService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 60000; // 1 minute cache

  private async fetchWithCache(url: string): Promise<any> {
    const cached = this.cache.get(url);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      console.log('Using cached data for:', url);
      return cached.data;
    }

    try {
      console.log('Fetching from API:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.cache.set(url, { data, timestamp: now });
      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log('Using expired cached data due to error');
        return cached.data;
      }
      
      throw error;
    }
  }

  async getCryptocurrencies(limit: number = 50): Promise<CryptoApiResponse[]> {
    const url = `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
    return this.fetchWithCache(url);
  }

  async getCryptocurrency(id: string): Promise<CryptoApiResponse> {
    const url = `${this.baseUrl}/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;
    const data = await this.fetchWithCache(url);
    return data[0];
  }

  async getMarketStats(): Promise<MarketStatsResponse> {
    const url = `${this.baseUrl}/global`;
    const response = await this.fetchWithCache(url);
    return response.data;
  }

  async searchCryptocurrencies(query: string): Promise<any[]> {
    const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}`;
    const response = await this.fetchWithCache(url);
    return response.coins.slice(0, 10);
  }

  // Convert API response to our internal format
  convertApiResponse(apiData: CryptoApiResponse) {
    return {
      id: apiData.id,
      symbol: apiData.symbol.toUpperCase(),
      name: apiData.name,
      price: apiData.current_price,
      change24h: apiData.price_change_24h,
      changePercent24h: apiData.price_change_percentage_24h,
      marketCap: apiData.market_cap,
      volume24h: apiData.total_volume,
      image: apiData.image,
    };
  }
}

export const cryptoApi = new CryptoApiService();
