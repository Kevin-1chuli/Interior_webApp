"use client";

import {
  createContext, useCallback, useContext, useMemo, useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Prod } from "@/lib/types";
import { activePageFromPath, routePathFor } from "@/lib/routes";

type AppUIContextValue = {
  activePage: string;
  drawer: boolean;
  fav: Set<number>;
  searchOpen: boolean;
  viewProd: Prod | null;
  closeDrawer: () => void;
  closeProduct: () => void;
  closeSearch: () => void;
  navigate: (page: string) => void;
  openDrawer: () => void;
  openProduct: (product: Prod) => void;
  openSearch: () => void;
  scrollToContact: () => void;
  setViewProd: (product: Prod | null) => void;
  toggleFav: (id: number) => void;
};

const AppUIContext = createContext<AppUIContextValue | null>(null);

export function AppUIProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [fav, setFav] = useState<Set<number>>(new Set());
  const [viewProd, setViewProd] = useState<Prod | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useCallback((page: string) => {
    setDrawer(false);
    const nextPath = routePathFor(page);
    if (pathname !== nextPath) {
      router.push(nextPath);
    }
    window.scrollTo({ top:0, behavior:"smooth" });
  }, [pathname, router]);

  const scrollToContact = useCallback(() => {
    if (pathname !== "/") {
      router.push("/");
    }
    setTimeout(()=>document.getElementById("contact-anchor")?.scrollIntoView({ behavior:"smooth" }), 60);
  }, [pathname, router]);

  const toggleFav = useCallback((id: number) => {
    setFav((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<AppUIContextValue>(() => ({
    activePage: activePageFromPath(pathname),
    drawer,
    fav,
    searchOpen,
    viewProd,
    closeDrawer: () => setDrawer(false),
    closeProduct: () => setViewProd(null),
    closeSearch: () => setSearchOpen(false),
    navigate,
    openDrawer: () => setDrawer(true),
    openProduct: setViewProd,
    openSearch: () => setSearchOpen(true),
    scrollToContact,
    setViewProd,
    toggleFav,
  }), [drawer, fav, navigate, pathname, scrollToContact, searchOpen, viewProd, toggleFav]);

  return <AppUIContext.Provider value={value}>{children}</AppUIContext.Provider>;
}

export function useAppUI() {
  const context = useContext(AppUIContext);
  if (!context) {
    throw new Error("useAppUI must be used within AppUIProvider");
  }
  return context;
}
