import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CustomSearch from './CustomSearch';

const CustomNavbar: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="/img/logo.svg"
                alt={siteConfig.title}
              />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">
                {siteConfig.title}
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <CustomSearch
              placeholder="Search documentation..."
              className="w-full"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <a
              href="/introduction"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Docs
            </a>
            <a
              href="/components/button"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Components
            </a>
            <a
              href="/developer/architecture"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Developer
            </a>
            <a
              href="https://gitlab.com/batmaster/react-superadmin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              GitLab
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;
