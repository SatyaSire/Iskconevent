import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users database
const mockUsers = [
  {
    id: 'admin1',
    name: 'ISKCON Admin',
    email: 'admin@iskcon.org',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: 'user1',
    name: 'Devotee Krishna Das',
    email: 'krishna@devotee.com',
    password: 'krishna123',
    role: 'user' as const,
  },
  {
    id: 'user2',
    name: 'Devotee Radha Devi',
    email: 'radha@devotee.com',
    password: 'radha123',
    role: 'user' as const,
  },
];

// Validation functions
const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

const validateName = (name: string): string | null => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters long';
  if (name.trim().length > 50) return 'Name must be less than 50 characters';
  return null;
};

// Logging function
const logAuthOperation = (operation: string, data?: any, error?: any) => {
  const timestamp = new Date().toISOString();
  if (error) {
    console.error(`[${timestamp}] AUTH Error - ${operation}:`, error, data);
  } else {
    console.log(`[${timestamp}] AUTH Success - ${operation}:`, data);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        logAuthOperation('INITIALIZE_AUTH_START');
        setLoading(true);

        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const token = localStorage.getItem('iskcon_token');
        const savedUser = localStorage.getItem('iskcon_user');
        
        if (token && savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            
            // Validate stored user data
            if (userData.id && userData.email && userData.name && userData.role) {
              // Verify user still exists in mock database
              const existingUser = mockUsers.find(u => u.id === userData.id);
              if (existingUser) {
                setUser(userData);
                logAuthOperation('INITIALIZE_AUTH_SUCCESS', { userId: userData.id, email: userData.email });
              } else {
                // User no longer exists, clear storage
                localStorage.removeItem('iskcon_token');
                localStorage.removeItem('iskcon_user');
                logAuthOperation('INITIALIZE_AUTH_USER_NOT_FOUND', { userId: userData.id });
              }
            } else {
              // Invalid user data, clear storage
              localStorage.removeItem('iskcon_token');
              localStorage.removeItem('iskcon_user');
              logAuthOperation('INITIALIZE_AUTH_INVALID_DATA');
            }
          } catch (parseError) {
            // Corrupted data, clear storage
            localStorage.removeItem('iskcon_token');
            localStorage.removeItem('iskcon_user');
            logAuthOperation('INITIALIZE_AUTH_PARSE_ERROR', {}, parseError);
          }
        } else {
          logAuthOperation('INITIALIZE_AUTH_NO_STORED_DATA');
        }
      } catch (error) {
        logAuthOperation('INITIALIZE_AUTH_ERROR', {}, error);
        // Clear potentially corrupted data
        localStorage.removeItem('iskcon_token');
        localStorage.removeItem('iskcon_user');
      } finally {
        setLoading(false);
        setIsInitialized(true);
        logAuthOperation('INITIALIZE_AUTH_COMPLETE');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      logAuthOperation('LOGIN_START', { email });
      setLoading(true);

      // Validate input
      const emailError = validateEmail(email);
      if (emailError) {
        throw new Error(emailError);
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        throw new Error(passwordError);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find user in mock database
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('No account found with this email address');
      }

      if (foundUser.password !== password) {
        throw new Error('Incorrect password. Please try again');
      }

      // Create user object (without password)
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };

      // Generate mock token
      const token = `iskcon_token_${foundUser.id}_${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('iskcon_token', token);
      localStorage.setItem('iskcon_user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      logAuthOperation('LOGIN_SUCCESS', { 
        userId: userData.id, 
        email: userData.email, 
        role: userData.role 
      });
      
      toast.success(`Hare Krishna! Welcome back, ${userData.name}`, {
        duration: 4000,
        icon: '🙏',
      });
      
    } catch (error: any) {
      logAuthOperation('LOGIN_ERROR', { email }, error);
      toast.error(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      logAuthOperation('REGISTER_START', { name, email });
      setLoading(true);

      // Validate input
      const nameError = validateName(name);
      if (nameError) {
        throw new Error(nameError);
      }

      const emailError = validateEmail(email);
      if (emailError) {
        throw new Error(emailError);
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        throw new Error(passwordError);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        throw new Error('An account with this email already exists. Please login instead.');
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: 'user' as const,
      };

      // Add to mock database
      mockUsers.push(newUser);

      // Create user object (without password)
      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      // Generate mock token
      const token = `iskcon_token_${newUser.id}_${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('iskcon_token', token);
      localStorage.setItem('iskcon_user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      logAuthOperation('REGISTER_SUCCESS', { 
        userId: userData.id, 
        email: userData.email, 
        name: userData.name 
      });
      
      toast.success(`Hare Krishna! Welcome to ISKCON, ${userData.name}! Your spiritual journey begins now.`, {
        duration: 5000,
        icon: '🕉️',
      });
      
    } catch (error: any) {
      logAuthOperation('REGISTER_ERROR', { name, email }, error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    try {
      logAuthOperation('LOGOUT_START', { userId: user?.id });

      // Clear localStorage
      localStorage.removeItem('iskcon_token');
      localStorage.removeItem('iskcon_user');
      
      // Clear state
      setUser(null);
      
      logAuthOperation('LOGOUT_SUCCESS');
      
      toast.success('Hare Krishna! May Krishna bless you. Come back soon.', {
        duration: 3000,
        icon: '🙏',
      });
      
    } catch (error) {
      logAuthOperation('LOGOUT_ERROR', { userId: user?.id }, error);
      toast.error('Error during logout. Please try again.');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated,
    isAdmin,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};