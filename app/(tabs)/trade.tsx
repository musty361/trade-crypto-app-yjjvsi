
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import TradingForm from '../../components/TradingForm';
import CryptoCard from '../../components/CryptoCard';
import { mockCryptoAssets } from '../../data/mockData';

export default function TradeScreen() {
  const [selectedAsset, setSelectedAsset] = useState(mockCryptoAssets[0]);

  const handleTrade = (type: 'buy' | 'sell', amount: number) => {
    console.log(`Trade executed: ${type} ${amount} ${selectedAsset.symbol}`);
    Alert.alert(
      'Trade Executed',
      `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${amount} ${selectedAsset.symbol}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Trade</Text>
          <Text style={commonStyles.textSecondary}>
            Select a cryptocurrency to trade
          </Text>
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
          />

          <View style={styles.otherAssets}>
            <Text style={styles.sectionTitle}>Other Assets</Text>
            {mockCryptoAssets
              .filter((asset) => asset.id !== selectedAsset.id)
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
});
