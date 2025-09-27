
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import CryptoCard from '../../components/CryptoCard';
import Icon from '../../components/Icon';
import { router } from 'expo-router';
import { useAppData } from '../../hooks/useAppData';
import { formatLargeNumber } from '../../utils/formatters';

export default function MarketsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { userData, cryptoAssets, loading, refreshing, error, refreshData, executeTrade } = useAppData();

  const filteredAssets = cryptoAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCryptoPress = (symbol: string) => {
    console.log(`Navigate to ${symbol} trading`);
    router.push(`/(tabs)/trade?symbol=${symbol.toLowerCase()}`);
  };

  const handleQuickTrade = async (type: 'buy' | 'sell', symbol: string) => {
    if (!userData) {
      Alert.alert('Error', 'User data not loaded');
      return;
    }

    const asset = cryptoAssets.find(a => a.symbol === symbol);
    if (!asset) {
      Alert.alert('Error', 'Asset not found');
      return;
    }

    // Quick trade with default amounts
    const defaultAmount = type === 'buy' ? 100 / asset.price : 0.001; // $100 worth or 0.001 units
    
    Alert.alert(
      `Quick ${type.toUpperCase()}`,
      `${type === 'buy' ? 'Buy' : 'Sell'} ${defaultAmount.toFixed(8)} ${symbol} at $${asset.price.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const result = await executeTrade(symbol, type, defaultAmount, asset.price);
              if (result.success) {
                Alert.alert('Success! 🎉', result.message);
              } else {
                Alert.alert('Trade Failed', result.message);
              }
            } catch (error) {
              console.error('Quick trade error:', error);
              Alert.alert('Error', 'Failed to execute trade');
            }
          },
        },
      ]
    );
  };

  // Calculate market stats from available data
  const totalMarketCap = cryptoAssets.reduce((sum, asset) => sum + asset.marketCap, 0);
  const totalVolume = cryptoAssets.reduce((sum, asset) => sum + asset.volume24h, 0);
  const btcAsset = cryptoAssets.find(asset => asset.symbol === 'BTC');
  const btcDominance = btcAsset && totalMarketCap > 0 
    ? ((btcAsset.marketCap / totalMarketCap) * 100).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading market data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Markets</Text>
          
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
          }
        >
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>
                ⚠️ Using cached data - {error}
              </Text>
            </View>
          )}

          <View style={styles.marketStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>{formatLargeNumber(totalMarketCap)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>24h Volume</Text>
              <Text style={styles.statValue}>{formatLargeNumber(totalVolume)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>BTC Dominance</Text>
              <Text style={styles.statValue}>{btcDominance}%</Text>
            </View>
          </View>

          <View style={styles.cryptoList}>
            <Text style={styles.listHeader}>
              {searchQuery ? `Search Results (${filteredAssets.length})` : 'Top Cryptocurrencies'}
            </Text>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <CryptoCard
                  key={asset.id}
                  asset={asset}
                  onPress={() => handleCryptoPress(asset.symbol)}
                  showTradeButtons={true}
                  onQuickTrade={handleQuickTrade}
                />
              ))
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>
                  No cryptocurrencies found matching "{searchQuery}"
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  marketStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cryptoList: {
    paddingBottom: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorBanner: {
    backgroundColor: colors.backgroundAlt,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning || '#F59E0B',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  errorBannerText: {
    fontSize: 14,
    color: colors.text,
  },
  noResults: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
