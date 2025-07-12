import { useState, useEffect } from 'react';
import { User } from '../types';
import { getUserSession, saveUserSession, clearUserSession } from '../utils/auth';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const user = getUserSession();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    saveUserSession(user);
  };

  const logout = () => {
    setCurrentUser(null);
    clearUserSession();
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    saveUserSession(updatedUser);
  };

  return {
    currentUser,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!currentUser
  };
};