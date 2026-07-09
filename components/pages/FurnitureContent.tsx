"use client";

import { useEffect, useState } from "react";
import {
  ContactSection,
  FurniturePage,
  StatsStrip,
} from "@/components/NGBComponents";
import { useAppUI } from "@/context/AppUIContext";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import type { CatId, Prod, Category } from "@/lib/types";

export default function FurnitureContent() {
  const { fav, navigate, setViewProd, toggleFav } = useAppUI();
  const [products, setProducts] = useState<Record<CatId, Prod[]>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to load furniture data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        Loading products...
      </div>
    );
  }

  return (
    <>
      <FurniturePage 
        fav={fav} 
        onFav={toggleFav} 
        onNavigate={navigate} 
        onView={setViewProd}
        products={products}
        categories={categories}
      />
      <StatsStrip />
      <ContactSection />
    </>
  );
}
