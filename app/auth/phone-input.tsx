
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { useAuth } from '../../hooks/useAuth';

export default function PhoneInputScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendVerificationCode } = useAuth();

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await sendVerificationCode(phoneNumber.trim());
      
      if (result.success) {
        // Show verification code for demo purposes
        Alert.alert(
          'Verification Code Sent! 📱',
          `For demo purposes, check the console for your verification code.\n\nIn a real app, this would be sent via SMS.`,
          [
            {
              text: 'Continue',
              onPress: () => {
                router.push({
                  pathname: '/auth/verify-code',
                  params: { phoneNumber: phoneNumber.trim() },
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error sending code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    
    return text;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="phone-portrait" size={60} color={colors.primary} />
          </View>
          <Text style={styles.title}>Welcome to CryptoTrade</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to get started with secure trading
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇺🇸 +1</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                placeholder="(555) 123-4567"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                maxLength={14}
                editable={!isLoading}
              />
            </View>
          </View>

          <Button
            text={isLoading ? 'Sending Code...' : 'Send Verification Code'}
            onPress={handleSendCode}
            style={[styles.sendButton, { opacity: isLoading ? 0.7 : 1 }]}
            disabled={isLoading}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Sending verification code...</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
          <Text style={styles.securityNote}>
            🔒 Your phone number is encrypted and secure
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
  },
  sendButton: {
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  securityNote: {
    fontSize: 12,
    color: colors.success,
    textAlign: 'center',
    fontWeight: '500',
  },
});
