
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types/crypto';

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  user?: User;
}

class AuthService {
  private readonly KEYS = {
    AUTH_STATE: 'auth_state',
    USER_DATA: 'user_data',
    PHONE_VERIFICATION: 'phone_verification',
  };

  // Simulate SMS sending (in real app, this would call a backend service)
  async sendVerificationCode(phoneNumber: string): Promise<AuthResult> {
    try {
      console.log(`Sending verification code to ${phoneNumber}`);
      
      // Validate phone number format
      if (!this.isValidPhoneNumber(phoneNumber)) {
        return {
          success: false,
          message: 'Please enter a valid phone number',
        };
      }

      // Generate a random 6-digit code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification data temporarily
      const verificationData = {
        phoneNumber,
        code: verificationCode,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        attempts: 0,
      };
      
      await AsyncStorage.setItem(
        this.KEYS.PHONE_VERIFICATION,
        JSON.stringify(verificationData)
      );

      // In a real app, you would send SMS here
      // For demo purposes, we'll show the code in console and store it for demo
      console.log(`🔐 DEMO: Verification code for ${phoneNumber}: ${verificationCode}`);
      
      return {
        success: true,
        message: `Verification code sent to ${phoneNumber}`,
      };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return {
        success: false,
        message: 'Failed to send verification code. Please try again.',
      };
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<VerificationResult> {
    try {
      const storedData = await AsyncStorage.getItem(this.KEYS.PHONE_VERIFICATION);
      
      if (!storedData) {
        return {
          success: false,
          message: 'No verification code found. Please request a new code.',
        };
      }

      const verificationData = JSON.parse(storedData);
      
      // Check if code has expired
      if (Date.now() > verificationData.expiresAt) {
        await AsyncStorage.removeItem(this.KEYS.PHONE_VERIFICATION);
        return {
          success: false,
          message: 'Verification code has expired. Please request a new code.',
        };
      }

      // Check if phone number matches
      if (verificationData.phoneNumber !== phoneNumber) {
        return {
          success: false,
          message: 'Phone number mismatch. Please try again.',
        };
      }

      // Increment attempts
      verificationData.attempts += 1;
      
      // Check if too many attempts
      if (verificationData.attempts > 3) {
        await AsyncStorage.removeItem(this.KEYS.PHONE_VERIFICATION);
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new code.',
        };
      }

      // Check if code matches
      if (verificationData.code !== code) {
        // Update attempts count
        await AsyncStorage.setItem(
          this.KEYS.PHONE_VERIFICATION,
          JSON.stringify(verificationData)
        );
        
        return {
          success: false,
          message: `Invalid verification code. ${3 - verificationData.attempts} attempts remaining.`,
        };
      }

      // Code is valid, create or login user
      const user = await this.createOrLoginUser(phoneNumber);
      
      // Clean up verification data
      await AsyncStorage.removeItem(this.KEYS.PHONE_VERIFICATION);
      
      return {
        success: true,
        message: 'Phone number verified successfully!',
        user,
      };
    } catch (error) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        message: 'Failed to verify code. Please try again.',
      };
    }
  }

  private async createOrLoginUser(phoneNumber: string): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByPhoneNumber(phoneNumber);
      
      if (existingUser) {
        // Update last login
        existingUser.lastLoginAt = new Date();
        await this.saveUser(existingUser);
        return existingUser;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        phoneNumber,
        isVerified: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        profile: {},
      };

      await this.saveUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating/logging in user:', error);
      throw error;
    }
  }

  private async getUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.KEYS.USER_DATA);
      if (!userData) return null;

      const users: User[] = JSON.parse(userData);
      return users.find(user => user.phoneNumber === phoneNumber) || null;
    } catch (error) {
      console.error('Error getting user by phone number:', error);
      return null;
    }
  }

  private async saveUser(user: User): Promise<void> {
    try {
      const userData = await AsyncStorage.getItem(this.KEYS.USER_DATA);
      let users: User[] = userData ? JSON.parse(userData) : [];
      
      const existingIndex = users.findIndex(u => u.id === user.id);
      
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }

      await AsyncStorage.setItem(this.KEYS.USER_DATA, JSON.stringify(users));
      
      // Update auth state
      const authState: AuthState = {
        isAuthenticated: true,
        user,
        isLoading: false,
      };
      
      await AsyncStorage.setItem(this.KEYS.AUTH_STATE, JSON.stringify(authState));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async getAuthState(): Promise<AuthState> {
    try {
      const authData = await AsyncStorage.getItem(this.KEYS.AUTH_STATE);
      
      if (!authData) {
        return {
          isAuthenticated: false,
          user: null,
          isLoading: false,
        };
      }

      const authState = JSON.parse(authData);
      
      // Convert date strings back to Date objects
      if (authState.user) {
        authState.user.createdAt = new Date(authState.user.createdAt);
        authState.user.lastLoginAt = new Date(authState.user.lastLoginAt);
      }
      
      return authState;
    } catch (error) {
      console.error('Error getting auth state:', error);
      return {
        isAuthenticated: false,
        user: null,
        isLoading: false,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.KEYS.AUTH_STATE);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async updateUserProfile(updates: Partial<User['profile']>): Promise<AuthResult> {
    try {
      const authState = await this.getAuthState();
      
      if (!authState.isAuthenticated || !authState.user) {
        return {
          success: false,
          message: 'User not authenticated',
        };
      }

      const updatedUser: User = {
        ...authState.user,
        profile: {
          ...authState.user.profile,
          ...updates,
        },
      };

      await this.saveUser(updatedUser);
      
      return {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        message: 'Failed to update profile',
      };
    }
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  async resendVerificationCode(phoneNumber: string): Promise<AuthResult> {
    // Remove existing verification data
    await AsyncStorage.removeItem(this.KEYS.PHONE_VERIFICATION);
    
    // Send new code
    return this.sendVerificationCode(phoneNumber);
  }
}

export const authService = new AuthService();
