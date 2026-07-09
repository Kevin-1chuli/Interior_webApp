// Authentication utility functions
// Follows security best practices for JWT handling

export interface User {
  id: string;
  username: string;
  email: string | null;
  role: 'MANAGER' | 'STAFF';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

const TOKEN_KEY = 'ngb_admin_token';
const USER_KEY = 'ngb_admin_user';

/**
 * Securely store authentication token and user data
 */
export function setAuth(token: string, user: User): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Retrieve stored authentication token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Retrieve stored user data
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Clear all authentication data
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken() && !!getUser();
}

/**
 * Check if user has MANAGER role
 */
export function isManager(): boolean {
  const user = getUser();
  return user?.role === 'MANAGER';
}

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}
