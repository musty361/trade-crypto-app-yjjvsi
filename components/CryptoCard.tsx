
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CryptoAsset } from '../types/crypto';
import { colors, commonStyles } from '../styles/commonStyles';
import { formatCurrency, formatPercent, getChangeColor } from '../utils/formatters';
import Icon from './Icon';

interface CryptoCardProps {
  asset: CryptoAsset;
  onPress?: () => void;
}

export default function CryptoCard({ asset, onPress }: CryptoCardProps) {
  const changeColor = getChangeColor(asset.changePercent24h);
  const isPositive = asset.changePercent24h >= 0;

  return (
    <TouchableOpacity style={[commonStyles.card, styles.card]} onPress={onPress} activeOpacity={0.7}>
      <View style={commonStyles.row}>
        <View style={styles.leftSection}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbol}>{asset.symbol}</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{asset.name}</Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={styles.price}>{formatCurrency(asset.price)}</Text>
          <View style={[commonStyles.row, styles.changeContainer]}>
            <Icon 
              name={isPositive ? 'trending-up' : 'trending-down'} 
              size={16} 
              color={changeColor}
            />
            <Text style={[styles.change, { color: changeColor }]}>
              {formatPercent(asset.changePercent24h)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
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
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  changeContainer: {
    alignItems: 'center',
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
