
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import SimpleBottomSheet from '../../components/BottomSheet';
import { useAppData } from '../../hooks/useAppData';

export default function ProfileScreen() {
  const { userData, loading, updateSettings, clearAllData } = useAppData();
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleNotificationToggle = async (value: boolean) => {
    if (!userData) return;
    
    setIsUpdating(true);
    try {
      await updateSettings({ notifications: value });
      console.log('Notifications updated:', value);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (!userData) return;
    
    setIsUpdating(true);
    try {
      await updateSettings({ biometric: value });
      console.log('Biometric setting updated:', value);
    } catch (error) {
      Alert.alert('Error', 'Failed to update biometric settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear all your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'Logged out successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleSupport = () => {
    console.log('Opening support');
    Alert.alert(
      'Support', 
      'Contact support:\n\n📧 Email: support@cryptoapp.com\n📱 Phone: +1 (555) 123-4567\n💬 Live Chat: Available 24/7',
      [{ text: 'OK' }]
    );
  };

  const handleResetPortfolio = () => {
    setShowResetConfirm(true);
  };

  const confirmResetPortfolio = async () => {
    try {
      await clearAllData();
      setShowResetConfirm(false);
      Alert.alert(
        'Portfolio Reset', 
        'Your portfolio has been reset to default values with $10,000 starting balance.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset portfolio');
    }
  };

  const handleExportData = () => {
    if (!userData) return;
    
    const exportData = {
      portfolio: userData.portfolio,
      transactions: userData.transactions,
      balance: userData.balance,
      exportDate: new Date().toISOString(),
    };
    
    console.log('Export data:', JSON.stringify(exportData, null, 2));
    Alert.alert(
      'Data Export',
      'Your portfolio data has been logged to the console. In a real app, this would be saved to a file or sent via email.',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, styles.errorContainer]}>
          <Text style={styles.errorText}>Failed to load profile data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Profile</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Icon name="person" size={40} color={colors.primary} />
            </View>
            <Text style={styles.userName}>Crypto Trader</Text>
            <Text style={styles.userEmail}>trader@cryptoapp.com</Text>
            <Text style={styles.userBalance}>
              Balance: ${userData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <Button
              text="Payment Methods"
              onPress={() => Alert.alert('Payment Methods', 'Payment method management coming soon!')}
              style={styles.menuButton}
              textStyle={styles.menuButtonText}
            />

            <Button
              text="Security Settings"
              onPress={() => Alert.alert('Security', 'Advanced security settings coming soon!')}
              style={styles.menuButton}
              textStyle={styles.menuButtonText}
            />

            <Button
              text="Transaction History"
              onPress={() => Alert.alert('History', `You have ${userData.transactions.length} transactions in your history.`)}
              style={styles.menuButton}
              textStyle={styles.menuButtonText}
            />

            <Button
              text="Export Data"
              onPress={handleExportData}
              style={styles.menuButton}
              textStyle={styles.menuButtonText}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Icon name="notifications" size={24} color={colors.primary} />
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={userData.settings.notifications}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={userData.settings.notifications ? '#FFFFFF' : colors.textSecondary}
                disabled={isUpdating}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Icon name="finger-print" size={24} color={colors.primary} />
                <Text style={styles.settingText}>Biometric Login</Text>
              </View>
              <Switch
                value={userData.settings.biometric}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={userData.settings.biometric ? '#FFFFFF' : colors.textSecondary}
                disabled={isUpdating}
              />
            </View>

            <Button
              text="More Settings"
              onPress={() => setShowSettings(true)}
              style={styles.settingsButton}
              textStyle={styles.settingsButtonText}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support & Actions</Text>
            
            <Button
              text="Help & Support"
              onPress={handleSupport}
              style={styles.supportButton}
              textStyle={styles.supportButtonText}
            />

            <Button
              text="Reset Portfolio"
              onPress={handleResetPortfolio}
              style={styles.resetButton}
              textStyle={styles.resetButtonText}
            />

            <Button
              text="Logout & Clear Data"
              onPress={handleLogout}
              style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
            />
          </View>
        </ScrollView>

        <SimpleBottomSheet
          isVisible={showSettings}
          onClose={() => setShowSettings(false)}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Additional Settings</Text>
            <Text style={styles.bottomSheetText}>
              • Currency: {userData.settings.currency}
              {'\n'}• Notifications: {userData.settings.notifications ? 'Enabled' : 'Disabled'}
              {'\n'}• Biometric: {userData.settings.biometric ? 'Enabled' : 'Disabled'}
              {'\n'}• Portfolio Value: ${userData.portfolio.totalValue.toFixed(2)}
              {'\n'}• Total Transactions: {userData.transactions.length}
            </Text>
            <Button
              text="Close"
              onPress={() => setShowSettings(false)}
              style={styles.closeButton}
            />
          </View>
        </SimpleBottomSheet>

        <SimpleBottomSheet
          isVisible={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Reset Portfolio?</Text>
            <Text style={styles.bottomSheetText}>
              This will:
              {'\n'}• Clear all your assets
              {'\n'}• Delete transaction history
              {'\n'}• Reset balance to $10,000
              {'\n'}• Keep your settings
              {'\n\n'}This action cannot be undone!
            </Text>
            <View style={styles.buttonRow}>
              <Button
                text="Cancel"
                onPress={() => setShowResetConfirm(false)}
                style={[styles.closeButton, { flex: 1, marginRight: 8 }]}
              />
              <Button
                text="Reset"
                onPress={confirmResetPortfolio}
                style={[styles.resetButton, { flex: 1, marginLeft: 8 }]}
                textStyle={styles.resetButtonText}
              />
            </View>
          </View>
        </SimpleBottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  userBalance: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  menuButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  menuButtonText: {
    color: colors.text,
    textAlign: 'left',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  settingsButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  settingsButtonText: {
    color: colors.primary,
  },
  supportButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  supportButtonText: {
    color: colors.primary,
  },
  resetButton: {
    backgroundColor: colors.warning || '#F59E0B',
    marginBottom: 12,
  },
  resetButtonText: {
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: colors.danger,
  },
  logoutButtonText: {
    color: '#FFFFFF',
  },
  bottomSheetContent: {
    padding: 24,
    alignItems: 'center',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  bottomSheetText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  closeButton: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
  },
});
