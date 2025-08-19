import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

interface SearchResult {
  title: string;
  content: string;
  url: string;
  type: 'page' | 'component' | 'developer';
}

interface CustomSearchProps {
  placeholder?: string;
  className?: string;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
  placeholder = 'Search documentation...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample search data - in a real implementation, this would come from your docs
  const searchData: SearchResult[] = useMemo(
    () => [
      {
        title: 'Introduction',
        content:
          'Get started with React SuperAdmin - a powerful React-based admin framework',
        url: '/introduction',
        type: 'page',
      },
      {
        title: 'Installation',
        content:
          'Learn how to install and set up React SuperAdmin in your project',
        url: '/installation',
        type: 'page',
      },
      {
        title: 'Quick Start',
        content:
          'Quick start guide to get you up and running with React SuperAdmin',
        url: '/quick-start',
        type: 'page',
      },
      {
        title: 'Button Component',
        content: 'Interactive button component with various styles and states',
        url: '/components/button',
        type: 'component',
      },
      {
        title: 'Form Components',
        content: 'Form components for building admin interfaces',
        url: '/components/forms',
        type: 'component',
      },
      {
        title: 'Basic Usage Example',
        content: 'Complete example showing basic CRUD operations',
        url: '/examples/basic-usage',
        type: 'page',
      },
      {
        title: 'Architecture',
        content:
          'Understanding the framework architecture and design principles',
        url: '/developer/architecture',
        type: 'developer',
      },
      {
        title: 'Setup',
        content: 'Development environment setup and configuration',
        url: '/developer/setup',
        type: 'developer',
      },
      {
        title: 'API Reference',
        content: 'Complete API reference for all components and hooks',
        url: '/developer/api',
        type: 'developer',
      },
      {
        title: 'Custom Components',
        content:
          'How to create custom components that integrate with the framework',
        url: '/developer/components',
        type: 'developer',
      },
      {
        title: 'Custom Hooks',
        content: 'Creating custom hooks for extended functionality',
        url: '/developer/hooks',
        type: 'developer',
      },
      {
        title: 'Utilities',
        content:
          'Utility functions and helper tools available in the framework',
        url: '/developer/utilities',
        type: 'developer',
      },
      {
        title: 'Contributing',
        content: 'Guidelines for contributing to React SuperAdmin project',
        url: '/developer/contributing',
        type: 'developer',
      },
    ],
    []
  );

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(searchData, {
        keys: ['title', 'content'],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [searchData]
  );

  // Handle search
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    // Simulate search delay for better UX
    const timeoutId = setTimeout(() => {
      const searchResults = fuse.search(query);
      setResults(searchResults.slice(0, 8).map(result => result.item));
      setIsOpen(true);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, fuse]);

  // Handle result click
  const handleResultClick = (url: string) => {
    window.location.href = url;
    setIsOpen(false);
    setQuery('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-64 px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              onClick={() => handleResultClick(result.url)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {result.type === 'component' && (
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  )}
                  {result.type === 'developer' && (
                    <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                  )}
                  {result.type === 'page' && (
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {result.title}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {result.content}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{result.url}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen &&
        query.trim().length > 0 &&
        results.length === 0 &&
        !isLoading && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found for "{query}"
            </div>
          </div>
        )}
    </div>
  );
};

export default CustomSearch;
