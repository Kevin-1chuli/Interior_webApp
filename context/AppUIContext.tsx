"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Prod } from "@/lib/types";
import { routePathFor, activePageFromPath } from "@/lib/routes";

type AppUIContextValue = {
  activePage: string;
  drawer: boolean;
  fav: Set<number>;
  searchOpen: boolean;
  viewProd: Prod | null;

  closeDrawer: () => void;
  closeProduct: () => void;
  closeSearch: () => void;

  navigate: (page: string) => void; // PAGE IDs like "home", "projects", "furniture"
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

  // ✅ Convert page ID to path using routePathFor
  const navigate = useCallback(
    (page: string) => {
      setDrawer(false);

      const path = routePathFor(page);
      router.push(path);

      requestAnimationFrame(() => {
        window.scrollTo({ top: 0 });
      });
    },
    [router]
  );

  const scrollToContact = useCallback(() => {
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        document
          .getElementById("contact-anchor")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      document
        .getElementById("contact-anchor")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname, router]);

  const toggleFav = useCallback((id: number) => {
    setFav((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
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
    }),
    [pathname, drawer, fav, searchOpen, viewProd, navigate, scrollToContact, toggleFav]
  );

  return (
    <AppUIContext.Provider value={value}>
      {children}
    </AppUIContext.Provider>
  );
}

export function useAppUI() {
  const ctx = useContext(AppUIContext);
  if (!ctx) throw new Error("useAppUI must be used within AppUIProvider");
  return ctx;
}