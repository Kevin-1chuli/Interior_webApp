"use client";

import { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { useAppUI } from "@/context/AppUIContext";
import {
  BODY, CHARCOAL, CREAM_D, DISPLAY, EASE_OUT,
  GOLD, GOLD_LIGHT, MID, SANS, WHITE,
} from "@/lib/constants";
import { img } from "@/lib/images";
import { ContactSection, GoldBtn, OutlineBtn, SectionHdr } from "@/components/NGBComponents";

const PROJECT_CATEGORIES = ["All", "Residential", "Commercial", "Luxury"];

const PROJECTS = [
  {
    id: 1,
    title: "Ntinda Luxury Living Room",
    location: "Ntinda, Kampala",
    problem: "Dark, cramped space with outdated furniture",
    solution: "Open-plan design with custom sofas and natural light optimization",
    styles: ["Modern", "Luxury"],
    budget: "Premium",
    category: "Residential",
    beforePid: "1444419988131-046ed4e5ffd6",
    afterPid: "1598928506311-c55ded91a20c",
    rating: 5.0,
  },
  {
    id: 2,
    title: "Kololo Penthouse Bedroom",
    location: "Kololo, Kampala",
    problem: "Generic bedroom lacking character",
    solution: "Minimalist African Contemporary with custom bed and warm lighting",
    styles: ["Minimalist", "African Contemporary"],
    budget: "Premium",
    category: "Residential",
    beforePid: "1613668816690-546c6fa9ad42",
    afterPid: "1648881806148-e5c51179c826",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Bukoto Family Dining",
    location: "Bukoto, Kampala",
    problem: "Unused dining area, poor flow",
    solution: "Custom dining set with integrated storage and statement lighting",
    styles: ["Modern"],
    budget: "Mid Range",
    category: "Residential",
    beforePid: "1444419988131-046ed4e5ffd6",
    afterPid: "1706820229870-f9a8c6dac193",
    rating: 4.8,
  },
  {
    id: 4,
    title: "Naguru Home Office",
    location: "Naguru, Kampala",
    problem: "Cluttered workspace affecting productivity",
    solution: "Built-in shelving, ergonomic desk, and natural wood accents",
    styles: ["Minimalist"],
    budget: "Mid Range",
    category: "Commercial",
    beforePid: "1613668816690-546c6fa9ad42",
    afterPid: "1688647063090-36f36f692d95",
    rating: 4.7,
  },
  {
    id: 5,
    title: "Kira Master Suite",
    location: "Kira, Wakiso",
    problem: "Builder-grade bedroom with no personality",
    solution: "Luxury finishes, custom wardrobe, and mood lighting",
    styles: ["Luxury"],
    budget: "Premium",
    category: "Residential",
    beforePid: "1444419988131-046ed4e5ffd6",
    afterPid: "1750420556288-d0e32a6f517b",
    rating: 5.0,
  },
  {
    id: 6,
    title: "Bugolobi Boutique Cafe",
    location: "Bugolobi, Kampala",
    problem: "Generic cafe space with poor seating layout",
    solution: "African Contemporary design with custom banquette seating",
    styles: ["African Contemporary"],
    budget: "Mid Range",
    category: "Commercial",
    beforePid: "1613668816690-546c6fa9ad42",
    afterPid: "1598928506311-c55ded91a20c",
    rating: 4.9,
  },
];

// Separate component to avoid hooks in loops
function ProjectCard({ project, onRequestSimilar }: { project: typeof PROJECTS[0]; onRequestSimilar: (id: number) => void }) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden transition-all"
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={() => setShowAfter(true)}
      onMouseLeave={() => setShowAfter(false)}
    >
      {/* Before/After Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/11", backgroundColor: CHARCOAL }}>
        <img
          src={img(showAfter ? project.afterPid : project.beforePid, 800, 550)}
          alt={project.title}
          className="w-full h-full object-cover"
          style={{
            opacity: showAfter ? 1 : 0.85,
            transition: `all 0.5s ${EASE_OUT}`,
          }}
        />
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: SANS,
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: WHITE,
            backgroundColor: showAfter ? GOLD : "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            transition: `background-color 0.3s ${EASE_OUT}`,
          }}
        >
          {showAfter ? "After" : "Before"}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 style={{ fontFamily: DISPLAY, fontSize: "1.4rem", fontWeight: 600, color: CHARCOAL, lineHeight: 1.25, marginBottom: 6 }}>
              {project.title}
            </h3>
            <p className="flex items-center gap-1.5" style={{ fontFamily: BODY, fontSize: "0.8rem", color: MID }}>
              <MapPin size={13} /> {project.location}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ fontFamily: DISPLAY, fontSize: "1.1rem", fontWeight: 600, color: GOLD }}>
              {project.rating}
            </span>
            <span style={{ fontFamily: BODY, fontSize: "0.75rem", color: MID }}>/ 5.0</span>
          </div>
        </div>

        {/* Problem → Solution */}
        <div className="mb-4 pb-4" style={{ borderBottom: `1px solid ${CREAM_D}` }}>
          <div className="mb-2">
            <span style={{ fontFamily: SANS, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: MID }}>
              Challenge:
            </span>
            <p style={{ fontFamily: BODY, fontSize: "0.85rem", color: CHARCOAL, lineHeight: 1.6, marginTop: 4 }}>
              {project.problem}
            </p>
          </div>
          <div>
            <span style={{ fontFamily: SANS, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: GOLD }}>
              Solution:
            </span>
            <p style={{ fontFamily: BODY, fontSize: "0.85rem", color: CHARCOAL, lineHeight: 1.6, marginTop: 4 }}>
              {project.solution}
            </p>
          </div>
        </div>

        {/* Style Tags */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {project.styles.map(style => (
            <span
              key={style}
              className="px-3 py-1 rounded-full"
              style={{
                fontFamily: SANS,
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: GOLD,
                backgroundColor: "rgba(184,147,74,0.12)",
              }}
            >
              {style}
            </span>
          ))}
          <span
            className="px-3 py-1 rounded-full"
            style={{
              fontFamily: SANS,
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: MID,
              backgroundColor: CREAM_D,
            }}
          >
            {project.budget}
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() => onRequestSimilar(project.id)}
          className="w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          style={{
            fontFamily: SANS,
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: WHITE,
            backgroundColor: GOLD,
            border: `2px solid ${GOLD}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#9a7a3a";
            e.currentTarget.style.borderColor = "#9a7a3a";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = GOLD;
            e.currentTarget.style.borderColor = GOLD;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          I Want Something Like This <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function ProjectsContent() {
  const { navigate } = useAppUI();
  const [category, setCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const filteredProjects = category === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.category === category);

  const handleRequestSimilar = (projectId: number) => {
    // TODO: Open WhatsApp or form modal with project reference
    const project = PROJECTS.find(p => p.id === projectId);
    if (project) {
      const message = `Hi, I'm interested in a design similar to your "${project.title}" project.`;
      window.open(`https://wa.me/256700000000?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ backgroundColor: CHARCOAL, paddingTop: 100, paddingBottom: 60 }}>
        <div className="max-w-5xl mx-auto text-center" style={{ paddingInline: "clamp(1.5rem,5vw,4rem)" }}>
          <p style={{ fontFamily: SANS, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD_LIGHT, marginBottom: 12, fontWeight: 600 }}>
            OUR PORTFOLIO
          </p>
          <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 600, color: WHITE, lineHeight: 1.15, marginBottom: 20 }}>
            Transforming Spaces Across Uganda
          </h1>
          <p style={{ fontFamily: BODY, fontSize: "1.1rem", fontWeight: 300, lineHeight: 1.9, color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
            From Kampala homes to commercial spaces — see how we've brought our clients' visions to life.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <GoldBtn onClick={() => document.getElementById("projects-grid")?.scrollIntoView({ behavior: "smooth" })}>
              Browse Projects
            </GoldBtn>
            <OutlineBtn onClick={() => navigate("interior-design")}>
              Request Similar Design
            </OutlineBtn>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ backgroundColor: CREAM_D, paddingTop: 40, paddingBottom: 40 }}>
        <div className="max-w-6xl mx-auto" style={{ paddingInline: "clamp(1.5rem,5vw,4rem)" }}>
          <div className="flex gap-3 justify-center flex-wrap">
            {PROJECT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-6 py-2.5 rounded-full transition-all"
                style={{
                  fontFamily: SANS,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: category === cat ? WHITE : CHARCOAL,
                  backgroundColor: category === cat ? CHARCOAL : WHITE,
                  border: `2px solid ${category === cat ? CHARCOAL : "rgba(0,0,0,0.15)"}`,
                  transform: category === cat ? "translateY(-2px)" : "none",
                  boxShadow: category === cat ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="projects-grid" style={{ backgroundColor: WHITE, paddingTop: 60, paddingBottom: 80 }}>
        <div className="max-w-6xl mx-auto" style={{ paddingInline: "clamp(1.5rem,5vw,4rem)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} onRequestSimilar={handleRequestSimilar} />
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
