import { config } from "@/lib/config";

// Direct API URL without getApiUrl wrapper to avoid double /api/
const API_BASE_URL = config.apiUrl;

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
    console.log('Fetching products from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for fresh data
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products:', response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function fetchProjects(): Promise<ApiProject[]> {
  try {
    const url = `${API_BASE_URL}/api/projects`;
    console.log('Fetching projects from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for fresh data
    });
    
    if (!response.ok) {
      console.error('Failed to fetch projects:', response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}
