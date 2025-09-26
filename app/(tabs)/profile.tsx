
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import SimpleBottomSheet from '../../components/BottomSheet';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('User logged out') }
      ]
    );
  };

  const handleSupport = () => {
    console.log('Opening support');
    Alert.alert('Support', 'Contact support at support@cryptoapp.com');
  };

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
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Icon name="card" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Payment Methods</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Icon name="shield-checkmark" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Security</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Icon name="document-text" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Transaction History</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Icon name="notifications" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : colors.textSecondary}
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Icon name="finger-print" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Biometric Login</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={biometricEnabled ? '#FFFFFF' : colors.textSecondary}
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
            <Text style={styles.sectionTitle}>Support</Text>
            
            <Button
              text="Help & Support"
              onPress={handleSupport}
              style={styles.supportButton}
              textStyle={styles.supportButtonText}
            />

            <Button
              text="Logout"
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
              More settings options will be available here.
            </Text>
            <Button
              text="Close"
              onPress={() => setShowSettings(false)}
              style={styles.closeButton}
            />
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
  menuItem: {
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
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
  },
  closeButton: {
    width: '100%',
  },
});
