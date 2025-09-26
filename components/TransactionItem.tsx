
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types/crypto';
import { colors, commonStyles } from '../styles/commonStyles';
import { formatCurrency, formatCrypto, formatDate } from '../utils/formatters';
import Icon from './Icon';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isBuy = transaction.type === 'buy';
  const typeColor = isBuy ? colors.success : colors.danger;
  const iconName = isBuy ? 'arrow-down' : 'arrow-up';

  return (
    <View style={[commonStyles.card, styles.card]}>
      <View style={commonStyles.row}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: typeColor }]}>
            <Icon name={iconName} size={16} color="#FFFFFF" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.type}>
              {isBuy ? 'Buy' : 'Sell'} {transaction.symbol}
            </Text>
            <Text style={styles.date}>
              {formatDate(transaction.timestamp)}
            </Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={styles.amount}>
            {formatCrypto(transaction.amount)} {transaction.symbol}
          </Text>
          <Text style={styles.total}>
            {formatCurrency(transaction.total)}
          </Text>
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(transaction.status) }]} />
        <Text style={[styles.status, { color: getStatusColor(transaction.status) }]}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </Text>
      </View>
    </View>
  );
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return colors.success;
    case 'pending':
      return colors.warning;
    case 'failed':
      return colors.danger;
    default:
      return colors.textSecondary;
  }
};

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
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  total: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
});
