import { PRODS } from "./data";
import type { CatId, Prod } from "./types";
import { fetchProducts, ApiProduct } from "./api";

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

// Group products by category
function groupByCategory(products: ApiProduct[]): Record<CatId, Prod[]> {
  const grouped: Record<CatId, Prod[]> = {
    beds: [],
    sofas: [],
    wardrobes: [],
    'tv-units': [],
    dining: [],
    'coffee-tables': []
  };

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
const CACHE_DURATION = 30000; // 30 seconds

export async function getProducts(): Promise<Record<CatId, Prod[]>> {
  const now = Date.now();
  
  // Return cache if valid
  if (cachedProducts && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    const apiProducts = await fetchProducts();
    if (apiProducts.length > 0) {
      cachedProducts = groupByCategory(apiProducts);
      lastFetchTime = now;
      return cachedProducts;
    }
  } catch (error) {
    console.error('Failed to fetch products, using fallback:', error);
  }

  // Fallback to static data
  return PRODS;
}

export function getAllProducts(): (Prod & { catId: CatId })[] {
  // Use cached data or static fallback
  const products = cachedProducts || PRODS;
  return (Object.keys(products) as CatId[]).flatMap((catId) =>
    products[catId].map((product) => ({ ...product, catId })),
  );
}
