
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Button from './Button';
import { formatCurrency, formatCrypto } from '../utils/formatters';

interface TradingFormProps {
  symbol: string;
  price: number;
  onTrade: (type: 'buy' | 'sell', amount: number) => void;
}

export default function TradingForm({ symbol, price, onTrade }: TradingFormProps) {
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const handleTrade = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    console.log(`${activeTab} ${numAmount} ${symbol} at ${price}`);
    onTrade(activeTab, numAmount);
    setAmount('');
  };

  const totalValue = parseFloat(amount) * price || 0;

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Button
          text="Buy"
          onPress={() => setActiveTab('buy')}
          style={[
            styles.tab,
            activeTab === 'buy' ? styles.activeTab : styles.inactiveTab
          ]}
          textStyle={[
            styles.tabText,
            activeTab === 'buy' ? styles.activeTabText : styles.inactiveTabText
          ]}
        />
        <Button
          text="Sell"
          onPress={() => setActiveTab('sell')}
          style={[
            styles.tab,
            activeTab === 'sell' ? styles.activeTab : styles.inactiveTab
          ]}
          textStyle={[
            styles.tabText,
            activeTab === 'sell' ? styles.activeTabText : styles.inactiveTabText
          ]}
        />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount ({symbol})</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder={`0.00 ${symbol}`}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.priceInfo}>
          <View style={commonStyles.row}>
            <Text style={styles.priceLabel}>Price per {symbol}:</Text>
            <Text style={styles.priceValue}>{formatCurrency(price)}</Text>
          </View>
          <View style={commonStyles.row}>
            <Text style={styles.priceLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
          </View>
        </View>

        <Button
          text={`${activeTab.toUpperCase()} ${symbol}`}
          onPress={handleTrade}
          style={[
            styles.tradeButton,
            { backgroundColor: activeTab === 'buy' ? colors.success : colors.danger }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    marginTop: 0,
    borderRadius: 6,
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inactiveTabText: {
    color: colors.textSecondary,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  priceInfo: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  tradeButton: {
    marginTop: 8,
  },
});
