import React, { useState } from "react";
import { AdminLayout } from "../src/components/AdminLayout";
import { AppBar } from "../src/components/AppBar";
import { Sidebar } from "../src/components/Sidebar";
import { Footer } from "../src/components/Footer";
import { Button } from "../src/components/Button";
import { Card } from "../src/components/Card";
import { SuperAdminProvider } from "../src/contexts/SuperAdminContext";

const exampleConfig = {
  title: "React SuperAdmin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

export default function AdminLayoutExample() {
  const [sidebarWidth, setSidebarWidth] = useState<
    "default" | "wide" | "narrow"
  >("default");
  const [headerHeight, setHeaderHeight] = useState<
    "default" | "tall" | "short"
  >("default");
  const [customBg, setCustomBg] = useState(false);

  const getSidebarWidth = () => {
    switch (sidebarWidth) {
      case "wide":
        return "320px";
      case "narrow":
        return "200px";
      default:
        return undefined;
    }
  };

  const getHeaderHeight = () => {
    switch (headerHeight) {
      case "tall":
        return "80px";
      case "short":
        return "48px";
      default:
        return undefined;
    }
  };

  const menuItems = [
    { label: "Dashboard", icon: "📊", active: true },
    { label: "Users", icon: "👥", active: false },
    { label: "Products", icon: "📦", active: false },
    { label: "Orders", icon: "🛒", active: false },
    { label: "Analytics", icon: "📈", active: false },
    { label: "Settings", icon: "⚙️", active: false },
  ];

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          AdminLayout Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic AdminLayout</h2>
          <div className="border rounded-lg overflow-hidden">
            <AdminLayout>
              <AppBar title="React SuperAdmin">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    Settings
                  </Button>
                  <Button size="sm" variant="outline">
                    Profile
                  </Button>
                </div>
              </AppBar>

              <Sidebar>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <div
                        key={item.label}
                        className={`p-2 rounded cursor-pointer ${
                          item.active
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>
              </Sidebar>

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Welcome to React SuperAdmin
                </h2>
                <p className="text-gray-600 mb-4">
                  This is the main content area of your admin panel. You can
                  place any content here.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <h3 className="font-semibold mb-2">Users</h3>
                    <p className="text-2xl font-bold text-blue-600">1,234</p>
                    <p className="text-sm text-gray-500">Active users</p>
                  </Card>
                  <Card>
                    <h3 className="font-semibold mb-2">Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">$45,678</p>
                    <p className="text-sm text-gray-500">This month</p>
                  </Card>
                  <Card>
                    <h3 className="font-semibold mb-2">Orders</h3>
                    <p className="text-2xl font-bold text-purple-600">567</p>
                    <p className="text-sm text-gray-500">Pending orders</p>
                  </Card>
                </div>
              </div>

              <Footer>
                <div className="flex items-center justify-between">
                  <span>© 2024 React SuperAdmin. All rights reserved.</span>
                  <span>Version 1.0.0</span>
                </div>
              </Footer>
            </AdminLayout>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AdminLayout with Custom Sidebar Width
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setSidebarWidth("narrow")}
                variant={sidebarWidth === "narrow" ? "default" : "outline"}
                size="sm"
              >
                Narrow
              </Button>
              <Button
                onClick={() => setSidebarWidth("default")}
                variant={sidebarWidth === "default" ? "default" : "outline"}
                size="sm"
              >
                Default
              </Button>
              <Button
                onClick={() => setSidebarWidth("wide")}
                variant={sidebarWidth === "wide" ? "default" : "outline"}
                size="sm"
              >
                Wide
              </Button>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <AdminLayout sidebarWidth={getSidebarWidth()}>
              <AppBar title="Custom Sidebar Width" />

              <Sidebar width={getSidebarWidth()}>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <div
                        key={item.label}
                        className={`p-2 rounded cursor-pointer ${
                          item.active
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>
              </Sidebar>

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Custom Sidebar Width
                </h2>
                <p className="text-gray-600">
                  The sidebar width is now: <strong>{sidebarWidth}</strong>
                </p>
              </div>

              <Footer>
                <div className="text-center">Footer content</div>
              </Footer>
            </AdminLayout>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AdminLayout with Custom Header Height
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setHeaderHeight("short")}
                variant={headerHeight === "short" ? "default" : "outline"}
                size="sm"
              >
                Short
              </Button>
              <Button
                onClick={() => setHeaderHeight("default")}
                variant={headerHeight === "default" ? "default" : "outline"}
                size="sm"
              >
                Default
              </Button>
              <Button
                onClick={() => setHeaderHeight("tall")}
                variant={headerHeight === "tall" ? "default" : "outline"}
                size="sm"
              >
                Tall
              </Button>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <AdminLayout headerHeight={getHeaderHeight()}>
              <AppBar title="Custom Header Height" height={getHeaderHeight()} />

              <Sidebar>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                  <nav className="space-y-2">
                    {menuItems.slice(0, 3).map((item) => (
                      <div
                        key={item.label}
                        className={`p-2 rounded cursor-pointer ${
                          item.active
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>
              </Sidebar>

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Custom Header Height
                </h2>
                <p className="text-gray-600">
                  The header height is now: <strong>{headerHeight}</strong>
                </p>
              </div>

              <Footer>
                <div className="text-center">Footer content</div>
              </Footer>
            </AdminLayout>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AdminLayout with Custom Background
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setCustomBg(!customBg)}
              variant={customBg ? "default" : "outline"}
            >
              {customBg ? "Use Default" : "Use Custom"} Background
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <AdminLayout
              bgColor={
                customBg
                  ? "bg-gradient-to-br from-blue-50 to-indigo-100"
                  : undefined
              }
              className={customBg ? "border-l-4 border-l-blue-500" : undefined}
            >
              <AppBar title="Custom Background" />

              <Sidebar>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                  <nav className="space-y-2">
                    {menuItems.slice(0, 3).map((item) => (
                      <div
                        key={item.label}
                        className={`p-2 rounded cursor-pointer ${
                          item.active
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>
              </Sidebar>

              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Custom Background
                </h2>
                <p className="text-gray-600">
                  This layout has a custom background color and styling.
                </p>
              </div>

              <Footer>
                <div className="text-center">Footer content</div>
              </Footer>
            </AdminLayout>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AdminLayout with Custom Padding
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <AdminLayout padding="p-8">
              <AppBar title="Custom Padding" />

              <Sidebar>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                  <nav className="space-y-2">
                    {menuItems.slice(0, 3).map((item) => (
                      <div
                        key={item.label}
                        className={`p-2 rounded cursor-pointer ${
                          item.active
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>
              </Sidebar>

              <div className="p-8">
                <h2 className="text-xl font-semibold mb-4">Custom Padding</h2>
                <p className="text-gray-600">
                  This layout has custom padding applied to the main content
                  area.
                </p>
              </div>

              <Footer>
                <div className="text-center">Footer content</div>
              </Footer>
            </AdminLayout>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AdminLayout with Complex Content
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <AdminLayout>
              <AppBar title="Complex Admin Panel">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">System Online</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    Notifications
                  </Button>
                  <Button size="sm" variant="outline">
                    Settings
                  </Button>
                  <Button size="sm">Profile</Button>
                </div>
              </AppBar>

              <Sidebar>
                <div className="p-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Admin Panel</h3>
                    <p className="text-sm text-gray-600">Welcome back, Admin</p>
                  </div>

                  <nav className="space-y-1 mb-6">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Main Navigation
                    </div>
                    {menuItems.slice(0, 4).map((item) => (
                      <div
                        key={item.label}
                        className={`p-2 rounded cursor-pointer ${
                          item.active
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </nav>

                  <nav className="space-y-1 mb-6">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Tools
                    </div>
                    {menuItems.slice(4).map((item) => (
                      <div
                        key={item.label}
                        className={`p-2 rounded cursor-pointer ${
                          item.active
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>
              </Sidebar>

              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Dashboard Overview
                  </h2>
                  <p className="text-gray-600">
                    Monitor your application's performance and key metrics
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <span className="text-2xl">👥</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Users
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          12,345
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <span className="text-2xl">📈</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Revenue
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          $89,432
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <span className="text-2xl">🛒</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Orders
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          1,234
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Growth
                        </p>
                        <p className="text-2xl font-bold text-gray-900">+23%</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              User activity {i}
                            </p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <h3 className="text-lg font-semibold mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <span className="mr-2">➕</span>
                        Add New User
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <span className="mr-2">📊</span>
                        View Reports
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <span className="mr-2">⚙️</span>
                        System Settings
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <span className="mr-2">📧</span>
                        Send Notification
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <Footer>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span>© 2024 React SuperAdmin. All rights reserved.</span>
                    <span className="text-gray-400">|</span>
                    <span>Version 1.0.0</span>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <a href="#" className="hover:text-blue-600">
                      Privacy
                    </a>
                    <a href="#" className="hover:text-blue-600">
                      Terms
                    </a>
                    <a href="#" className="hover:text-blue-600">
                      Support
                    </a>
                  </div>
                </div>
              </Footer>
            </AdminLayout>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AdminLayout Props Reference
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>children:</strong> ReactNode - Content to display in the
              layout
            </div>
            <div>
              <strong>sidebarWidth:</strong> string - Custom sidebar width
              (default: 240px)
            </div>
            <div>
              <strong>headerHeight:</strong> string - Custom header height
              (default: 64px)
            </div>
            <div>
              <strong>footerHeight:</strong> string - Custom footer height
              (default: none)
            </div>
            <div>
              <strong>bgColor:</strong> string - Custom background color classes
              (default: bg-gray-50)
            </div>
            <div>
              <strong>padding:</strong> string - Custom padding classes
              (default: none)
            </div>
            <div>
              <strong>className:</strong> string - Additional CSS classes
            </div>
            <div>
              <strong>style:</strong> CSSProperties - Inline styles
            </div>
          </div>
        </Card>
      </div>
    </SuperAdminProvider>
  );
}
