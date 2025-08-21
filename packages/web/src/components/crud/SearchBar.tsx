import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
  className = "",
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <Search data-testid="search-icon" className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block py-2 pr-10 pl-10 w-full leading-5 placeholder-gray-500 bg-white rounded-md border border-gray-300 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        placeholder={placeholder}
      />
      {query && (
        <button
          data-testid="clear-button"
          onClick={handleClear}
          className="flex absolute inset-y-0 right-0 items-center pr-3"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};
