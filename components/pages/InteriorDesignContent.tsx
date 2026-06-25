"use client";

import {
  ContactSection,
  InteriorDesignPage as InteriorDesignPageComponent,
  StatsStrip,
} from "@/components/NGBComponents";
import { useAppUI } from "@/context/AppUIContext";

export default function InteriorDesignContent() {
  const { navigate } = useAppUI();

  return (
    <>
      <InteriorDesignPageComponent onNavigate={navigate} />
      <StatsStrip />
      <ContactSection />
    </>
  );
}
