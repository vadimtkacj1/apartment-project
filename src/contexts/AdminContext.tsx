'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  sidebarShow: boolean;
  setSidebarShow: (val: boolean | ((prev: boolean) => boolean)) => void;
  sidebarUnfoldable: boolean;
  setSidebarUnfoldable: (val: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarShow, setSidebarShow] = useState(true);
  const [sidebarUnfoldable, setSidebarUnfoldable] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        sidebarShow,
        setSidebarShow,
        sidebarUnfoldable,
        setSidebarUnfoldable,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
