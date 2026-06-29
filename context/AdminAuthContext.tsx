"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Check if already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/admin/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // });
      // const data = await response.json();
      
      // Temporary mock authentication for development
      if (username === "admin" && password === "ngb2024") {
        const mockToken = "mock_jwt_token_" + Date.now();
        localStorage.setItem("admin_token", mockToken);
        setToken(mockToken);
        setIsAuthenticated(true);
        router.push("/admin/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setIsAuthenticated(false);
    router.push("/admin/login");
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, token }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
