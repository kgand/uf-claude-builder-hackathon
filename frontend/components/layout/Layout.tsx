// components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-uf-gray-50 to-white">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-white">{children}</main>
    </div>
  );
};

export default Layout;