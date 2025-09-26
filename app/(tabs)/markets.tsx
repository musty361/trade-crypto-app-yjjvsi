
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import CryptoCard from '../../components/CryptoCard';
import Icon from '../../components/Icon';
import { mockCryptoAssets } from '../../data/mockData';
import { router } from 'expo-router';

export default function MarketsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredAssets = mockCryptoAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = async () => {
    console.log('Refreshing market data...');
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCryptoPress = (symbol: string) => {
    console.log(`Navigate to ${symbol} trading`);
    router.push(`/crypto/${symbol.toLowerCase()}`);
  };

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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.marketStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>$1.2T</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>24h Volume</Text>
              <Text style={styles.statValue}>$45.8B</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>BTC Dominance</Text>
              <Text style={styles.statValue}>52.3%</Text>
            </View>
          </View>

          <View style={styles.cryptoList}>
            {filteredAssets.map((asset) => (
              <CryptoCard
                key={asset.id}
                asset={asset}
                onPress={() => handleCryptoPress(asset.symbol)}
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
});
