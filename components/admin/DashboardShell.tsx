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
  User as UserIcon
} from "lucide-react";
import { getUser, clearAuth, isOwner as checkIsOwner } from "@/lib/auth";

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
    { label: "Messages", href: "/admin/messages", icon: Mail },
    { label: "Staff", href: "/admin/staff", icon: Users, ownerOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.ownerOnly || isOwner);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            NGB Admin
          </h1>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-amber-700">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
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
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">NGB</h1>
              <p className="text-xs text-gray-500">Interior Concepts</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <div className="space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                      ${isActive 
                        ? 'bg-amber-50 text-amber-900' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile Section */}
          {user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.username}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  )}
                  <span className="inline-block mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    {user.role}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" strokeWidth={1.5} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="h-screen overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
