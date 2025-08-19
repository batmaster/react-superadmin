import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSuperAdmin } from '@react-superadmin/core';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { layout, theme } = useSuperAdmin();

  return (
    <div className={`min-h-screen bg-gray-50 ${theme.darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen">
        {layout.sidebar && <Sidebar />}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {layout.header && <Header />}
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
          
          {layout.footer && <Footer />}
        </div>
      </div>
    </div>
  );
};
