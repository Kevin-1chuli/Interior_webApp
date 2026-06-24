"use client";

import {
  ContactSection,
  DesignJourney,
  Hero,
  ServicesAndCollections,
  SpacesShowcase,
} from "@/components/NGBComponents";
import { useAppUI } from "@/context/AppUIContext";

export default function HomePage() {
  const { navigate, scrollToContact } = useAppUI();

  return (
    <>
      <Hero onShop={()=>navigate("furniture")} onDesign={scrollToContact} />
      <ServicesAndCollections onNavigate={navigate} />
      <SpacesShowcase />
      <DesignJourney />
      <ContactSection id="contact-anchor" />
    </>
  );
}
