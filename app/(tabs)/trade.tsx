
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import TradingForm from '../../components/TradingForm';
import CryptoCard from '../../components/CryptoCard';
import { useAppData } from '../../hooks/useAppData';
import { useLocalSearchParams } from 'expo-router';

export default function TradeScreen() {
  const { symbol: urlSymbol } = useLocalSearchParams();
  const { userData, cryptoAssets, loading, executeTrade } = useAppData();
  const [selectedAsset, setSelectedAsset] = useState(cryptoAssets[0]);
  const [isTrading, setIsTrading] = useState(false);

  // Set selected asset based on URL parameter or default to first asset
  useEffect(() => {
    if (cryptoAssets.length > 0) {
      if (urlSymbol && typeof urlSymbol === 'string') {
        const asset = cryptoAssets.find(
          (a) => a.symbol.toLowerCase() === urlSymbol.toLowerCase()
        );
        if (asset) {
          setSelectedAsset(asset);
          return;
        }
      }
      setSelectedAsset(cryptoAssets[0]);
    }
  }, [cryptoAssets, urlSymbol]);

  const handleTrade = async (type: 'buy' | 'sell', amount: number) => {
    if (!selectedAsset || !userData) {
      Alert.alert('Error', 'Unable to execute trade. Please try again.');
      return;
    }

    setIsTrading(true);
    console.log(`Executing ${type} order: ${amount} ${selectedAsset.symbol} at $${selectedAsset.price}`);

    try {
      const result = await executeTrade(
        selectedAsset.symbol,
        type,
        amount,
        selectedAsset.price
      );

      if (result.success) {
        Alert.alert(
          'Trade Successful! 🎉',
          `${result.message}\n\nNew Balance: $${result.newBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Trade Failed', result.message, [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Trade error:', error);
      Alert.alert('Error', 'Failed to execute trade. Please try again.', [{ text: 'OK' }]);
    } finally {
      setIsTrading(false);
    }
  };

  if (loading || !selectedAsset) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading trading data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, styles.errorContainer]}>
          <Text style={styles.errorText}>Unable to load user data</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get user's current holding of selected asset
  const currentHolding = userData.portfolio.assets.find(
    (asset) => asset.symbol === selectedAsset.symbol
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Trade</Text>
          <Text style={commonStyles.textSecondary}>
            Select a cryptocurrency to trade
          </Text>
          <View style={styles.balanceInfo}>
            <Text style={styles.balance}>
              Balance: ${userData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            {currentHolding && (
              <Text style={styles.holding}>
                Holdings: {currentHolding.amount.toFixed(8)} {selectedAsset.symbol}
              </Text>
            )}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.selectedAsset}>
            <Text style={styles.sectionTitle}>Selected Asset</Text>
            <CryptoCard
              asset={selectedAsset}
              onPress={() => console.log('Asset selected')}
            />
          </View>

          <TradingForm
            symbol={selectedAsset.symbol}
            price={selectedAsset.price}
            onTrade={handleTrade}
            isLoading={isTrading}
            userBalance={userData.balance}
            currentHolding={currentHolding?.amount || 0}
          />

          <View style={styles.otherAssets}>
            <Text style={styles.sectionTitle}>Other Assets</Text>
            {cryptoAssets
              .filter((asset) => asset.id !== selectedAsset.id)
              .slice(0, 10)
              .map((asset) => (
                <CryptoCard
                  key={asset.id}
                  asset={asset}
                  onPress={() => setSelectedAsset(asset)}
                />
              ))}
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
  balanceInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  holding: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  selectedAsset: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  otherAssets: {
    marginTop: 24,
    paddingBottom: 20,
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
});
