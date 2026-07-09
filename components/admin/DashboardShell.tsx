"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Briefcase, 
  Mail, 
  Users, 
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Download,
  FolderTree
} from "lucide-react";
import { getUser, clearAuth, isOwner as checkIsOwner } from "@/lib/auth";
import { useAdminExport } from "@/context/AdminExportContext";

interface DashboardShellProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  ownerOnly?: boolean;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(getUser());
  const router = useRouter();
  const pathname = usePathname();
  const isOwner = checkIsOwner();
  const { exportFunction, exportLabel } = useAdminExport();

  useEffect(() => {
    // Update user state if it changes
    setUser(getUser());
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    router.push("/admin/login");
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Projects", href: "/admin/projects", icon: Briefcase },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Messages", href: "/admin/messages", icon: Mail },
    { label: "Staff", href: "/admin/staff", icon: Users, ownerOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.ownerOnly || isOwner);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors active:scale-95 touch-manipulation"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">
            NGB Admin
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {exportFunction && (
            <button
              onClick={exportFunction}
              className="p-2.5 hover:bg-green-50 rounded-xl transition-colors active:scale-95 touch-manipulation"
              aria-label={exportLabel || "Export"}
              title={exportLabel || "Export"}
            >
              <Download className="w-5 h-5 text-green-600" />
            </button>
          )}
          {user && (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:z-30 lg:w-64 lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo + Desktop Export */}
          <div className="h-14 lg:h-16 flex items-center justify-between px-5 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">NGB</h1>
              <p className="text-xs text-gray-600">Interior Concepts</p>
            </div>
            <div className="flex items-center gap-2">
              {exportFunction && (
                <button
                  onClick={exportFunction}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors active:scale-95"
                  aria-label={exportLabel || "Export"}
                  title={exportLabel || "Export"}
                >
                  <Download className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">Export</span>
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95 touch-manipulation"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1.5">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium touch-manipulation
                      ${isActive 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile Section */}
          {user && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user.username}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  )}
                  <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                    {user.role}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-all touch-manipulation"
              >
                <LogOut className="w-5 h-5" strokeWidth={2} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <div className="h-screen overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
