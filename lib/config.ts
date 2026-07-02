/**
 * Application configuration
 * Centralized config for API URLs and environment-specific settings
 */

export const config = {
  // API URL - defaults to localhost in development, use env variable in production
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  
  // Frontend URL - for password reset links
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

/**
 * Get full API endpoint URL
 * @param path - API path WITHOUT /api prefix (e.g., 'products', 'auth/login')
 * @returns Full URL (e.g., 'http://localhost:4000/api/products')
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Add /api prefix if not already present
  const finalPath = cleanPath.startsWith('api/') ? cleanPath : `api/${cleanPath}`;
  
  return `${config.apiUrl}/${finalPath}`;
}
