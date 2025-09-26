
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import PortfolioCard from '../../components/PortfolioCard';
import TransactionItem from '../../components/TransactionItem';
import { mockPortfolio, mockTransactions } from '../../data/mockData';
import { formatCurrency, formatCrypto } from '../../utils/formatters';

export default function PortfolioScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    console.log('Refreshing portfolio data...');
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Portfolio</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <PortfolioCard portfolio={mockPortfolio} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Assets</Text>
            {mockPortfolio.assets.map((asset) => (
              <View key={asset.id} style={[commonStyles.card, styles.assetCard]}>
                <View style={commonStyles.row}>
                  <View style={styles.assetInfo}>
                    <View style={styles.symbolContainer}>
                      <Text style={styles.symbol}>{asset.symbol}</Text>
                    </View>
                    <View>
                      <Text style={styles.assetName}>{asset.name}</Text>
                      <Text style={styles.assetAmount}>
                        {formatCrypto(asset.amount)} {asset.symbol}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.assetValue}>
                    <Text style={styles.value}>{formatCurrency(asset.value)}</Text>
                    <Text style={[
                      styles.change,
                      { color: asset.changePercent24h >= 0 ? colors.success : colors.danger }
                    ]}>
                      {asset.changePercent24h >= 0 ? '+' : ''}{asset.changePercent24h.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {mockTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  assetCard: {
    marginVertical: 4,
  },
  assetInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  symbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  assetAmount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  assetValue: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
  },
});
