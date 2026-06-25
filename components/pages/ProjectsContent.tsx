"use client";

import {
  ContactSection,
  ProjectsPage as ProjectsPageComponent,
  StatsStrip,
} from "@/components/NGBComponents";
import { useAppUI } from "@/context/AppUIContext";

export default function ProjectsContent() {
  const { navigate } = useAppUI();

  return (
    <>
      <ProjectsPageComponent onNavigate={navigate} />
      <StatsStrip />
      <ContactSection />
    </>
  );
}
