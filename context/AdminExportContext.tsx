"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AdminExportContextType {
  exportFunction: (() => void) | null;
  exportLabel: string | null;
  registerExport: (fn: () => void, label: string) => void;
  unregisterExport: () => void;
}

const AdminExportContext = createContext<AdminExportContextType | undefined>(undefined);

export function AdminExportProvider({ children }: { children: React.ReactNode }) {
  const [exportFunction, setExportFunction] = useState<(() => void) | null>(null);
  const [exportLabel, setExportLabel] = useState<string | null>(null);

  const registerExport = useCallback((fn: () => void, label: string) => {
    setExportFunction(() => fn);
    setExportLabel(label);
  }, []);

  const unregisterExport = useCallback(() => {
    setExportFunction(null);
    setExportLabel(null);
  }, []);

  return (
    <AdminExportContext.Provider value={{ exportFunction, exportLabel, registerExport, unregisterExport }}>
      {children}
    </AdminExportContext.Provider>
  );
}

export function useAdminExport() {
  const context = useContext(AdminExportContext);
  if (context === undefined) {
    throw new Error('useAdminExport must be used within AdminExportProvider');
  }
  return context;
}
