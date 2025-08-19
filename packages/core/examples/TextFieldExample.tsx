import React, { useState } from "react";
import { TextField } from "../src/components/TextField";
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

export default function TextFieldExample() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          TextField Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic TextField</h2>
          <div className="space-y-2">
            <TextField>Default text field</TextField>
            <TextField value="Text with value prop" />
            <TextField>Text with children prop</TextField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Text Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <TextField variant="default">Default variant</TextField>
              <TextField variant="primary">Primary variant</TextField>
              <TextField variant="secondary">Secondary variant</TextField>
              <TextField variant="success">Success variant</TextField>
            </div>
            <div className="space-y-2">
              <TextField variant="warning">Warning variant</TextField>
              <TextField variant="error">Error variant</TextField>
              <TextField variant="muted">Muted variant</TextField>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Text Sizes</h2>
          <div className="space-y-2">
            <TextField size="xs">Extra small text</TextField>
            <TextField size="sm">Small text</TextField>
            <TextField size="md">Medium text (default)</TextField>
            <TextField size="lg">Large text</TextField>
            <TextField size="xl">Extra large text</TextField>
            <TextField size="2xl">2XL text</TextField>
            <TextField size="3xl">3XL text</TextField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Font Weights</h2>
          <div className="space-y-2">
            <TextField weight="normal">Normal weight</TextField>
            <TextField weight="medium">Medium weight</TextField>
            <TextField weight="semibold">Semibold weight</TextField>
            <TextField weight="bold">Bold weight</TextField>
            <TextField weight="extrabold">Extrabold weight</TextField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Text Alignment</h2>
          <div className="space-y-2">
            <TextField align="left">Left aligned text</TextField>
            <TextField align="center">Center aligned text</TextField>
            <TextField align="right">Right aligned text</TextField>
            <TextField align="justify" className="max-w-md">
              Justified text that demonstrates how the text is distributed
              evenly across the width of the container.
            </TextField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Text Truncation</h2>
          <div className="space-y-2">
            <TextField truncate maxLength={30}>
              This is a very long text that will be truncated at 30 characters
            </TextField>
            <TextField truncate maxLength={50} truncateIndicator=" [...]">
              This is another long text that will be truncated at 50 characters
              with custom indicator
            </TextField>
            <TextField ellipsis className="max-w-xs">
              This text will show ellipsis when it overflows the container
            </TextField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Line Clamping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <TextField lines={1} className="max-w-xs">
                This is a single line of text that will be clamped to one line
                regardless of how long it is.
              </TextField>
              <TextField lines={2} className="max-w-xs">
                This is a two-line text that will be clamped to two lines. It
                can be longer than one line but will not exceed two lines.
              </TextField>
            </div>
            <div className="space-y-2">
              <TextField lines={3} className="max-w-xs">
                This is a three-line text that demonstrates line clamping. It
                can span multiple lines but will be truncated after three lines
                with an ellipsis.
              </TextField>
              <TextField lines={4} className="max-w-xs">
                This is a four-line text example. Line clamping is useful for
                maintaining consistent layouts and preventing text from taking
                up too much vertical space in your interface.
              </TextField>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Interactive Text</h2>
          <div className="space-y-4">
            <div>
              <TextField clickable onClick={handleClick}>
                Clickable text (clicked {clickCount} times)
              </TextField>
            </div>
            <div>
              <TextField selectable={false}>
                Non-selectable text (you cannot select this text)
              </TextField>
            </div>
            <div>
              <TextField showCopyButton>
                Text with copy button - click the clipboard icon to copy
              </TextField>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Combined Styling</h2>
          <div className="space-y-3">
            <TextField
              variant="primary"
              size="lg"
              weight="bold"
              align="center"
              className="border-b-2 border-blue-300 pb-1"
            >
              Primary, Large, Bold, Centered with Border
            </TextField>

            <TextField
              variant="success"
              size="xl"
              weight="semibold"
              align="right"
              className="bg-green-50 px-3 py-2 rounded-lg"
            >
              Success, XL, Semibold, Right-aligned with Background
            </TextField>

            <TextField
              variant="warning"
              size="2xl"
              weight="extrabold"
              align="center"
              className="bg-yellow-50 px-4 py-3 rounded-xl shadow-sm"
            >
              Warning, 2XL, Extrabold, Centered with Enhanced Styling
            </TextField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Long Content Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Article Title</h3>
              <TextField
                variant="primary"
                size="lg"
                weight="bold"
                className="mb-2"
              >
                The Future of Web Development: Embracing Modern Frameworks and
                Tools
              </TextField>
              <TextField variant="secondary" size="sm" className="italic">
                Published on January 15, 2024 • 5 min read
              </TextField>
            </div>

            <div>
              <h3 className="font-medium mb-2">Product Description</h3>
              <TextField lines={3} className="max-w-2xl">
                This innovative product combines cutting-edge technology with
                user-friendly design to deliver an exceptional experience. Built
                with the latest frameworks and optimized for performance, it
                offers seamless integration and powerful features that enhance
                productivity and streamline workflows.
              </TextField>
            </div>

            <div>
              <h3 className="font-medium mb-2">Status Information</h3>
              <div className="flex items-center space-x-4">
                <TextField variant="success" weight="semibold">
                  ✅ Active
                </TextField>
                <TextField variant="muted" size="sm">
                  Last updated: 2 minutes ago
                </TextField>
                <TextField variant="primary" showCopyButton size="sm">
                  ID: RS-2024-001-456
                </TextField>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Responsive Text</h2>
          <div className="space-y-2">
            <TextField size="sm" className="md:text-base lg:text-lg xl:text-xl">
              Responsive text that changes size based on screen width
            </TextField>
            <TextField align="left" className="md:text-center lg:text-right">
              Text alignment that adapts to different screen sizes
            </TextField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            TextField Props Reference
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>children:</strong> ReactNode - Text content to display
            </div>
            <div>
              <strong>value:</strong> string - Alternative text value
              (prioritized over children)
            </div>
            <div>
              <strong>truncate:</strong> boolean - Whether to truncate long text
              (default: false)
            </div>
            <div>
              <strong>maxLength:</strong> number - Maximum length before
              truncation
            </div>
            <div>
              <strong>truncateIndicator:</strong> string - Custom truncation
              indicator (default: "...")
            </div>
            <div>
              <strong>align:</strong> 'left' | 'center' | 'right' | 'justify' -
              Text alignment (default: 'left')
            </div>
            <div>
              <strong>variant:</strong> 'default' | 'primary' | 'secondary' |
              'success' | 'warning' | 'error' | 'muted' - Color variant
              (default: 'default')
            </div>
            <div>
              <strong>size:</strong> 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' |
              '3xl' - Text size (default: 'md')
            </div>
            <div>
              <strong>weight:</strong> 'normal' | 'medium' | 'semibold' | 'bold'
              | 'extrabold' - Font weight (default: 'normal')
            </div>
            <div>
              <strong>selectable:</strong> boolean - Whether text is selectable
              (default: true)
            </div>
            <div>
              <strong>showCopyButton:</strong> boolean - Whether to show copy
              button (default: false)
            </div>
            <div>
              <strong>clickable:</strong> boolean - Whether text is clickable
              (default: false)
            </div>
            <div>
              <strong>onClick:</strong> () =&gt; void - Click handler function
            </div>
            <div>
              <strong>ellipsis:</strong> boolean - Whether to show ellipsis for
              overflow (default: false)
            </div>
            <div>
              <strong>lines:</strong> number - Number of lines before truncating
              (1-6)
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
