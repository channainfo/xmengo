import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  profileCompleted: boolean;
  photos?: { id: string; url: string; isMain: boolean }[];
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  interestedIn?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Set up axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch user profile when token changes
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/profiles/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If token is invalid, clear it
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token } = response.data;
      
      // Store token in localStorage and state
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set up axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Fetch user profile
      await fetchUserProfile();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/register', { email, password, name });
      // After registration, log the user in
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear token from localStorage and state
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export as a named constant instead of a function declaration for better compatibility with Fast Refresh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
