/**
 * ==============================================
 * useAuth.js — הוק אימות משתמשים (Authentication)
 * ==============================================
 * הוק מותאם אישית שמנהל את כל מה שקשור להתחברות והרשמה:
 *
 * מצב (State):
 *   - user — שם המשתמש המחובר (או null אם לא מחובר)
 *   - isAuthenticated — האם יש משתמש מחובר כרגע
 *   - isLoading — האם המערכת בודקת אם יש משתמש שנשמר (בטעינה ראשונית)
 *
 * פונקציות:
 *   - login(username, password) — ניסיון התחברות, מחזיר {success, error}
 *   - register(username, password, confirmPassword) — רישום משתמש חדש
 *     כולל בדיקות: אורך שם (3+), אורך סיסמא (4+), התאמת סיסמאות, שם לא תפוס
 *   - logout() — התנתקות ומחיקת המשתמש מה-session
 *
 * הנתונים נשמרים ב-LocalStorage כך שמשתמש יכול לסגור ולפתוח את הדפדפן
 * בלי להזדקק להתחבר מחדש (אלא אם התנתק).
 */
import { useState, useEffect, useCallback } from 'react';
import {
  validateUser,
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

  /**
   * Login with username + password.
   * Returns { success, error? }
   */
  const login = useCallback((username, password) => {
    const trimmed = username.trim();
    if (!trimmed) return { success: false, error: 'Please enter a username' };
    if (!password) return { success: false, error: 'Please enter a password' };

    const result = validateUser(trimmed, password);
    if (result.success) {
      setCurrentUser(trimmed);
      setUser(trimmed);
    }
    return result;
  }, []);

  /**
   * Register a new account with username + password.
   * Returns { success, error? }
   */
  const register = useCallback((username, password, confirmPassword) => {
    const trimmed = username.trim();
    if (!trimmed) return { success: false, error: 'Please enter a username' };
    if (trimmed.length < 2) return { success: false, error: 'Username must be at least 2 characters' };
    if (trimmed.length > 20) return { success: false, error: 'Username must be 20 characters or less' };
    if (!password) return { success: false, error: 'Please enter a password' };
    if (password.length < 4) return { success: false, error: 'Password must be at least 4 characters' };
    if (password !== confirmPassword) return { success: false, error: 'Passwords do not match' };

    const result = registerUser(trimmed, password);
    if (result.success) {
      setCurrentUser(trimmed);
      setUser(trimmed);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    clearCurrentUser();
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}
