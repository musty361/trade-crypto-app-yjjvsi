
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Button from './Button';
import { formatCurrency, formatCrypto } from '../utils/formatters';

interface TradingFormProps {
  symbol: string;
  price: number;
  onTrade: (type: 'buy' | 'sell', amount: number) => Promise<void>;
  isLoading?: boolean;
  userBalance: number;
  currentHolding: number;
}

export default function TradingForm({ 
  symbol, 
  price, 
  onTrade, 
  isLoading = false,
  userBalance,
  currentHolding
}: TradingFormProps) {
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const handleTrade = async () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    const totalValue = numAmount * price;

    // Validation
    if (activeTab === 'buy') {
      if (totalValue > userBalance) {
        Alert.alert(
          'Insufficient Balance', 
          `You need $${totalValue.toFixed(2)} but only have $${userBalance.toFixed(2)}`
        );
        return;
      }
    } else {
      if (numAmount > currentHolding) {
        Alert.alert(
          'Insufficient Holdings', 
          `You only have ${currentHolding.toFixed(8)} ${symbol} but trying to sell ${numAmount}`
        );
        return;
      }
    }

    // Confirmation dialog
    Alert.alert(
      'Confirm Trade',
      `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${numAmount} ${symbol} for ${formatCurrency(totalValue)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: async () => {
            await onTrade(activeTab, numAmount);
            setAmount('');
          }
        }
      ]
    );
  };

  const totalValue = parseFloat(amount) * price || 0;
  const maxBuyAmount = userBalance / price;
  const maxSellAmount = currentHolding;

  const handleMaxPress = () => {
    if (activeTab === 'buy') {
      setAmount(maxBuyAmount.toFixed(8));
    } else {
      setAmount(maxSellAmount.toFixed(8));
    }
  };

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
          <View style={styles.labelRow}>
            <Text style={styles.label}>Amount ({symbol})</Text>
            <Button
              text="MAX"
              onPress={handleMaxPress}
              style={styles.maxButton}
              textStyle={styles.maxButtonText}
            />
          </View>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder={`0.00 ${symbol}`}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
            editable={!isLoading}
          />
          <Text style={styles.maxInfo}>
            Max {activeTab}: {activeTab === 'buy' 
              ? `${formatCrypto(maxBuyAmount)} ${symbol}` 
              : `${formatCrypto(maxSellAmount)} ${symbol}`
            }
          </Text>
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
          {activeTab === 'buy' && (
            <View style={commonStyles.row}>
              <Text style={styles.priceLabel}>Remaining Balance:</Text>
              <Text style={styles.remainingBalance}>
                {formatCurrency(Math.max(0, userBalance - totalValue))}
              </Text>
            </View>
          )}
        </View>

        <Button
          text={
            isLoading 
              ? `${activeTab.toUpperCase()}ING...` 
              : `${activeTab.toUpperCase()} ${symbol}`
          }
          onPress={handleTrade}
          style={[
            styles.tradeButton,
            { 
              backgroundColor: activeTab === 'buy' ? colors.success : colors.danger,
              opacity: isLoading ? 0.7 : 1
            }
          ]}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Processing trade...</Text>
          </View>
        )}
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  maxButton: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  maxButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
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
  maxInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  remainingBalance: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  tradeButton: {
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
