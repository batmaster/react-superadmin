import React, { useState } from "react";
import { NumberInput } from "../src/components/NumberInput";
import { Card } from "../src/components/Card";
import { Button } from "../src/components/Button";
import { SuperAdminProvider } from "../src/contexts/SuperAdminContext";

const exampleConfig = {
  title: "React SuperAdmin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

export default function NumberInputExample() {
  const [ageValue, setAgeValue] = useState<string>("");
  const [priceValue, setPriceValue] = useState<string>("");
  const [percentageValue, setPercentageValue] = useState<string>("");
  const [showControls, setShowControls] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showRangeIndicator, setShowRangeIndicator] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgeValue(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceValue(e.target.value);
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentageValue(e.target.value);
  };

  const customValidator = (value: number) => {
    if (value < 18) return "Must be at least 18 years old";
    if (value > 120) return "Age cannot exceed 120 years";
    if (value % 1 !== 0) return "Age must be a whole number";
    return true;
  };

  const suggestions = [18, 21, 25, 30, 35, 40, 50, 65];

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          NumberInput Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic NumberInput</h2>
          <div className="space-y-4">
            <NumberInput
              label="Age"
              placeholder="Enter your age"
              value={ageValue}
              onChange={handleAgeChange}
            />
            <div className="text-sm text-gray-600">
              Entered age: {ageValue || "None"}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">NumberInput with Icons</h2>
          <div className="space-y-4">
            <NumberInput
              label="Price"
              leftIcon="💰"
              rightIcon="💵"
              placeholder="Enter price"
              helperText="Enter the product price"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Validation
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Required Age"
              required
              error="This field is required"
              placeholder="Enter a required age"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Helper Text
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Score"
              helperText="Enter a score between 0 and 100"
              placeholder="Enter score"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Min/Max Constraints
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Temperature (°C)"
              min={-273.15}
              max={100}
              step={0.1}
              placeholder="Enter temperature"
              helperText="Temperature must be between -273.15°C and 100°C"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Controls
          </h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <Button
                onClick={() => setShowControls(!showControls)}
                variant={showControls ? "default" : "outline"}
              >
                {showControls ? "Hide" : "Show"} Controls
              </Button>
            </div>
            <NumberInput
              label="Quantity"
              showControls={showControls}
              min={0}
              max={100}
              step={1}
              value={ageValue}
              onChange={handleAgeChange}
              placeholder="Use +/- buttons or type directly"
              helperText="Use the + and - buttons to adjust the value"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Range Indicator
          </h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <Button
                onClick={() => setShowRangeIndicator(!showRangeIndicator)}
                variant={showRangeIndicator ? "default" : "outline"}
              >
                {showRangeIndicator ? "Hide" : "Show"} Range Indicator
              </Button>
            </div>
            <NumberInput
              label="Progress (0-100)"
              showRangeIndicator={showRangeIndicator}
              min={0}
              max={100}
              value={ageValue}
              onChange={handleAgeChange}
              placeholder="Enter progress value"
              helperText="Visual indicator shows where the value falls in the range"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Statistics
          </h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <Button
                onClick={() => setShowStatistics(!showStatistics)}
                variant={showStatistics ? "default" : "outline"}
              >
                {showStatistics ? "Hide" : "Show"} Statistics
              </Button>
            </div>
            <NumberInput
              label="Number with Statistics"
              showStatistics={showStatistics}
              value={ageValue}
              onChange={handleAgeChange}
              placeholder="Enter a number to see statistics"
              helperText="Shows mathematical properties of the entered number"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Suggestions
          </h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <Button
                onClick={() => setShowSuggestions(!showSuggestions)}
                variant={showSuggestions ? "default" : "outline"}
              >
                {showSuggestions ? "Hide" : "Show"} Suggestions
              </Button>
            </div>
            <NumberInput
              label="Age with Suggestions"
              showSuggestions={showSuggestions}
              suggestions={suggestions}
              value={ageValue}
              onChange={handleAgeChange}
              placeholder="Click a suggestion or type directly"
              helperText="Common age values for quick selection"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Custom Validation
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Custom Validated Age"
              validateNumber={customValidator}
              min={0}
              max={150}
              value={ageValue}
              onChange={handleAgeChange}
              placeholder="Enter age (custom validation)"
              helperText="Custom validation: must be 18+, under 120, and whole number"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Currency Formatting
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Price (USD)"
              currency
              currencySymbol="$"
              showThousandsSeparator
              value={priceValue}
              onChange={handlePriceChange}
              placeholder="Enter price in USD"
              helperText="Automatically formats as currency with thousands separator"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Percentage Formatting
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Success Rate"
              percentage
              showPercentageSign
              min={0}
              max={100}
              value={percentageValue}
              onChange={handlePercentageChange}
              placeholder="Enter percentage (0-100)"
              helperText="Automatically adds % symbol and validates range"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Scientific Notation
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Scientific Number"
              scientific
              significantDigits={4}
              placeholder="Enter a large or small number"
              helperText="Displays in scientific notation (e.g., 1.234e+6)"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Compact Notation
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Large Number"
              compact
              placeholder="Enter a large number"
              helperText="Displays in compact format (e.g., 1K, 1M)"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Custom Prefix/Suffix
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Custom Format"
              prefix="Value: "
              suffix=" units"
              showThousandsSeparator
              placeholder="Enter a number"
              helperText="Custom prefix and suffix with thousands separator"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">NumberInput Sizes</h2>
          <div className="space-y-4">
            <NumberInput
              label="Small NumberInput"
              size="sm"
              placeholder="Small size"
            />
            <NumberInput
              label="Medium NumberInput (default)"
              size="md"
              placeholder="Medium size"
            />
            <NumberInput
              label="Large NumberInput"
              size="lg"
              placeholder="Large size"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Full Width
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Full Width NumberInput"
              fullWidth
              placeholder="This input takes full width"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">NumberInput States</h2>
          <div className="space-y-4">
            <NumberInput
              label="Disabled NumberInput"
              disabled
              value="25"
              helperText="This input is disabled"
            />
            <NumberInput
              label="Read-only NumberInput"
              readOnly
              value="25"
              helperText="This input is read-only"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Custom Styling
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Custom Styled NumberInput"
              className="border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              wrapperClassName="bg-purple-50 p-4 rounded-lg"
              placeholder="Custom styled input"
              helperText="This input has custom styling applied"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput with Preview
          </h2>
          <div className="space-y-4">
            <NumberInput
              label="Number with Preview"
              showPreview
              value={ageValue}
              onChange={handleAgeChange}
              placeholder="Enter a number to see preview"
              helperText="Shows formatted preview of the entered number"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            NumberInput Props Reference
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>label:</strong> string - Input label
            </div>
            <div>
              <strong>helperText:</strong> string - Helper text below the input
            </div>
            <div>
              <strong>error:</strong> string - Error message to display
            </div>
            <div>
              <strong>required:</strong> boolean - Whether the input is required
              (default: false)
            </div>
            <div>
              <strong>size:</strong> 'sm' | 'md' | 'lg' - Input size (default:
              'md')
            </div>
            <div>
              <strong>fullWidth:</strong> boolean - Whether the input is full
              width (default: false)
            </div>
            <div>
              <strong>leftIcon:</strong> ReactNode - Left icon/element
            </div>
            <div>
              <strong>rightIcon:</strong> ReactNode - Right icon/element
            </div>
            <div>
              <strong>min:</strong> number - Minimum value allowed
            </div>
            <div>
              <strong>max:</strong> number - Maximum value allowed
            </div>
            <div>
              <strong>step:</strong> number - Step increment for number input
              (default: 1)
            </div>
            <div>
              <strong>showControls:</strong> boolean - Whether to show
              increment/decrement buttons (default: false)
            </div>
            <div>
              <strong>allowDecimals:</strong> boolean - Whether to allow decimal
              values (default: true)
            </div>
            <div>
              <strong>decimalPlaces:</strong> number - Number of decimal places
              to show (default: 2)
            </div>
            <div>
              <strong>showThousandsSeparator:</strong> boolean - Whether to show
              thousands separator (default: false)
            </div>
            <div>
              <strong>thousandsSeparator:</strong> string - Custom thousands
              separator character (default: ',')
            </div>
            <div>
              <strong>decimalSeparator:</strong> string - Custom decimal
              separator character (default: '.')
            </div>
            <div>
              <strong>showPlusSign:</strong> boolean - Whether to show the plus
              sign for positive numbers (default: false)
            </div>
            <div>
              <strong>showMinusSign:</strong> boolean - Whether to show the
              minus sign for negative numbers (default: true)
            </div>
            <div>
              <strong>prefix:</strong> string - Custom prefix to show before the
              number
            </div>
            <div>
              <strong>suffix:</strong> string - Custom suffix to show after the
              number
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
              <strong>showValidation:</strong> boolean - Whether to show number
              validation (default: true)
            </div>
            <div>
              <strong>validateNumber:</strong> function - Custom number
              validation function
            </div>
            <div>
              <strong>showPreview:</strong> boolean - Whether to show number
              preview (default: false)
            </div>
            <div>
              <strong>showStatistics:</strong> boolean - Whether to show number
              statistics (default: false)
            </div>
            <div>
              <strong>showRangeIndicator:</strong> boolean - Whether to show
              number range indicator (default: false)
            </div>
            <div>
              <strong>showSuggestions:</strong> boolean - Whether to show number
              suggestions (default: false)
            </div>
            <div>
              <strong>suggestions:</strong> number[] - Suggested number values
            </div>
            <div>
              <strong>className:</strong> string - Additional CSS classes
            </div>
            <div>
              <strong>wrapperClassName:</strong> string - Input wrapper class
              names
            </div>
          </div>
        </Card>
      </div>
    </SuperAdminProvider>
  );
}
