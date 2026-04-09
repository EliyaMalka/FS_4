/* ===================================
   Storage Utility — LocalStorage helpers
   =================================== */

const USERS_KEY = 'vte_users';
const CURRENT_USER_KEY = 'vte_currentUser';
const DOCS_PREFIX = 'vte_docs_';

// --- User Auth ---

/**
 * Get all users. Returns array of { username, password } objects.
 * Auto-migrates old format (plain string array) to new format.
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);

    // Migration: if old format (array of strings), convert to objects
    if (parsed.length > 0 && typeof parsed[0] === 'string') {
      const migrated = parsed.map(name => ({ username: name, password: '1234' }));
      saveUsers(migrated);
      return migrated;
    }

    return parsed;
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
