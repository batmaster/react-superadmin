import React, { useState } from "react";
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

export default function FooterExample() {
  const [align, setAlign] = useState<"left" | "center" | "right">("left");
  const [customHeight, setCustomHeight] = useState(false);
  const [customPadding, setCustomPadding] = useState(false);

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Footer Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic Footer</h2>
          <div className="min-h-96 bg-gray-50 p-4">
            <p className="text-gray-600 mb-4">Page content goes here...</p>
            <Footer>
              <div className="flex items-center justify-between">
                <span>© 2024 React SuperAdmin. All rights reserved.</span>
                <span>Version 1.0.0</span>
              </div>
            </Footer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Footer with Custom Content
          </h2>
          <div className="min-h-96 bg-gray-50 p-4">
            <p className="text-gray-600 mb-4">Page content goes here...</p>
            <Footer>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Company</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a href="#" className="hover:text-blue-600">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-blue-600">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-blue-600">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Support</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a href="#" className="hover:text-blue-600">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-blue-600">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-blue-600">
                        Community
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a href="#" className="hover:text-blue-600">
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-blue-600">
                        Terms
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-blue-600">
                        Cookies
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Footer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Footer Alignment Control
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setAlign("left")}
                variant={align === "left" ? "default" : "outline"}
                size="sm"
              >
                Left
              </Button>
              <Button
                onClick={() => setAlign("center")}
                variant={align === "center" ? "default" : "outline"}
                size="sm"
              >
                Center
              </Button>
              <Button
                onClick={() => setAlign("right")}
                variant={align === "right" ? "default" : "outline"}
                size="sm"
              >
                Right
              </Button>
            </div>
          </div>
          <div className="min-h-96 bg-gray-50 p-4">
            <p className="text-gray-600 mb-4">Page content goes here...</p>
            <Footer align={align}>
              <div className="space-y-2">
                <div>© 2024 React SuperAdmin. All rights reserved.</div>
                <div className="text-sm text-gray-500">
                  Built with React and TypeScript
                </div>
              </div>
            </Footer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Footer with Custom Height
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setCustomHeight(!customHeight)}
              variant={customHeight ? "default" : "outline"}
            >
              {customHeight ? "Use Default" : "Use Custom"} Height
            </Button>
          </div>
          <div className="min-h-96 bg-gray-50 p-4">
            <p className="text-gray-600 mb-4">Page content goes here...</p>
            <Footer height={customHeight ? "100px" : undefined}>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">
                    React SuperAdmin
                  </div>
                  <div className="text-sm text-gray-500">
                    Professional admin interface framework
                  </div>
                </div>
              </div>
            </Footer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Footer with Custom Padding
          </h2>
          <div className="space-y-2 mb-4">
            <Button
              onClick={() => setCustomPadding(!customPadding)}
              variant={customPadding ? "default" : "outline"}
            >
              {customPadding ? "Use Default" : "Use Custom"} Padding
            </Button>
          </div>
          <div className="min-h-96 bg-gray-50 p-4">
            <p className="text-gray-600 mb-4">Page content goes here...</p>
            <Footer padding={customPadding ? "p-8" : undefined}>
              <div className="text-center">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-2">Get in Touch</h4>
                  <p className="text-sm text-gray-600">
                    Have questions? We'd love to hear from you.
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button size="sm" variant="outline">
                    Contact Us
                  </Button>
                  <Button size="sm" variant="outline">
                    Support
                  </Button>
                </div>
              </div>
            </Footer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Footer with Custom Styling
          </h2>
          <div className="min-h-96 bg-gray-50 p-4">
            <p className="text-gray-600 mb-4">Page content goes here...</p>
            <Footer
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              style={{ borderTop: "3px solid #f59e0b" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold mb-1">React SuperAdmin</div>
                  <div className="text-sm text-blue-100">
                    Professional admin interface framework
                  </div>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-blue-200">
                    GitHub
                  </a>
                  <a href="#" className="hover:text-blue-200">
                    Documentation
                  </a>
                  <a href="#" className="hover:text-blue-200">
                    Examples
                  </a>
                </div>
              </div>
            </Footer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Footer with Social Links
          </h2>
          <div className="min-h-96 bg-gray-50 p-4">
            <p className="text-gray-600 mb-4">Page content goes here...</p>
            <Footer>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>© 2024 React SuperAdmin. All rights reserved.</span>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-gray-600">
                      <span className="sr-only">Twitter</span>
                      🐦
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-600">
                      <span className="sr-only">GitHub</span>
                      📚
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-600">
                      <span className="sr-only">LinkedIn</span>
                      💼
                    </a>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                    <div className="text-sm text-gray-500">
                      Made with ❤️ by the React SuperAdmin team
                    </div>
                    <div className="flex space-x-6 text-sm">
                      <a href="#" className="hover:text-blue-600">
                        Privacy Policy
                      </a>
                      <a href="#" className="hover:text-blue-600">
                        Terms of Service
                      </a>
                      <a href="#" className="hover:text-blue-600">
                        Cookie Policy
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Footer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Footer with Newsletter Signup
          </h2>
          <div className="min-h-96 bg-gray-50 p-4">
            <p className="text-gray-600 mb-4">Page content goes here...</p>
            <Footer>
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Get the latest updates and features delivered to your inbox.
                  </p>
                  <div className="flex max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button className="rounded-l-none">Subscribe</Button>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
                  © 2024 React SuperAdmin. All rights reserved.
                </div>
              </div>
            </Footer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Footer Props Reference</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>children:</strong> ReactNode - Content to display in the
              footer
            </div>
            <div>
              <strong>height:</strong> string - Custom height (default: h-16)
            </div>
            <div>
              <strong>padding:</strong> string - Custom padding classes
              (default: px-6 py-4)
            </div>
            <div>
              <strong>align:</strong> 'left' | 'center' | 'right' - Text
              alignment (default: 'left')
            </div>
            <div>
              <strong>bgColor:</strong> string - Custom background color classes
              (default: bg-white)
            </div>
            <div>
              <strong>textColor:</strong> string - Custom text color classes
              (default: text-gray-600)
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
