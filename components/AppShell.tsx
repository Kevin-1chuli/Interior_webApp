"use client";

import { useEffect, useState } from "react";
import { AppUIProvider, useAppUI } from "@/context/AppUIContext";
import {
  Footer,
  HamburgerDrawer,
  Navbar,
  ProductModal,
  SearchOverlay,
  WishlistPanel,
} from "@/components/NGBComponents";
import { getCategories } from "@/lib/categories";
import type { Category } from "@/lib/types";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const {
    activePage,
    closeDrawer,
    closeProduct,
    closeSearch,
    closeWishlist,
    drawer,
    fav,
    navigate,
    openDrawer,
    openSearch,
    openWishlist,
    searchOpen,
    setViewProd,
    toggleFav,
    viewProd,
    wishlistOpen,
  } = useAppUI();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        ::-webkit-scrollbar { width:0; height:0; }
        * { scrollbar-width:none; }
        ::placeholder { color:rgba(255,255,255,0.28); }
        input, textarea, select { font-family:'Poppins',sans-serif; }
        @keyframes kenburns {
          from { transform: scale(1) translate(0,0); }
          to   { transform: scale(1.1) translate(-1.5%,-1%); }
        }
      `}</style>

      <Navbar active={activePage} onNav={navigate} openDrawer={openDrawer} cart={fav.size} openSearch={openSearch} openWishlist={openWishlist} />

      {viewProd && (
        <ProductModal
          prod={viewProd}
          onClose={closeProduct}
          fav={fav.has(viewProd.id)}
          onFav={toggleFav}
        />
      )}

      {searchOpen && (
        <SearchOverlay
          onClose={closeSearch}
          fav={fav}
          onFav={toggleFav}
          onView={(product) => {
            setViewProd(product);
            closeSearch();
          }}
          onNavigate={(page) => {
            navigate(page);
            closeSearch();
          }}
          categories={categories}
        />
      )}

      {wishlistOpen && (
        <WishlistPanel
          open={wishlistOpen}
          onClose={closeWishlist}
          fav={fav}
          onFav={toggleFav}
          onView={(product) => {
            setViewProd(product);
            closeWishlist();
          }}
          onNavigate={(page) => {
            navigate(page);
            closeWishlist();
          }}
        />
      )}

      <HamburgerDrawer open={drawer} onClose={closeDrawer} onNav={navigate} categories={categories} />

      <main style={{ paddingTop:68 }}>
        {children}
        <Footer onNav={navigate} categories={categories} />
      </main>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppUIProvider>
      <AppShellContent>{children}</AppShellContent>
    </AppUIProvider>
  );
}
