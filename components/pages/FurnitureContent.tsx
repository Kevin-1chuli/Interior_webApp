"use client";

import { useEffect, useState } from "react";
import {
  ContactSection,
  FurniturePage,
  StatsStrip,
} from "@/components/NGBComponents";
import { useAppUI } from "@/context/AppUIContext";
import { getProducts } from "@/lib/products";
import type { CatId, Prod } from "@/lib/types";

export default function FurnitureContent() {
  const { fav, navigate, setViewProd, toggleFav } = useAppUI();
  const [products, setProducts] = useState<Record<CatId, Prod[]>>({
    beds: [],
    sofas: [],
    wardrobes: [],
    'tv-units': [],
    dining: [],
    'coffee-tables': []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    }
    loadProducts();
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
      />
      <StatsStrip />
      <ContactSection />
    </>
  );
}
