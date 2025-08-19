import React from 'react';
import { useSuperAdmin } from '@react-superadmin/core';

export const Footer: React.FC = () => {
  const { config } = useSuperAdmin();

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          © 2024 {config.title}. All rights reserved.
        </div>
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-700">Privacy Policy</a>
          <a href="#" className="hover:text-gray-700">Terms of Service</a>
          <a href="#" className="hover:text-gray-700">Support</a>
        </div>
      </div>
    </footer>
  );
};
