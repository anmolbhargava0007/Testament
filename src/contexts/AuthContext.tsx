import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_mobile: string;
  gender: string;
  is_active: boolean;
}

interface SignupData {
  user_name: string;
  user_email: string;
  user_pwd: string;
  user_mobile: string;
  gender: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Dummy login logic
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate delay

    if (email === 'test@nusummit.com' && password === '123456') {
      const dummyUser: User = {
        user_id: 1,
        user_name: 'Test User',
        user_email: email,
        user_mobile: '1234567890',
        gender: 'Other',
        is_active: true,
      };
      setUser(dummyUser);
      localStorage.setItem('user', JSON.stringify(dummyUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (userData: SignupData) => {
    // Dummy signup (not used in this dummy context)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const dummyUser: User = {
      user_id: 2,
      user_name: userData.user_name,
      user_email: userData.user_email,
      user_mobile: userData.user_mobile,
      gender: userData.gender,
      is_active: true,
    };
    setUser(dummyUser);
    localStorage.setItem('user', JSON.stringify(dummyUser));
  };

  const updateUser = async (userData: Partial<User>) => {
    // Dummy update (not used in this dummy context)
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};