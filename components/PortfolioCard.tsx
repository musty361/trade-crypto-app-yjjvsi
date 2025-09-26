
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Portfolio } from '../types/crypto';
import { colors, commonStyles } from '../styles/commonStyles';
import { formatCurrency, formatPercent, getChangeColor } from '../utils/formatters';
import Icon from './Icon';

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export default function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const changeColor = getChangeColor(portfolio.totalChangePercent);
  const isPositive = portfolio.totalChangePercent >= 0;

  return (
    <View style={[commonStyles.card, styles.portfolioCard]}>
      <Text style={styles.label}>Total Portfolio Value</Text>
      <Text style={styles.totalValue}>{formatCurrency(portfolio.totalValue)}</Text>
      
      <View style={[commonStyles.row, styles.changeRow]}>
        <Icon 
          name={isPositive ? 'trending-up' : 'trending-down'} 
          size={20} 
          color={changeColor}
        />
        <Text style={[styles.changeAmount, { color: changeColor }]}>
          {formatCurrency(Math.abs(portfolio.totalChange))}
        </Text>
        <Text style={[styles.changePercent, { color: changeColor }]}>
          ({formatPercent(portfolio.totalChangePercent)})
        </Text>
      </View>
      
      <Text style={styles.timeframe}>24h change</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  portfolioCard: {
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  changeRow: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  changeAmount: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
  },
  changePercent: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeframe: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
