/**
 * Authentication utilities for localStorage-based auth
 */

const AUTH_TOKEN_KEY = 'healthcare_auth_token';
const USER_DATA_KEY = 'healthcare_user_data';

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  clinicLocation?: string;
}

/**
 * Store authentication token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return !!token;
}

/**
 * Store user data in localStorage
 */
export function setUserData(userData: UserData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
}

/**
 * Get user data from localStorage
 */
export function getUserData(): UserData | null {
  if (typeof window !== 'undefined') {
    const userDataStr = localStorage.getItem(USER_DATA_KEY);
    if (userDataStr) {
      try {
        return JSON.parse(userDataStr) as UserData;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Generate a dummy auth token
 */
export function generateDummyToken(): string {
  return `dummy_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Clear all auth data (logout)
 */
export function logout(): void {
  removeAuthToken();
}

