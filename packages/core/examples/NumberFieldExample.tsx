import React, { useState } from "react";
import { NumberField } from "../src/components/NumberField";
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

export default function NumberFieldExample() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          NumberField Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic NumberField</h2>
          <div className="space-y-2">
            <NumberField value={123.45} />
            <NumberField value={-67.89} />
            <NumberField value={0} />
            <NumberField value={1000000} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Number Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <NumberField variant="default" value={123.45}>
                Default variant
              </NumberField>
              <NumberField variant="primary" value={123.45}>
                Primary variant
              </NumberField>
              <NumberField variant="secondary" value={123.45}>
                Secondary variant
              </NumberField>
              <NumberField variant="success" value={123.45}>
                Success variant
              </NumberField>
            </div>
            <div className="space-y-2">
              <NumberField variant="warning" value={123.45}>
                Warning variant
              </NumberField>
              <NumberField variant="error" value={123.45}>
                Error variant
              </NumberField>
              <NumberField variant="muted" value={123.45}>
                Muted variant
              </NumberField>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Number Sizes</h2>
          <div className="space-y-2">
            <NumberField size="xs" value={123.45}>
              Extra small number
            </NumberField>
            <NumberField size="sm" value={123.45}>
              Small number
            </NumberField>
            <NumberField size="md" value={123.45}>
              Medium number (default)
            </NumberField>
            <NumberField size="lg" value={123.45}>
              Large number
            </NumberField>
            <NumberField size="xl" value={123.45}>
              Extra large number
            </NumberField>
            <NumberField size="2xl" value={123.45}>
              2XL number
            </NumberField>
            <NumberField size="3xl" value={123.45}>
              3XL number
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Font Weights</h2>
          <div className="space-y-2">
            <NumberField weight="normal" value={123.45}>
              Normal weight
            </NumberField>
            <NumberField weight="medium" value={123.45}>
              Medium weight
            </NumberField>
            <NumberField weight="semibold" value={123.45}>
              Semibold weight
            </NumberField>
            <NumberField weight="bold" value={123.45}>
              Bold weight
            </NumberField>
            <NumberField weight="extrabold" value={123.45}>
              Extrabold weight
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Number Alignment</h2>
          <div className="space-y-2">
            <NumberField align="left" value={123.45}>
              Left aligned number
            </NumberField>
            <NumberField align="center" value={123.45}>
              Center aligned number
            </NumberField>
            <NumberField align="right" value={123.45}>
              Right aligned number (default)
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Decimal Places</h2>
          <div className="space-y-2">
            <NumberField value={123.456} decimals={0}>
              No decimals
            </NumberField>
            <NumberField value={123.456} decimals={1}>
              1 decimal place
            </NumberField>
            <NumberField value={123.456} decimals={2}>
              2 decimal places (default)
            </NumberField>
            <NumberField value={123.456} decimals={3}>
              3 decimal places
            </NumberField>
            <NumberField value={123.456} decimals={4}>
              4 decimal places
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Thousands Separator</h2>
          <div className="space-y-2">
            <NumberField value={1234567} showThousandsSeparator={false}>
              Without separator
            </NumberField>
            <NumberField value={1234567} showThousandsSeparator>
              With comma separator (default)
            </NumberField>
            <NumberField
              value={1234567}
              showThousandsSeparator
              thousandsSeparator="."
            >
              With dot separator
            </NumberField>
            <NumberField
              value={1234567}
              showThousandsSeparator
              thousandsSeparator=" "
            >
              With space separator
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Sign Display</h2>
          <div className="space-y-2">
            <NumberField value={123.45} showMinusSign showPlusSign>
              Always show signs
            </NumberField>
            <NumberField value={-123.45} showMinusSign showPlusSign>
              Negative with plus sign
            </NumberField>
            <NumberField
              value={123.45}
              showMinusSign={false}
              showPlusSign={false}
            >
              Never show signs
            </NumberField>
            <NumberField
              value={-123.45}
              showMinusSign={false}
              showPlusSign={false}
            >
              Negative without sign
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Prefixes and Suffixes</h2>
          <div className="space-y-2">
            <NumberField value={123.45} prefix="Price: ">
              With prefix
            </NumberField>
            <NumberField value={123.45} suffix=" units">
              With suffix
            </NumberField>
            <NumberField value={123.45} prefix="Total: " suffix=" items">
              With both
            </NumberField>
            <NumberField value={123.45} prefix="€" suffix=" EUR">
              Currency style
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Currency Formatting</h2>
          <div className="space-y-2">
            <NumberField value={123.45} currency currencySymbol="$">
              Dollar symbol
            </NumberField>
            <NumberField value={123.45} currency currencySymbol="€">
              Euro symbol
            </NumberField>
            <NumberField value={123.45} currency currencySymbol="£">
              Pound symbol
            </NumberField>
            <NumberField value={123.45} currency currencyCode="USD">
              USD code
            </NumberField>
            <NumberField value={123.45} currency currencyCode="EUR">
              EUR code
            </NumberField>
            <NumberField value={123.45} currency currencyCode="JPY">
              JPY code
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Percentage Formatting</h2>
          <div className="space-y-2">
            <NumberField value={0.1234} percentage>
              With percentage sign
            </NumberField>
            <NumberField value={0.5678} percentage showPercentageSign={false}>
              Without percentage sign
            </NumberField>
            <NumberField value={0.9} percentage>
              High percentage
            </NumberField>
            <NumberField value={0.01} percentage>
              Low percentage
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Scientific Notation</h2>
          <div className="space-y-2">
            <NumberField value={1234567} scientific>
              Default significant digits
            </NumberField>
            <NumberField value={1234567} scientific significantDigits={2}>
              2 significant digits
            </NumberField>
            <NumberField value={1234567} scientific significantDigits={4}>
              4 significant digits
            </NumberField>
            <NumberField value={0.00000123} scientific>
              Very small number
            </NumberField>
            <NumberField value={999999999999} scientific>
              Very large number
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Compact Notation</h2>
          <div className="space-y-2">
            <NumberField value={1234} compact>
              Thousands (K)
            </NumberField>
            <NumberField value={1234567} compact>
              Millions (M)
            </NumberField>
            <NumberField value={1234567890} compact>
              Billions (B)
            </NumberField>
            <NumberField value={1234567890000} compact>
              Trillions (T)
            </NumberField>
            <NumberField value={999} compact>
              Below threshold
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Interactive Numbers</h2>
          <div className="space-y-4">
            <div>
              <NumberField clickable onClick={handleClick} value={123.45}>
                Clickable number (clicked {clickCount} times)
              </NumberField>
            </div>
            <div>
              <NumberField showCopyButton value={123.45}>
                Number with copy button - click the clipboard icon to copy
              </NumberField>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Combined Styling</h2>
          <div className="space-y-3">
            <NumberField
              variant="primary"
              size="lg"
              weight="bold"
              align="center"
              className="border-b-2 border-blue-300 pb-1"
              value={123.45}
            >
              Primary, Large, Bold, Centered with Border
            </NumberField>

            <NumberField
              variant="success"
              size="xl"
              weight="semibold"
              align="right"
              className="bg-green-50 px-3 py-2 rounded-lg"
              value={123.45}
            >
              Success, XL, Semibold, Right-aligned with Background
            </NumberField>

            <NumberField
              variant="warning"
              size="2xl"
              weight="extrabold"
              align="center"
              className="bg-yellow-50 px-4 py-3 rounded-xl shadow-sm"
              value={123.45}
            >
              Warning, 2XL, Extrabold, Centered with Enhanced Styling
            </NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Real-world Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Financial Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <NumberField
                    variant="success"
                    size="lg"
                    weight="bold"
                    value={1234567.89}
                    currency
                    currencyCode="USD"
                    className="mb-1"
                  />
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center">
                  <NumberField
                    variant="primary"
                    size="lg"
                    weight="bold"
                    value={0.2345}
                    percentage
                    className="mb-1"
                  />
                  <p className="text-sm text-gray-600">Growth Rate</p>
                </div>
                <div className="text-center">
                  <NumberField
                    variant="warning"
                    size="lg"
                    weight="bold"
                    value={56789}
                    showThousandsSeparator
                    className="mb-1"
                  />
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Product Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <NumberField
                    variant="primary"
                    weight="semibold"
                    value={0.9876}
                    percentage
                    className="mb-1"
                  />
                  <p className="text-sm text-gray-600">Customer Satisfaction</p>
                </div>
                <div>
                  <NumberField
                    variant="success"
                    weight="semibold"
                    value={1234}
                    compact
                    className="mb-1"
                  />
                  <p className="text-sm text-gray-600">Monthly Orders</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Scientific Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <NumberField
                    variant="secondary"
                    weight="medium"
                    value={0.00000000123}
                    scientific
                    significantDigits={3}
                    className="mb-1"
                  />
                  <p className="text-sm text-gray-600">Atomic Scale</p>
                </div>
                <div>
                  <NumberField
                    variant="secondary"
                    weight="medium"
                    value={1234567890000}
                    scientific
                    significantDigits={4}
                    className="mb-1"
                  />
                  <p className="text-sm text-gray-600">Cosmic Scale</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Edge Cases</h2>
          <div className="space-y-2">
            <NumberField value={0}>Zero</NumberField>
            <NumberField value={0.000001} decimals={6}>
              Very small decimal
            </NumberField>
            <NumberField value={999999999999} showThousandsSeparator>
              Very large number
            </NumberField>
            <NumberField value={NaN}>Not a Number</NumberField>
            <NumberField value={Infinity}>Infinity</NumberField>
            <NumberField value={-Infinity}>Negative Infinity</NumberField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberField Props Reference
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>value:</strong> number - Required numeric value to display
            </div>
            <div>
              <strong>decimals:</strong> number - Number of decimal places
              (default: 2)
            </div>
            <div>
              <strong>showThousandsSeparator:</strong> boolean - Whether to show
              thousands separator (default: true)
            </div>
            <div>
              <strong>thousandsSeparator:</strong> string - Custom thousands
              separator (default: ',')
            </div>
            <div>
              <strong>decimalSeparator:</strong> string - Custom decimal
              separator (default: '.')
            </div>
            <div>
              <strong>showPlusSign:</strong> boolean - Whether to show plus sign
              for positive numbers (default: false)
            </div>
            <div>
              <strong>showMinusSign:</strong> boolean - Whether to show minus
              sign for negative numbers (default: true)
            </div>
            <div>
              <strong>prefix:</strong> string - Custom prefix before the number
            </div>
            <div>
              <strong>suffix:</strong> string - Custom suffix after the number
            </div>
            <div>
              <strong>currency:</strong> boolean - Whether to format as currency
              (default: false)
            </div>
            <div>
              <strong>currencyCode:</strong> string - Currency code (e.g.,
              'USD', 'EUR')
            </div>
            <div>
              <strong>currencySymbol:</strong> string - Currency symbol (e.g.,
              '$', '€') (default: '$')
            </div>
            <div>
              <strong>percentage:</strong> boolean - Whether to format as
              percentage (default: false)
            </div>
            <div>
              <strong>showPercentageSign:</strong> boolean - Whether to show
              percentage sign (default: true)
            </div>
            <div>
              <strong>scientific:</strong> boolean - Whether to format as
              scientific notation (default: false)
            </div>
            <div>
              <strong>significantDigits:</strong> number - Number of significant
              digits for scientific notation (default: 3)
            </div>
            <div>
              <strong>compact:</strong> boolean - Whether to format as compact
              notation (e.g., 1K, 1M) (default: false)
            </div>
            <div>
              <strong>showCopyButton:</strong> boolean - Whether to show copy
              button (default: false)
            </div>
            <div>
              <strong>align:</strong> 'left' | 'center' | 'right' - Text
              alignment (default: 'right')
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
              <strong>clickable:</strong> boolean - Whether the field is
              clickable (default: false)
            </div>
            <div>
              <strong>onClick:</strong> () =&gt; void - Click handler function
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
