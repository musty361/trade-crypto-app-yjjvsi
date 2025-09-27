
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#3B82F6',
  secondary: '#6366F1',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#06B6D4',
  
  background: '#FFFFFF',
  backgroundAlt: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  
  text: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  
  content: {
    flex: 1,
    paddingHorizontal: 16,
  } as ViewStyle,
  
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  } as ViewStyle,
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  } as TextStyle,
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  } as TextStyle,
  
  text: {
    fontSize: 16,
    color: colors.text,
  } as TextStyle,
  
  textSecondary: {
    fontSize: 16,
    color: colors.textSecondary,
  } as TextStyle,
  
  textMuted: {
    fontSize: 14,
    color: colors.textMuted,
  } as TextStyle,
  
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  } as TextStyle,
  
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  } as ViewStyle,
  
  shadow: {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  } as ViewStyle,
});
