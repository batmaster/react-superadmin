import React, { useState } from "react";
import { Layout } from "../src/components/Layout";
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

export default function LayoutExample() {
  const [bgColor, setBgColor] = useState<
    "default" | "blue" | "green" | "purple"
  >("default");
  const [padding, setPadding] = useState<"none" | "small" | "medium" | "large">(
    "none",
  );
  const [maxWidth, setMaxWidth] = useState<"none" | "sm" | "md" | "lg" | "xl">(
    "none",
  );
  const [margin, setMargin] = useState<"none" | "auto">("none");
  const [borderRadius, setBorderRadius] = useState<"none" | "sm" | "md" | "lg">(
    "none",
  );
  const [shadow, setShadow] = useState<"none" | "sm" | "md" | "lg">("none");

  const getBgColor = () => {
    switch (bgColor) {
      case "blue":
        return "bg-blue-50";
      case "green":
        return "bg-green-50";
      case "purple":
        return "bg-purple-50";
      default:
        return undefined;
    }
  };

  const getPadding = () => {
    switch (padding) {
      case "small":
        return "p-4";
      case "medium":
        return "p-6";
      case "large":
        return "p-8";
      default:
        return undefined;
    }
  };

  const getMaxWidth = () => {
    switch (maxWidth) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      default:
        return undefined;
    }
  };

  const getMargin = () => {
    return margin === "auto" ? "mx-auto" : undefined;
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case "sm":
        return "rounded";
      case "md":
        return "rounded-md";
      case "lg":
        return "rounded-lg";
      default:
        return undefined;
    }
  };

  const getShadow = () => {
    switch (shadow) {
      case "sm":
        return "shadow-sm";
      case "md":
        return "shadow-md";
      case "lg":
        return "shadow-lg";
      default:
        return undefined;
    }
  };

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Layout Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic Layout</h2>
          <Layout>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Welcome to React SuperAdmin
              </h3>
              <p className="text-gray-600 mb-4">
                This is a basic layout example. The Layout component provides a
                foundation for your content with consistent styling and
                responsive behavior.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <h4 className="font-semibold mb-2">Feature 1</h4>
                  <p className="text-sm text-gray-600">
                    Description of the first feature
                  </p>
                </Card>
                <Card>
                  <h4 className="font-semibold mb-2">Feature 2</h4>
                  <p className="text-sm text-gray-600">
                    Description of the second feature
                  </p>
                </Card>
              </div>
            </div>
          </Layout>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Layout with Custom Background Color
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setBgColor("default")}
                variant={bgColor === "default" ? "default" : "outline"}
                size="sm"
              >
                Default
              </Button>
              <Button
                onClick={() => setBgColor("blue")}
                variant={bgColor === "blue" ? "default" : "outline"}
                size="sm"
              >
                Blue
              </Button>
              <Button
                onClick={() => setBgColor("green")}
                variant={bgColor === "green" ? "default" : "outline"}
                size="sm"
              >
                Green
              </Button>
              <Button
                onClick={() => setBgColor("purple")}
                variant={bgColor === "purple" ? "default" : "outline"}
                size="sm"
              >
                Purple
              </Button>
            </div>
          </div>
          <Layout bgColor={getBgColor()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Custom Background Color
              </h3>
              <p className="text-gray-600">
                Current background: <strong>{bgColor}</strong>
              </p>
            </div>
          </Layout>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Layout with Custom Padding
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setPadding("none")}
                variant={padding === "none" ? "default" : "outline"}
                size="sm"
              >
                None
              </Button>
              <Button
                onClick={() => setPadding("small")}
                variant={padding === "small" ? "default" : "outline"}
                size="sm"
              >
                Small
              </Button>
              <Button
                onClick={() => setPadding("medium")}
                variant={padding === "medium" ? "default" : "outline"}
                size="sm"
              >
                Medium
              </Button>
              <Button
                onClick={() => setPadding("large")}
                variant={padding === "large" ? "default" : "outline"}
                size="sm"
              >
                Large
              </Button>
            </div>
          </div>
          <Layout padding={getPadding()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Custom Padding</h3>
              <p className="text-gray-600">
                Current padding: <strong>{padding}</strong>
              </p>
            </div>
          </Layout>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Layout with Custom Max Width
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setMaxWidth("none")}
                variant={maxWidth === "none" ? "default" : "outline"}
                size="sm"
              >
                None
              </Button>
              <Button
                onClick={() => setMaxWidth("sm")}
                variant={maxWidth === "sm" ? "default" : "outline"}
                size="sm"
              >
                Small
              </Button>
              <Button
                onClick={() => setMaxWidth("md")}
                variant={maxWidth === "md" ? "default" : "outline"}
                size="sm"
              >
                Medium
              </Button>
              <Button
                onClick={() => setMaxWidth("lg")}
                variant={maxWidth === "lg" ? "default" : "outline"}
                size="sm"
              >
                Large
              </Button>
              <Button
                onClick={() => setMaxWidth("xl")}
                variant={maxWidth === "xl" ? "default" : "outline"}
                size="sm"
              >
                Extra Large
              </Button>
            </div>
          </div>
          <Layout maxWidth={getMaxWidth()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Custom Max Width</h3>
              <p className="text-gray-600">
                Current max width:{" "}
                <strong>{maxWidth === "none" ? "Full width" : maxWidth}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This layout has a maximum width constraint applied to center the
                content and provide better readability on large screens.
              </p>
            </div>
          </Layout>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Layout with Custom Margin
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setMargin("none")}
                variant={margin === "none" ? "default" : "outline"}
                size="sm"
              >
                No Margin
              </Button>
              <Button
                onClick={() => setMargin("auto")}
                variant={margin === "auto" ? "default" : "outline"}
                size="sm"
              >
                Auto Margin
              </Button>
            </div>
          </div>
          <Layout margin={getMargin()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Custom Margin</h3>
              <p className="text-gray-600">
                Current margin:{" "}
                <strong>
                  {margin === "none" ? "No margin" : "Auto margin (centered)"}
                </strong>
              </p>
            </div>
          </Layout>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Layout with Custom Border Radius
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setBorderRadius("none")}
                variant={borderRadius === "none" ? "default" : "outline"}
                size="sm"
              >
                None
              </Button>
              <Button
                onClick={() => setBorderRadius("sm")}
                variant={borderRadius === "sm" ? "default" : "outline"}
                size="sm"
              >
                Small
              </Button>
              <Button
                onClick={() => setBorderRadius("md")}
                variant={borderRadius === "md" ? "default" : "outline"}
                size="sm"
              >
                Medium
              </Button>
              <Button
                onClick={() => setBorderRadius("lg")}
                variant={borderRadius === "lg" ? "default" : "outline"}
                size="sm"
              >
                Large
              </Button>
            </div>
          </div>
          <Layout borderRadius={getBorderRadius()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Custom Border Radius
              </h3>
              <p className="text-gray-600">
                Current border radius:{" "}
                <strong>
                  {borderRadius === "none" ? "None" : borderRadius}
                </strong>
              </p>
            </div>
          </Layout>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Layout with Custom Shadow
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setShadow("none")}
                variant={shadow === "none" ? "default" : "outline"}
                size="sm"
              >
                None
              </Button>
              <Button
                onClick={() => setShadow("sm")}
                variant={shadow === "sm" ? "default" : "outline"}
                size="sm"
              >
                Small
              </Button>
              <Button
                onClick={() => setShadow("md")}
                variant={shadow === "md" ? "default" : "outline"}
                size="sm"
              >
                Medium
              </Button>
              <Button
                onClick={() => setShadow("lg")}
                variant={shadow === "lg" ? "default" : "outline"}
                size="sm"
              >
                Large
              </Button>
            </div>
          </div>
          <Layout shadow={getShadow()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Custom Shadow</h3>
              <p className="text-gray-600">
                Current shadow:{" "}
                <strong>{shadow === "none" ? "None" : shadow}</strong>
              </p>
            </div>
          </Layout>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Layout with Combined Customizations
          </h2>
          <Layout
            bgColor="bg-gradient-to-br from-blue-50 to-indigo-100"
            padding="p-8"
            maxWidth="max-w-4xl"
            margin="mx-auto"
            borderRadius="rounded-lg"
            shadow="shadow-lg"
            className="border border-blue-200"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Premium Layout
              </h3>
              <p className="text-gray-600 mb-6">
                This layout combines multiple customizations including gradient
                background, large padding, constrained width, centered margin,
                rounded corners, and shadow.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <h4 className="font-semibold mb-2">Feature 1</h4>
                  <p className="text-sm text-gray-600">
                    Advanced customization options
                  </p>
                </Card>
                <Card>
                  <h4 className="font-semibold mb-2">Feature 2</h4>
                  <p className="text-sm text-gray-600">Responsive design</p>
                </Card>
                <Card>
                  <h4 className="font-semibold mb-2">Feature 3</h4>
                  <p className="text-sm text-gray-600">
                    Professional appearance
                  </p>
                </Card>
              </div>
            </div>
          </Layout>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Layout with Complex Content
          </h2>
          <Layout
            bgColor="bg-gray-50"
            padding="p-6"
            maxWidth="max-w-6xl"
            margin="mx-auto"
            borderRadius="rounded-xl"
            shadow="shadow-md"
          >
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Complex Layout Example
                </h3>
                <p className="text-lg text-gray-600">
                  Demonstrating the Layout component with rich content
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-900">
                    Left Column
                  </h4>
                  <Card>
                    <h5 className="font-semibold mb-2">Section 1</h5>
                    <p className="text-gray-600 mb-3">
                      This is the first section in the left column. It contains
                      various content elements to demonstrate the layout's
                      flexibility.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Action 1
                      </Button>
                      <Button size="sm" variant="outline">
                        Action 2
                      </Button>
                    </div>
                  </Card>

                  <Card>
                    <h5 className="font-semibold mb-2">Section 2</h5>
                    <p className="text-gray-600 mb-3">
                      The second section shows how multiple cards can be
                      arranged vertically within the layout structure.
                    </p>
                    <div className="bg-gray-100 p-3 rounded">
                      <p className="text-sm text-gray-700">
                        Additional information box
                      </p>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-900">
                    Right Column
                  </h4>
                  <Card>
                    <h5 className="font-semibold mb-2">Interactive Elements</h5>
                    <p className="text-gray-600 mb-3">
                      This section demonstrates interactive elements within the
                      layout.
                    </p>
                    <div className="space-y-2">
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <span className="mr-2">📊</span>
                        View Dashboard
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <span className="mr-2">⚙️</span>
                        Settings
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <span className="mr-2">📧</span>
                        Contact Support
                      </Button>
                    </div>
                  </Card>

                  <Card>
                    <h5 className="font-semibold mb-2">Statistics</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          1,234
                        </div>
                        <div className="text-sm text-gray-500">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          567
                        </div>
                        <div className="text-sm text-gray-500">Projects</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-500">
                  This layout demonstrates the component's ability to handle
                  complex content structures while maintaining consistent
                  styling and responsive behavior.
                </p>
              </div>
            </div>
          </Layout>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Layout Props Reference</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>children:</strong> ReactNode - Content to display in the
              layout
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
              <strong>maxWidth:</strong> string - Custom max width classes
              (default: none)
            </div>
            <div>
              <strong>margin:</strong> string - Custom margin classes (default:
              none)
            </div>
            <div>
              <strong>borderRadius:</strong> string - Custom border radius
              classes (default: none)
            </div>
            <div>
              <strong>shadow:</strong> string - Custom shadow classes (default:
              none)
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
