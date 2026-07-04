import { config } from "@/lib/config";

// Direct API URL without getApiUrl wrapper to avoid double /api/
const API_BASE_URL = config.apiUrl;

// Log the API base URL for debugging
console.log('[lib/api.ts] API_BASE_URL:', API_BASE_URL);
console.log('[lib/api.ts] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'NOT SET');

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  currency: string;
  images: string[];
  materials: string[];
  dimensions: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProject {
  id: string;
  title: string;
  location: string;
  category: string;
  style: string;
  problem: string;
  solution: string;
  beforeImages: string[];
  afterImages: string[];
  budgetRange: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  try {
    const url = `${API_BASE_URL}/api/products`;
    console.log('[fetchProducts] Fetching from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for fresh data
    });
    
    if (!response.ok) {
      console.error('[fetchProducts] HTTP Error:', response.status, response.statusText);
      console.error('[fetchProducts] URL was:', url);
      return [];
    }
    
    const data = await response.json();
    console.log('[fetchProducts] Success, got', data.data?.length || 0, 'products');
    return data.success ? data.data : [];
  } catch (error) {
    console.error('[fetchProducts] Network/Parse Error:', error);
    console.error('[fetchProducts] API_BASE_URL:', API_BASE_URL);
    return [];
  }
}

export async function fetchProjects(): Promise<ApiProject[]> {
  try {
    const url = `${API_BASE_URL}/api/projects`;
    console.log('[fetchProjects] Fetching from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for fresh data
    });
    
    if (!response.ok) {
      console.error('[fetchProjects] HTTP Error:', response.status, response.statusText);
      console.error('[fetchProjects] URL was:', url);
      return [];
    }
    
    const data = await response.json();
    console.log('[fetchProjects] Success, got', data.data?.length || 0, 'projects');
    return data.success ? data.data : [];
  } catch (error) {
    console.error('[fetchProjects] Network/Parse Error:', error);
    console.error('[fetchProjects] API_BASE_URL:', API_BASE_URL);
    return [];
  }
}
