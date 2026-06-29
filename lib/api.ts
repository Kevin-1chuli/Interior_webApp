const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function fetchProjects(): Promise<ApiProject[]> {
  try {
    const response = await fetch(`${API_URL}/projects`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}
