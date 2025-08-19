import React, { useState } from "react";
import { Sidebar } from "../src/components/Sidebar";
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

export default function SidebarExample() {
  const [position, setPosition] = useState<"left" | "right">("left");
  const [fixed, setFixed] = useState(false);
  const [customWidth, setCustomWidth] = useState(false);

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
          Sidebar Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic Sidebar</h2>
          <div className="flex">
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
            <div className="flex-1 p-4 bg-gray-50 min-h-96">
              <p className="text-gray-600">Main content area</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Sidebar with Custom Width
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setCustomWidth(!customWidth)}
              variant={customWidth ? "default" : "outline"}
            >
              {customWidth ? "Use Default" : "Use Custom"} Width
            </Button>
          </div>
          <div className="flex">
            <Sidebar width={customWidth ? "320px" : undefined}>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Wide Sidebar</h3>
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <div
                      key={item.label}
                      className={`p-3 rounded cursor-pointer ${
                        item.active
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>
            </Sidebar>
            <div className="flex-1 p-4 bg-gray-50 min-h-96">
              <p className="text-gray-600">Main content area</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Sidebar Position Control
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() =>
                setPosition(position === "left" ? "right" : "left")
              }
              variant="outline"
            >
              Move to {position === "left" ? "Right" : "Left"}
            </Button>
          </div>
          <div className="flex">
            {position === "left" && (
              <Sidebar position="left">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Left Sidebar</h3>
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
            )}
            <div className="flex-1 p-4 bg-gray-50 min-h-96">
              <p className="text-gray-600">Main content area</p>
            </div>
            {position === "right" && (
              <Sidebar position="right">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Right Sidebar</h3>
                  <nav className="space-y-2">
                    {menuItems.slice(3).map((item) => (
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
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Fixed vs Static Sidebar
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setFixed(!fixed)}
              variant={fixed ? "default" : "outline"}
            >
              {fixed ? "Static" : "Fixed"} Positioning
            </Button>
          </div>
          <div className="flex">
            <Sidebar fixed={fixed}>
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
            <div className="flex-1 p-4 bg-gray-50 min-h-96">
              <p className="text-gray-600">Main content area</p>
              {fixed && (
                <p className="text-sm text-gray-500 mt-2">
                  This sidebar is fixed positioned and will stay in place when
                  scrolling
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Sidebar with Custom Styling
          </h2>
          <div className="flex">
            <Sidebar
              className="bg-gradient-to-b from-blue-600 to-blue-800 text-white"
              style={{ borderRight: "3px solid #f59e0b" }}
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Custom Styled
                </h3>
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <div
                      key={item.label}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        item.active
                          ? "bg-blue-500 text-white"
                          : "hover:bg-blue-500/50"
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>
            </Sidebar>
            <div className="flex-1 p-4 bg-gray-50 min-h-96">
              <p className="text-gray-600">Main content area</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Sidebar with Complex Content
          </h2>
          <div className="flex">
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

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>System Online</span>
                  </div>
                </div>
              </div>
            </Sidebar>
            <div className="flex-1 p-4 bg-gray-50 min-h-96">
              <p className="text-gray-600">Main content area</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Sidebar Props Reference
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>children:</strong> ReactNode - Content to display in the
              sidebar
            </div>
            <div>
              <strong>width:</strong> string - Custom width (default: w-60)
            </div>
            <div>
              <strong>position:</strong> 'left' | 'right' - Sidebar position
              (default: 'left')
            </div>
            <div>
              <strong>fixed:</strong> boolean - Whether sidebar is fixed
              positioned (default: false)
            </div>
            <div>
              <strong>zIndex:</strong> number - Custom z-index (default: z-40)
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
