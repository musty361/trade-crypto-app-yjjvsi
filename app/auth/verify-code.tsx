
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { useAuth } from '../../hooks/useAuth';

export default function VerifyCodeScreen() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const { verifyCode, resendCode } = useAuth();
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newCode.every(digit => digit !== '') && !isLoading) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not found. Please try again.');
      router.back();
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyCode(phoneNumber, codeToVerify);
      
      if (result.success) {
        // Navigate to welcome screen
        router.replace('/welcome');
      } else {
        Alert.alert('Verification Failed', result.message);
        // Clear the code inputs
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !phoneNumber) return;

    setIsLoading(true);
    
    try {
      const result = await resendCode(phoneNumber);
      
      if (result.success) {
        Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
        setCanResend(false);
        setResendTimer(60);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error resending code:', error);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="chatbubble-ellipses" size={60} color={colors.primary} />
          </View>
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null,
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                editable={!isLoading}
              />
            ))}
          </View>

          <Button
            text={isLoading ? 'Verifying...' : 'Verify Code'}
            onPress={() => handleVerifyCode()}
            style={[styles.verifyButton, { opacity: isLoading ? 0.7 : 1 }]}
            disabled={isLoading}
          />

          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend code in {resendTimer}s
              </Text>
            )}
          </View>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>
                {canResend ? 'Sending new code...' : 'Verifying code...'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Didn&apos;t receive the code? Check your messages or try resending.
          </Text>
          <Text style={styles.demoHint}>
            💡 Demo: Check the console for your verification code
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
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
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
  phoneNumber: {
    fontWeight: '600',
    color: colors.text,
  },
  form: {
    flex: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.background,
  },
  codeInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundAlt,
  },
  verifyButton: {
    marginTop: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 14,
    color: colors.textSecondary,
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
  },
  demoHint: {
    fontSize: 12,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
});
