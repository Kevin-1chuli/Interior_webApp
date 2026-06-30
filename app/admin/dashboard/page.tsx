"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchProducts, fetchProjects } from "@/lib/api";
import { Sofa, Briefcase, Pencil, Mail, Plus, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Products", value: "...", icon: Sofa, href: "/admin/products", color: "amber" },
    { label: "Projects", value: "...", icon: Briefcase, href: "/admin/projects", color: "amber" },
    { label: "Design Requests", value: "0", icon: Pencil, href: "/admin/design-requests", color: "gray" },
    { label: "Messages", value: "0", icon: Mail, href: "/admin/messages", color: "gray" },
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [products, projects] = await Promise.all([
        fetchProducts(),
        fetchProjects()
      ]);

      setStats([
        { label: "Total Products", value: products.length.toString(), icon: Sofa, href: "/admin/products", color: "amber" },
        { label: "Projects", value: projects.length.toString(), icon: Briefcase, href: "/admin/projects", color: "amber" },
        { label: "Design Requests", value: "0", icon: Pencil, href: "/admin/design-requests", color: "gray" },
        { label: "Messages", value: "0", icon: Mail, href: "/admin/messages", color: "gray" },
      ]);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const quickActions = [
    { label: "Add Product", href: "/admin/products/new", icon: Sofa, description: "Create new furniture item" },
    { label: "Add Project", href: "/admin/projects/new", icon: Briefcase, description: "Showcase completed work" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5f0" }}>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
            Dashboard
          </h1>
          <p className="text-base" style={{ color: "#6b6560" }}>
            Manage your interior design business
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isActive = stat.color === "amber";
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-lg border p-6 hover:shadow-lg transition-all"
                style={{ borderColor: isActive ? "#b8934a" : "#ede9e2" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: isActive ? "#b8934a" : "#ede9e2" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: isActive ? "white" : "#6b6560" }} />
                  </div>
                </div>
                <p className="text-sm font-medium mb-2" style={{ color: "#6b6560", fontFamily: "'Montserrat', sans-serif" }}>
                  {stat.label}
                </p>
                <p className="text-3xl font-bold" style={{ color: "#1e1e1e", fontFamily: "'Montserrat', sans-serif" }}>
                  {stat.value}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border p-8 mb-6" style={{ borderColor: "#ede9e2" }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-4 p-5 rounded-lg border-2 transition-all hover:shadow-md"
                  style={{ borderColor: "#ede9e2" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#b8934a";
                    e.currentTarget.style.backgroundColor = "#f8f5f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#ede9e2";
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#b8934a" }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1" style={{ color: "#1e1e1e", fontFamily: "'Montserrat', sans-serif" }}>
                      {action.label}
                    </h3>
                    <p className="text-sm" style={{ color: "#6b6560" }}>
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#b8934a" }} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: "#d4ac6e" }}>
          <div className="flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#b8934a" }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: "#1e1e1e", fontFamily: "'Montserrat', sans-serif" }}>
                System Connected
              </h3>
              <p className="text-sm" style={{ color: "#6b6560" }}>
                Backend API connected to PostgreSQL. All products and projects sync automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
