"use client";

import {
  ContactSection,
  FurniturePage,
  StatsStrip,
} from "@/components/NGBComponents";
import { useAppUI } from "@/context/AppUIContext";

export default function FurnitureContent() {
  const { fav, navigate, setViewProd, toggleFav } = useAppUI();

  return (
    <>
      <FurniturePage fav={fav} onFav={toggleFav} onNavigate={navigate} onView={setViewProd} />
      <StatsStrip />
      <ContactSection />
    </>
  );
}
