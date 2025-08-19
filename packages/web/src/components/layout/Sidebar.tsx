import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSuperAdmin } from '@react-superadmin/core';
import { 
  Home, 
  Users, 
  Settings, 
  Database, 
  FileText, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const { config, resources, layout } = useSuperAdmin();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getIcon = (resourceName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      users: <Users className="w-5 h-5" />,
      posts: <FileText className="w-5 h-5" />,
      analytics: <BarChart3 className="w-5 h-5" />,
      settings: <Settings className="w-5 h-5" />,
      default: <Database className="w-5 h-5" />,
    };
    return iconMap[resourceName] || iconMap.default;
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : `w-${layout.sidebarWidth || 64}`
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="mt-4">
        <div className="px-4 mb-4">
          <Link
            to="/"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive('/') 
                ? "bg-primary-100 text-primary-700" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Home className="w-5 h-5 mr-3" />
            {!collapsed && "Dashboard"}
          </Link>
        </div>

        <div className="px-4">
          <h3 className={cn(
            "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2",
            collapsed && "sr-only"
          )}>
            Resources
          </h3>
          
          {Object.values(resources).map((resource) => (
            <Link
              key={resource.name}
              to={`/${resource.name}`}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                isActive(`/${resource.name}`)
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {getIcon(resource.name)}
              {!collapsed && (
                <span className="ml-3">{resource.label}</span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
