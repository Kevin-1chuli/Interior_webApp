"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchProducts, fetchProjects } from "@/lib/api";
import { getApiUrl } from "@/lib/config";
import { Sofa, Briefcase, Pencil, Mail, Plus, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Products", value: "...", icon: Sofa, href: "/admin/products", color: "amber", bgImage: null },
    { label: "Projects", value: "...", icon: Briefcase, href: "/admin/projects", color: "amber", bgImage: null },
    { label: "Design Requests", value: "...", icon: Pencil, href: "/admin/design-requests", color: "amber", bgImage: null },
    { label: "Messages", value: "...", icon: Mail, href: "/admin/messages", color: "amber", bgImage: null },
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

      // Fetch messages and design requests
      let messagesCount = 0;
      let designRequestsCount = 0;

      try {
        const token = localStorage.getItem('ngb_admin_token');
        if (token) {
          const [messagesRes, designRequestsRes] = await Promise.all([
            fetch(getApiUrl('contact/messages'), {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(getApiUrl('contact/design-requests'), {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ]);

          if (messagesRes.ok) {
            const messagesData = await messagesRes.json();
            messagesCount = messagesData.success ? messagesData.data.length : 0;
          }

          if (designRequestsRes.ok) {
            const designRequestsData = await designRequestsRes.json();
            designRequestsCount = designRequestsData.success ? designRequestsData.data.length : 0;
          }
        }
      } catch (error) {
        console.error('Failed to fetch messages/requests:', error);
      }

      // Get background images from first product and project
      const productBg = products[0]?.images?.[0] || null;
      const projectBg = projects[0]?.afterImages?.[0] || null;

      setStats([
        { label: "Total Products", value: products.length.toString(), icon: Sofa, href: "/admin/products", color: "amber", bgImage: productBg },
        { label: "Projects", value: projects.length.toString(), icon: Briefcase, href: "/admin/projects", color: "amber", bgImage: projectBg },
        { label: "Design Requests", value: designRequestsCount.toString(), icon: Pencil, href: "/admin/design-requests", color: "amber", bgImage: null },
        { label: "Messages", value: messagesCount.toString(), icon: Mail, href: "/admin/messages", color: "amber", bgImage: null },
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
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-5 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
            Dashboard
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "#6b6560" }}>
            Manage your interior design business
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 mb-5 sm:mb-6 md:mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isActive = stat.color === "amber";
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="relative bg-white rounded-xl border p-3 sm:p-4 md:p-5 lg:p-6 hover:shadow-lg transition-all active:scale-95 touch-manipulation overflow-hidden"
                style={{ borderColor: isActive ? "#b8934a" : "#ede9e2" }}
              >
                {/* Background Image */}
                {stat.bgImage && (
                  <div className="absolute inset-0 opacity-10">
                    <img 
                      src={stat.bgImage} 
                      alt="" 
                      className="w-full h-full object-cover"
                      style={{ filter: 'blur(2px)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div 
                      className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: isActive ? "#b8934a" : "#ede9e2" }}
                    >
                      <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" style={{ color: isActive ? "white" : "#6b6560" }} />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: "#6b6560", fontFamily: "'Montserrat', sans-serif" }}>
                    {stat.label}
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: "#1e1e1e", fontFamily: "'Montserrat', sans-serif" }}>
                    {stat.value}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border p-4 sm:p-5 md:p-6 lg:p-8 mb-4 sm:mb-5 md:mb-6 shadow-sm" style={{ borderColor: "#ede9e2" }}>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 md:p-5 rounded-xl border-2 transition-all hover:shadow-md active:scale-98 touch-manipulation"
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
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: "#b8934a" }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-0.5" style={{ color: "#1e1e1e", fontFamily: "'Montserrat', sans-serif" }}>
                      {action.label}
                    </h3>
                    <p className="text-xs sm:text-sm" style={{ color: "#6b6560" }}>
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" style={{ color: "#b8934a" }} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border p-3.5 sm:p-4 md:p-5 lg:p-6 shadow-sm" style={{ borderColor: "#d4ac6e" }}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ backgroundColor: "#b8934a" }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base mb-1" style={{ color: "#1e1e1e", fontFamily: "'Montserrat', sans-serif" }}>
                System Connected
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#6b6560" }}>
                Backend API connected to PostgreSQL. All products and projects sync automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
