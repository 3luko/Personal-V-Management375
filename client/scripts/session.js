// session.js - Manages user session state using localStorage

const USER_STORAGE_KEY = "pvmLoggedInUser";
const TOKEN_STORAGE_KEY = "pvmAuthToken";

export function saveLoggedInUser(user, token) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  } catch (error) {
    console.error("Error occurred while saving logged-in user:", error);
  }
}

export function getLoggedInUser() {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error occurred while retrieving logged-in user:", error);
    return null;
  }
}

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Error occurred while retrieving auth token:", error);
    return null;
  }
}

export function clearLoggedInUser() {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Error occurred while clearing logged-in user:", error);
  }
}

export function isLoggedIn() {
  try {
    const user = getLoggedInUser();
    const token = getAuthToken();
    return Boolean(user && token);
  } catch (error) {
    console.error("Error occurred while checking login status:", error);
    return false;
  }
}
