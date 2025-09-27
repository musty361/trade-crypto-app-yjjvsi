
import { useState, useEffect, useCallback } from 'react';
import { storageService, UserData } from '../services/storageService';
import { cryptoApi } from '../services/cryptoApi';
import { tradingService } from '../services/tradingService';
import { CryptoAsset } from '../types/crypto';

export function useAppData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    try {
      const data = await storageService.getUserData();
      setUserData(data);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    }
  }, []);

  const loadCryptoData = useCallback(async () => {
    try {
      const data = await cryptoApi.getCryptocurrencies(20);
      const convertedData = data.map(item => cryptoApi.convertApiResponse(item));
      setCryptoAssets(convertedData);
      setError(null);
    } catch (err) {
      console.error('Error loading crypto data:', err);
      setError('Failed to load market data');
      
      // Use fallback data if API fails
      const { mockCryptoAssets } = await import('../data/mockData');
      setCryptoAssets(mockCryptoAssets);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadUserData(),
        loadCryptoData(),
        userData ? tradingService.updatePortfolioPrices() : Promise.resolve(),
      ]);
      
      // Reload user data to get updated portfolio
      if (userData) {
        await loadUserData();
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setRefreshing(false);
    }
  }, [loadUserData, loadCryptoData, userData]);

  const executeTrade = useCallback(async (
    symbol: string,
    type: 'buy' | 'sell',
    amount: number,
    price: number
  ) => {
    if (!userData) return { success: false, message: 'User data not loaded' };
    
    const result = await tradingService.executeTrade(symbol, type, amount, price);
    
    if (result.success) {
      // Reload user data to reflect changes
      await loadUserData();
    }
    
    return result;
  }, [userData, loadUserData]);

  const updateSettings = useCallback(async (settings: Partial<UserData['settings']>) => {
    try {
      await storageService.updateSettings(settings);
      await loadUserData();
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  }, [loadUserData]);

  const clearAllData = useCallback(async () => {
    try {
      await storageService.clearAllData();
      await loadUserData();
    } catch (err) {
      console.error('Error clearing data:', err);
      throw err;
    }
  }, [loadUserData]);

  // Initial data load
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadUserData(), loadCryptoData()]);
      } catch (err) {
        console.error('Error initializing data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [loadUserData, loadCryptoData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing) {
        refreshData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshData, refreshing]);

  return {
    userData,
    cryptoAssets,
    loading,
    refreshing,
    error,
    refreshData,
    executeTrade,
    updateSettings,
    clearAllData,
  };
}
