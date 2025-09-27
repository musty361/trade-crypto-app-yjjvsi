
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface QuickTradeButtonProps {
  type: 'buy' | 'sell';
  symbol: string;
  onPress: () => void;
}

export default function QuickTradeButton({ type, symbol, onPress }: QuickTradeButtonProps) {
  const isBuy = type === 'buy';
  const backgroundColor = isBuy ? colors.success : colors.danger;
  const iconName = isBuy ? 'add-circle' : 'remove-circle';

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Icon name={iconName} size={20} color="#FFFFFF" />
        <Text style={styles.text}>
          {isBuy ? 'Buy' : 'Sell'} {symbol}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
