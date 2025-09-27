
import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import PortfolioCard from '../../components/PortfolioCard';
import CryptoCard from '../../components/CryptoCard';
import { router } from 'expo-router';
import { useAppData } from '../../hooks/useAppData';

export default function HomeScreen() {
  const { userData, cryptoAssets, loading, refreshing, error, refreshData, executeTrade } = useAppData();

  const handleCryptoPress = (symbol: string) => {
    console.log(`Navigate to ${symbol} details`);
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
      `${type === 'buy' ? 'Buy' : 'Sell'} ${defaultAmount.toFixed(8)} ${symbol} at ${asset.price.toFixed(2)}?`,
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

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, styles.errorContainer]}>
          <Text style={styles.errorText}>Failed to load data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView
        style={commonStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
      >
        <View style={styles.header}>
          <Text style={commonStyles.title}>Good morning!</Text>
          <Text style={commonStyles.textSecondary}>
            Here&apos;s your portfolio overview
          </Text>
          <Text style={styles.balance}>
            Available Balance: ${userData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        <PortfolioCard portfolio={userData.portfolio} />

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>
              ⚠️ Using cached data - {error}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Market Overview</Text>
          {cryptoAssets.slice(0, 8).map((asset) => (
            <CryptoCard
              key={asset.id}
              asset={asset}
              onPress={() => handleCryptoPress(asset.symbol)}
              showTradeButtons={true}
              onQuickTrade={handleQuickTrade}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  section: {
    paddingVertical: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
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
});
