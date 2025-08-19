import React, { useState } from "react";
import { AppBar } from "../src/components/AppBar";
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

export default function AppBarExample() {
  const [elevation, setElevation] = useState(false);
  const [customHeight, setCustomHeight] = useState(false);

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          AppBar Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic AppBar</h2>
          <AppBar title="Basic AppBar" />
          <div className="h-16 bg-gray-100 flex items-center justify-center text-gray-500">
            Content below AppBar
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AppBar with Custom Title
          </h2>
          <AppBar title="Custom Application Title" />
          <div className="h-16 bg-gray-100 flex items-center justify-center text-gray-500">
            Content below AppBar
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AppBar with Children Content
          </h2>
          <AppBar title="AppBar with Actions">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                Settings
              </Button>
              <Button size="sm" variant="outline">
                Profile
              </Button>
              <Button size="sm" variant="outline">
                Logout
              </Button>
            </div>
          </AppBar>
          <div className="h-16 bg-gray-100 flex items-center justify-center text-gray-500">
            Content below AppBar
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">AppBar with Elevation</h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setElevation(!elevation)}
              variant={elevation ? "default" : "outline"}
            >
              {elevation ? "Remove" : "Add"} Elevation
            </Button>
          </div>
          <AppBar title="AppBar with Elevation" elevation={elevation} />
          <div className="h-16 bg-gray-100 flex items-center justify-center text-gray-500">
            Content below AppBar
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AppBar with Custom Height
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setCustomHeight(!customHeight)}
              variant={customHeight ? "default" : "outline"}
            >
              {customHeight ? "Use Default" : "Use Custom"} Height
            </Button>
          </div>
          <AppBar
            title="Custom Height AppBar"
            height={customHeight ? "80px" : undefined}
          />
          <div className="h-16 bg-gray-100 flex items-center justify-center text-gray-500">
            Content below AppBar
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AppBar with Custom Styling
          </h2>
          <AppBar
            title="Custom Styled AppBar"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            style={{ borderBottom: "3px solid #f59e0b" }}
          />
          <div className="h-16 bg-gray-100 flex items-center justify-center text-gray-500">
            Content below AppBar
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            AppBar with Complex Layout
          </h2>
          <AppBar title="Complex Layout AppBar">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, Admin</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost">
                  Notifications
                </Button>
                <Button size="sm" variant="ghost">
                  Help
                </Button>
                <Button size="sm" variant="outline">
                  Settings
                </Button>
                <Button size="sm">Profile</Button>
              </div>
            </div>
          </AppBar>
          <div className="h-16 bg-gray-100 flex items-center justify-center text-gray-500">
            Content below AppBar
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">AppBar Props Reference</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>title:</strong> string - The title displayed in the AppBar
            </div>
            <div>
              <strong>children:</strong> ReactNode - Optional content to display
              on the right side
            </div>
            <div>
              <strong>elevation:</strong> boolean - Whether to show shadow
              (default: false)
            </div>
            <div>
              <strong>height:</strong> string - Custom height (default: h-16)
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
