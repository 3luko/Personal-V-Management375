// client/scripts/api.js
// Utility functions for making API requests to the backend
import { getAuthToken } from "./session.js";
const API_BASE_URL = "http://localhost:3000/api";

export async function apiRequest(path, options = {}) {
  try {
    const token = getAuthToken();

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers: headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}
