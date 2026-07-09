"use client";

import { useEffect, useState } from "react";
import {
  CategoryPage,
  ContactSection,
} from "@/components/NGBComponents";
import { useAppUI } from "@/context/AppUIContext";
import { getProducts } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import type { CatId, Prod, Category } from "@/lib/types";

export default function CategoryContent({ catId }: { catId: CatId }) {
  const { fav, setViewProd, toggleFav } = useAppUI();
  const [products, setProducts] = useState<Record<CatId, Prod[]>>({});
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCategory] = await Promise.all([
          getProducts(),
          getCategoryBySlug(catId)
        ]);
        setProducts(fetchedProducts);
        setCategory(fetchedCategory);
      } catch (error) {
        console.error('Failed to load category data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [catId]);

  if (isLoading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        Loading products...
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Category not found</h1>
        <p>The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <>
      <CategoryPage 
        catId={catId} 
        category={category}
        fav={fav} 
        onFav={toggleFav} 
        onView={setViewProd} 
        products={products} 
      />
      <ContactSection />
    </>
  );
}
