
import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import PortfolioCard from '../../components/PortfolioCard';
import TransactionItem from '../../components/TransactionItem';
import { formatCurrency, formatCrypto } from '../../utils/formatters';
import { useAppData } from '../../hooks/useAppData';

export default function PortfolioScreen() {
  const { userData, loading, refreshing, refreshData } = useAppData();

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, styles.errorContainer]}>
          <Text style={styles.errorText}>Failed to load portfolio data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Portfolio</Text>
          <Text style={styles.balance}>
            Available Balance: ${userData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
          }
        >
          <PortfolioCard portfolio={userData.portfolio} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Assets</Text>
            {userData.portfolio.assets.length > 0 ? (
              userData.portfolio.assets.map((asset) => (
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
                        <Text style={styles.assetPrice}>
                          @ {formatCurrency(asset.price)}
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
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No assets in your portfolio yet.
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Start trading to build your portfolio!
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {userData.transactions.length > 0 ? (
              userData.transactions.slice(0, 20).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No transactions yet.
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Your trading history will appear here.
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
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
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
  assetPrice: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
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
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
