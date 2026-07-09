import type { Category } from "./types";
import { fetchProducts, ApiProduct } from "./api";

// Cache for categories
let cachedCategories: Category[] = [];
let lastCategoryFetchTime = 0;
const CATEGORY_CACHE_DURATION = 60000; // 1 minute

// Fetch categories from API
export async function getCategories(): Promise<Category[]> {
  const now = Date.now();
  
  // Return cache if valid
  if (cachedCategories.length > 0 && (now - lastCategoryFetchTime) < CATEGORY_CACHE_DURATION) {
    return cachedCategories;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiUrl}/api/categories`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('[getCategories] HTTP Error:', response.status);
      return cachedCategories; // Return existing cache if API fails
    }
    
    const data = await response.json();
    const categories = data.success ? data.data : [];
    
    // Only return active categories, sorted by sortOrder
    cachedCategories = categories
      .filter((cat: Category) => cat.isActive)
      .sort((a: Category, b: Category) => a.sortOrder - b.sortOrder);
    
    lastCategoryFetchTime = now;
    return cachedCategories;
  } catch (error) {
    console.error('[getCategories] Error:', error);
    return cachedCategories; // Return existing cache if error occurs
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(cat => cat.slug === slug) || null;
}

// Check if a slug is a valid category
export async function isValidCategorySlug(slug: string): Promise<boolean> {
  const category = await getCategoryBySlug(slug);
  return category !== null;
}
