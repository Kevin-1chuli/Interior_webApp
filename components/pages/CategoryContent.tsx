"use client";

import {
  CategoryPage,
  ContactSection,
} from "@/components/NGBComponents";
import { useAppUI } from "@/context/AppUIContext";
import type { CatId } from "@/lib/types";

export default function CategoryContent({ catId }: { catId: CatId }) {
  const { fav, setViewProd, toggleFav } = useAppUI();

  return (
    <>
      <CategoryPage catId={catId} fav={fav} onFav={toggleFav} onView={setViewProd} />
      <ContactSection />
    </>
  );
}
