const USER_STORAGE_KEY = "pvmLoggedInUser";

export function saveLoggedInUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getLoggedInUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function clearLoggedInUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function isLoggedIn() {
  return Boolean(getLoggedInUser());
}
