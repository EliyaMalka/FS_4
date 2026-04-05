import { useState, useEffect, useCallback } from 'react';
import {
  getUsers,
  registerUser,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from '../utils/storage';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username) => {
    const trimmed = username.trim();
    if (!trimmed) return false;

    registerUser(trimmed);
    setCurrentUser(trimmed);
    setUser(trimmed);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearCurrentUser();
    setUser(null);
  }, []);

  const getAllUsers = useCallback(() => {
    return getUsers();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    getAllUsers,
  };
}
