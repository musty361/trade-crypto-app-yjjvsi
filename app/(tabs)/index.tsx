
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import PortfolioCard from '../../components/PortfolioCard';
import CryptoCard from '../../components/CryptoCard';
import { mockPortfolio, mockCryptoAssets } from '../../data/mockData';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    console.log('Refreshing data...');
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCryptoPress = (symbol: string) => {
    console.log(`Navigate to ${symbol} details`);
    router.push(`/crypto/${symbol.toLowerCase()}`);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView
        style={commonStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={commonStyles.title}>Good morning!</Text>
          <Text style={commonStyles.textSecondary}>
            Here&apos;s your portfolio overview
          </Text>
        </View>

        <PortfolioCard portfolio={mockPortfolio} />

        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Trending</Text>
          {mockCryptoAssets.slice(0, 5).map((asset) => (
            <CryptoCard
              key={asset.id}
              asset={asset}
              onPress={() => handleCryptoPress(asset.symbol)}
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
  section: {
    paddingVertical: 16,
  },
});
