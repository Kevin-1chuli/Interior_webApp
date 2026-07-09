"use client";

import { usePathname } from "next/navigation";
import DashboardShell from "@/components/admin/DashboardShell";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { AdminExportProvider } from "@/context/AdminExportContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Public routes that don't need the dashboard shell
  const publicRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Protected routes with dashboard shell
  return (
    <ProtectedRoute>
      <AdminExportProvider>
        <DashboardShell>{children}</DashboardShell>
      </AdminExportProvider>
    </ProtectedRoute>
  );
}
