import type { CatId, Prod } from "./types";
import { fetchProducts, ApiProduct } from "./api";
import { getCategories } from "./categories";

// Transform API product to frontend Prod format
function transformProduct(apiProduct: ApiProduct, index: number): Prod {
  return {
    id: index + 1, // Use index for UI compatibility
    name: apiProduct.name,
    price: `${apiProduct.currency} ${Number(apiProduct.price).toLocaleString()}`,
    desc: apiProduct.description || '',
    pid: apiProduct.images[0] || '1696762932825-2737db830bbe', // Use first image or fallback
    rating: 4.7 // Default rating
  };
}

// Group products by category dynamically
async function groupByCategory(products: ApiProduct[]): Promise<Record<CatId, Prod[]>> {
  const categories = await getCategories();
  
  // Initialize empty arrays for each category
  const grouped: Record<CatId, Prod[]> = {};
  categories.forEach(cat => {
    grouped[cat.slug] = [];
  });

  // Group products by their category
  products.forEach((product, index) => {
    const catId = product.category as CatId;
    if (grouped[catId]) {
      grouped[catId].push(transformProduct(product, index));
    }
  });

  return grouped;
}

// Cache for products
let cachedProducts: Record<CatId, Prod[]> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 0; // Disabled - always fetch fresh data

export async function getProducts(): Promise<Record<CatId, Prod[]>> {
  const now = Date.now();
  
  // Return cache if valid
  if (cachedProducts && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    const apiProducts = await fetchProducts();
    cachedProducts = await groupByCategory(apiProducts);
    lastFetchTime = now;
    return cachedProducts;
  } catch (error) {
    console.error('Failed to fetch products from API:', error);
    
    // Return empty object grouped by categories
    const categories = await getCategories();
    const empty: Record<CatId, Prod[]> = {};
    categories.forEach(cat => {
      empty[cat.slug] = [];
    });
    return empty;
  }
}

export function getAllProducts(): (Prod & { catId: CatId })[] {
  // Use cached data or empty array
  const products = cachedProducts || {};
  return Object.keys(products).flatMap((catId) =>
    products[catId].map((product) => ({ ...product, catId })),
  );
}
