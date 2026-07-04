/**
 * Application configuration
 * Centralized config for API URLs and environment-specific settings
 */

// Get API URL with runtime check for Vercel deployments
function getConfigApiUrl(): string {
  // Check if we're in browser
  if (typeof window !== 'undefined') {
    // In browser, check if we're in production
    const isProduction = window.location.hostname !== 'localhost';
    
    // If in production and NEXT_PUBLIC_API_URL not set, throw error
    if (isProduction && !process.env.NEXT_PUBLIC_API_URL) {
      console.error('❌ CRITICAL: NEXT_PUBLIC_API_URL not set in production!');
      console.error('Current hostname:', window.location.hostname);
      console.error('Falling back to localhost (will fail in production)');
    }
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}

export const config = {
  // API URL - defaults to localhost in development, use env variable in production
  apiUrl: getConfigApiUrl(),
  
  // Frontend URL - for password reset links
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Log configuration in browser for debugging
if (typeof window !== 'undefined') {
  console.log('=== Frontend Configuration ===');
  console.log('API URL:', config.apiUrl);
  console.log('Frontend URL:', config.frontendUrl);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Hostname:', window.location.hostname);
  console.log('NEXT_PUBLIC_API_URL env var:', process.env.NEXT_PUBLIC_API_URL || 'NOT SET');
  console.log('==============================');
}

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
  
  const fullUrl = `${config.apiUrl}/${finalPath}`;
  
  // Log API calls in development
  if (config.isDevelopment && typeof window !== 'undefined') {
    console.log('[API] Calling:', fullUrl);
  }
  
  return fullUrl;
}
