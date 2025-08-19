import { useCallback } from 'react';
import { useSuperAdmin } from '../contexts/SuperAdminContext';

export interface UseAuthReturn {
  user: any;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { user, setUser, logout: logoutContext } = useSuperAdmin();

  const isAuthenticated = Boolean(user);

  const login = useCallback(async (credentials: any) => {
    try {
      // This would typically make an API call to authenticate
      console.log('Login with:', credentials);
      
      // Mock successful login
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: credentials.email,
        role: 'admin',
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [setUser]);

  const logout = useCallback(() => {
    logoutContext();
  }, [logoutContext]);

  const register = useCallback(async (userData: any) => {
    try {
      // This would typically make an API call to register
      console.log('Register with:', userData);
      
      // Mock successful registration
      const mockUser = {
        id: '2',
        name: userData.name,
        email: userData.email,
        role: 'user',
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, [setUser]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      // This would typically make an API call to send reset email
      console.log('Forgot password for:', email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      // This would typically make an API call to reset password
      console.log('Reset password with token:', token);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (userData: any) => {
    try {
      // This would typically make an API call to update profile
      console.log('Update profile with:', userData);
      
      if (user) {
        setUser({ ...user, ...userData });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, [user, setUser]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    updateProfile,
  };
}
