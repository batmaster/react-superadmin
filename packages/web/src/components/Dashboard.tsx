import React from 'react';
import { useSuperAdmin } from '@react-superadmin/core';
import { Users, FileText, TrendingUp, Activity, Package, Eye, ThumbsUp, Star } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export const Dashboard: React.FC = () => {
  const { config, resources } = useSuperAdmin();

  const stats = [
    {
      name: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Total Posts',
      value: '567',
      change: '+8%',
      changeType: 'positive',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Products',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Active Sessions',
      value: '156',
      change: '+5%',
      changeType: 'positive',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentActivities = [
    { 
      action: 'User created', 
      details: 'John Doe was added to the system', 
      time: '2 minutes ago',
      type: 'user',
      icon: Users,
    },
    { 
      action: 'Post published', 
      details: 'Blog post "Getting Started" was published', 
      time: '1 hour ago',
      type: 'post',
      icon: FileText,
    },
    { 
      action: 'Product updated', 
      details: 'Premium Headphones stock updated to 45 units', 
      time: '2 hours ago',
      type: 'product',
      icon: Package,
    },
    { 
      action: 'User logged in', 
      details: 'Admin user logged in from 192.168.1.1', 
      time: '3 hours ago',
      type: 'user',
      icon: Users,
    },
    { 
      action: 'Post created', 
      details: 'New draft post "Advanced Features" created', 
      time: '4 hours ago',
      type: 'post',
      icon: FileText,
    },
    { 
      action: 'Product added', 
      details: 'New product "Smart Watch" added to inventory', 
      time: '5 hours ago',
      type: 'product',
      icon: Package,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'post':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'product':
        return <Package className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your {config.title}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="ml-4 w-full">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-gray-500">from last month</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(resources).map((resource) => (
              <div key={resource.name} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex-shrink-0">
                  {resource.name === 'users' && <Users className="h-6 w-6 text-blue-500" />}
                  {resource.name === 'posts' && <FileText className="h-6 w-6 text-green-500" />}
                  {resource.name === 'products' && <Package className="h-6 w-6 text-purple-500" />}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{resource.label}</p>
                  <p className="text-sm text-gray-500">Manage {resource.label.toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.details}</p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Database</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">API</span>
              <Badge variant="success">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Storage</span>
              <Badge variant="success">Normal</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
