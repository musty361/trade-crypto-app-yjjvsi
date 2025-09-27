
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export default function WelcomeScreen() {
  const { user } = useAuth();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name="checkmark-circle" size={80} color={colors.success} />
          </View>
          
          <Text style={styles.title}>Welcome to CryptoTrade! 🎉</Text>
          
          <Text style={styles.subtitle}>
            Your phone number has been verified successfully.
          </Text>
          
          <Text style={styles.phoneNumber}>
            {user?.phoneNumber}
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <Icon name="shield-checkmark" size={24} color={colors.primary} />
              <Text style={styles.featureText}>Secure Trading</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="trending-up" size={24} color={colors.primary} />
              <Text style={styles.featureText}>Real-time Data</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="wallet" size={24} color={colors.primary} />
              <Text style={styles.featureText}>$10,000 Demo Balance</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            text="Start Trading"
            onPress={handleContinue}
            style={styles.continueButton}
          />
          
          <View style={styles.autoRedirect}>
            <ActivityIndicator size="small" color={colors.textSecondary} />
            <Text style={styles.autoRedirectText}>
              Redirecting automatically in 3 seconds...
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 40,
  },
  features: {
    width: '100%',
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    marginBottom: 16,
  },
  autoRedirect: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoRedirectText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});
