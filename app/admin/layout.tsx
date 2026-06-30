"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import Link from "next/link";
import { LayoutGrid, Sofa, Briefcase, Pencil, Mail, LogOut, Users } from "lucide-react";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout, user, isOwner } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Show login page without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render admin content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid, show: true },
    { label: "Products", href: "/admin/products", icon: Sofa, show: true },
    { label: "Projects", href: "/admin/projects", icon: Briefcase, show: true },
    { label: "Design Requests", href: "/admin/design-requests", icon: Pencil, show: true },
    { label: "Messages", href: "/admin/messages", icon: Mail, show: true },
    { label: "Staff", href: "/admin/staff", icon: Users, show: isOwner }, // Only show for OWNER
  ].filter(item => item.show);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5f0" }}>
      {/* Mobile Header */}
      <header 
        className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4"
        style={{ backgroundColor: "#1e1e1e", color: "white", borderBottom: "1px solid rgba(184, 147, 74, 0.2)" }}
      >
        <div>
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#b8934a" }}>
            NGB Admin
          </h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg transition-colors"
          aria-label="Toggle menu"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(184, 147, 74, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: "#1e1e1e", color: "white" }}
      >
        {/* Logo - Hidden on mobile (shown in header instead) */}
        <div className="hidden md:block p-6" style={{ borderBottom: "1px solid rgba(184, 147, 74, 0.2)" }}>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#b8934a" }}>
            NGB Admin
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Interior Concepts
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4" style={{ borderBottom: "1px solid rgba(184, 147, 74, 0.2)" }}>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#b8934a" }}
              >
                <span className="text-white font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile spacing for header */}
        <div className="md:hidden h-16" />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive ? "#b8934a" : "transparent",
                  color: isActive ? "white" : "rgba(255, 255, 255, 0.7)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(184, 147, 74, 0.1)";
                    e.currentTarget.style.color = "#b8934a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  }
                }}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4" style={{ borderTop: "1px solid rgba(184, 147, 74, 0.2)" }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.1)";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
            }}
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            <span className="font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen pt-16 md:pt-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
