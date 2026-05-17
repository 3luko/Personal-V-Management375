// session.js - Manages user session state using localStorage

const USER_STORAGE_KEY = "pvmLoggedInUser";
const TOKEN_STORAGE_KEY = "pvmAuthToken";

export function saveLoggedInUser(user, token) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function getLoggedInUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function clearLoggedInUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isLoggedIn() {
  return Boolean(getAuthToken() && getLoggedInUser());
}
