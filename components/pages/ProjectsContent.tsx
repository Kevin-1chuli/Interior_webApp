"use client";

import { useEffect, useState } from "react";
import {
  ContactSection,
  ProjectsPage as ProjectsPageComponent,
  StatsStrip,
} from "@/components/NGBComponents";
import { useAppUI } from "@/context/AppUIContext";
import { fetchProjects, ApiProject } from "@/lib/api";

export default function ProjectsContent() {
  const { navigate } = useAppUI();
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
      setIsLoading(false);
    }
    loadProjects();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        Loading projects...
      </div>
    );
  }

  return (
    <>
      <ProjectsPageComponent onNavigate={navigate} projects={projects} />
      <StatsStrip />
      <ContactSection />
    </>
  );
}
