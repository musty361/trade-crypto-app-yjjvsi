
import { useState, useEffect, useCallback } from 'react';
import { authService, AuthResult, VerificationResult } from '../services/authService';
import { AuthState, User } from '../types/crypto';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const loadAuthState = useCallback(async () => {
    try {
      const state = await authService.getAuthState();
      setAuthState(state);
    } catch (error) {
      console.error('Error loading auth state:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  }, []);

  const sendVerificationCode = useCallback(async (phoneNumber: string): Promise<AuthResult> => {
    try {
      const result = await authService.sendVerificationCode(phoneNumber);
      return result;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return {
        success: false,
        message: 'Failed to send verification code',
      };
    }
  }, []);

  const verifyCode = useCallback(async (phoneNumber: string, code: string): Promise<VerificationResult> => {
    try {
      const result = await authService.verifyCode(phoneNumber, code);
      
      if (result.success && result.user) {
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          isLoading: false,
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        message: 'Failed to verify code',
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User['profile']>): Promise<AuthResult> => {
    try {
      const result = await authService.updateUserProfile(updates);
      
      if (result.success && result.user) {
        setAuthState(prev => ({
          ...prev,
          user: result.user!,
        }));
      }
      
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: 'Failed to update profile',
      };
    }
  }, []);

  const resendCode = useCallback(async (phoneNumber: string): Promise<AuthResult> => {
    try {
      const result = await authService.resendVerificationCode(phoneNumber);
      return result;
    } catch (error) {
      console.error('Error resending code:', error);
      return {
        success: false,
        message: 'Failed to resend verification code',
      };
    }
  }, []);

  // Load auth state on mount
  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  return {
    ...authState,
    sendVerificationCode,
    verifyCode,
    logout,
    updateProfile,
    resendCode,
    refreshAuthState: loadAuthState,
  };
}
