/* ===================================
   Storage Utility — LocalStorage helpers
   =================================== */

const USERS_KEY = 'vte_users';
const CURRENT_USER_KEY = 'vte_currentUser';
const DOCS_PREFIX = 'vte_docs_';

// --- User Auth ---

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(username) {
  const users = getUsers();
  if (!users.includes(username)) {
    users.push(username);
    saveUsers(users);
  }
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
