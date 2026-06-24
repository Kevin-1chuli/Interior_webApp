"use client";

import { AppUIProvider, useAppUI } from "@/context/AppUIContext";
import {
  Footer,
  HamburgerDrawer,
  Navbar,
  ProductModal,
  SearchOverlay,
} from "@/components/NGBComponents";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const {
    activePage,
    closeDrawer,
    closeProduct,
    closeSearch,
    drawer,
    fav,
    navigate,
    openDrawer,
    openSearch,
    searchOpen,
    setViewProd,
    toggleFav,
    viewProd,
  } = useAppUI();

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

      <Navbar active={activePage} onNav={navigate} openDrawer={openDrawer} cart={fav.size} openSearch={openSearch} />

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
        />
      )}

      <HamburgerDrawer open={drawer} onClose={closeDrawer} onNav={navigate} />

      <main style={{ paddingTop:68 }}>
        {children}
        <Footer onNav={navigate} />
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
