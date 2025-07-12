import { User } from '../types';

// Simulate password hashing (in a real app, this would be done on the server)
export const hashPassword = (password: string): string => {
  // This is just for demo purposes - never hash passwords on the client in production
  return btoa(password + 'salt');
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generateUserId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const sanitizeUserInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Session management
export const saveUserSession = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('sessionTimestamp', Date.now().toString());
};

export const getUserSession = (): User | null => {
  try {
    const userStr = localStorage.getItem('currentUser');
    const timestamp = localStorage.getItem('sessionTimestamp');
    
    if (!userStr || !timestamp) return null;
    
    // Check if session is older than 7 days
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    if (sessionAge > maxAge) {
      clearUserSession();
      return null;
    }
    
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const clearUserSession = (): void => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('sessionTimestamp');
};

export const isUserBanned = (user: User): boolean => {
  return user.isBanned;
};

export const canUserAccessAdmin = (user: User): boolean => {
  return user.role === 'admin' && !user.isBanned;
};