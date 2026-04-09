/**
 * ==============================================
 * storage.js — ניהול אחסון מקומי (LocalStorage)
 * ==============================================
 * קובץ זה מנהל את כל הקריאה/כתיבה לאחסון המקומי של הדפדפן.
 * הנתונים נשמרים גם אחרי סגירת הדפדפן ופתיחתו מחדש.
 *
 * מבנה הנתונים ב-LocalStorage:
 *   - vte_users — מערך של אובייקטי משתמשים [{username, password}, ...]
 *   - vte_docs_{username} — מערך מסמכים שמורים של כל משתמש
 *   - vte_session_{username} — מצב הסשן (פתקים פתוחים, גם אם לא נשמרו)
 *
 * פונקציות עיקריות:
 *   - registerUser(username, password) — רישום משתמש חדש
 *   - validateUser(username, password) — אימות שם משתמש וסיסמא
 *   - getUserDocuments(username) — שליפת כל המסמכים השמורים של משתמש
 *   - saveDocument(username, doc) — שמירת מסמך (חדש או עדכון קיים)
 *   - deleteDocument(username, docId) — מחיקת מסמך לצמיתות
 */

const USERS_KEY = 'vte_users';
const CURRENT_USER_KEY = 'vte_currentUser';
const DOCS_PREFIX = 'vte_docs_';

// --- User Auth ---

/**
 * שליפת כל המשתמשים. מחזיר מערך של אובייקטי { username, password }.
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Find a user by username. Returns { username, password } or null.
 */
export function findUser(username) {
  const users = getUsers();
  return users.find(u => u.username === username) || null;
}

/**
 * Register a new user with username and password.
 * Returns { success: true } or { success: false, error: string }
 */
export function registerUser(username, password) {
  const users = getUsers();
  const exists = users.find(u => u.username === username);
  if (exists) {
    return { success: false, error: 'Username already taken' };
  }
  users.push({ username, password });
  saveUsers(users);
  return { success: true };
}

/**
 * Validate login credentials.
 * Returns { success: true } or { success: false, error: string }
 */
export function validateUser(username, password) {
  const user = findUser(username);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  if (user.password !== password) {
    return { success: false, error: 'Wrong password' };
  }
  return { success: true };
}

export function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY) || null;
}

export function setCurrentUser(username) {
  localStorage.setItem(CURRENT_USER_KEY, username);
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// --- Document Storage ---

function getDocsKey(username) {
  return DOCS_PREFIX + username;
}

export function getUserDocuments(username) {
  try {
    const data = localStorage.getItem(getDocsKey(username));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUserDocuments(username, documents) {
  localStorage.setItem(getDocsKey(username), JSON.stringify(documents));
}

export function saveDocument(username, document) {
  const docs = getUserDocuments(username);
  const existingIndex = docs.findIndex(d => d.id === document.id);
  if (existingIndex >= 0) {
    docs[existingIndex] = { ...document, updatedAt: Date.now() };
  } else {
    docs.push({ ...document, updatedAt: Date.now() });
  }
  saveUserDocuments(username, docs);
}

export function deleteDocument(username, docId) {
  const docs = getUserDocuments(username);
  const filtered = docs.filter(d => d.id !== docId);
  saveUserDocuments(username, filtered);
}
