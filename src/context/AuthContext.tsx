import React, { createContext, useContext, useState } from 'react';
import { AuthContextType, User } from '../types';
import { useApp } from './AppContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const testAccounts = [
  { username: 'husband', password: '123' },
  { username: 'wife', password: '123' }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useApp();
  const [user, setUser] = useState<User | null>(state.currentUser);

  const login = (username: string, password: string): boolean => {
    const account = testAccounts.find(
      acc => acc.username === username && acc.password === password
    );
    
    if (account) {
      const userData = state.users.find(u => u.username === username);
      if (userData) {
        setUser(userData);
        dispatch({ type: 'LOGIN', payload: userData });
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ user: state.currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}