"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, isManager as checkIsManager } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireManager?: boolean;
}

export default function ProtectedRoute({ children, requireManager = false }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];
    const isPublicRoute = publicRoutes.some(route => pathname === route);

    if (isPublicRoute) {
      setIsChecking(false);
      return;
    }

    // Check authentication
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    // Check manager role if required
    if (requireManager && !checkIsManager()) {
      router.push("/admin/dashboard");
      return;
    }

    setIsChecking(false);
  }, [pathname, router, requireManager]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-amber-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
