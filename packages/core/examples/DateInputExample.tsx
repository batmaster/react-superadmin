import React, { useState } from "react";
import { DateInput } from "../src/components/DateInput";
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

export default function DateInputExample() {
  const [dateValue, setDateValue] = useState<string>("");
  const [dateWithTime, setDateWithTime] = useState<string>("");
  const [customFormatDate, setCustomFormatDate] = useState<string>("");
  const [minMaxDate, setMinMaxDate] = useState<string>("");
  const [showTodayButton, setShowTodayButton] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateValue(e.target.value);
  };

  const handleDateWithTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateWithTime(e.target.value);
  };

  const handleCustomFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomFormatDate(e.target.value);
  };

  const handleMinMaxDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinMaxDate(e.target.value);
  };

  const formatDateCustom = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const customParseDate = (value: string) => {
    if (!value) return null;
    const [day, month, year] = value.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          DateInput Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic DateInput</h2>
          <div className="space-y-4">
            <DateInput
              label="Birth Date"
              placeholder="Select your birth date"
              value={dateValue}
              onChange={handleDateChange}
            />
            <div className="text-sm text-gray-600">
              Selected date: {dateValue || "None"}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">DateInput with Icons</h2>
          <div className="space-y-4">
            <DateInput
              label="Event Date"
              leftIcon="📅"
              rightIcon="🎯"
              placeholder="Select event date"
              helperText="Choose a date for your event"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput with Validation
          </h2>
          <div className="space-y-4">
            <DateInput
              label="Required Date"
              required
              error="This field is required"
              placeholder="Select a required date"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput with Helper Text
          </h2>
          <div className="space-y-4">
            <DateInput
              label="Appointment Date"
              helperText="Please select a date for your appointment"
              placeholder="Choose appointment date"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput with Min/Max Constraints
          </h2>
          <div className="space-y-4">
            <DateInput
              label="Project Deadline"
              minDate={new Date()}
              maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
              value={minMaxDate}
              onChange={handleMinMaxDateChange}
              placeholder="Select project deadline"
              helperText="Deadline must be between today and one year from now"
            />
            <div className="text-sm text-gray-600">
              Selected deadline: {minMaxDate || "None"}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput with Today Button
          </h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <Button
                onClick={() => setShowTodayButton(!showTodayButton)}
                variant={showTodayButton ? "default" : "outline"}
              >
                {showTodayButton ? "Hide" : "Show"} Today Button
              </Button>
            </div>
            <DateInput
              label="Quick Date Selection"
              showTodayButton={showTodayButton}
              placeholder="Select date or click Today"
              helperText="Use the Today button for quick selection"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput with Clear Button
          </h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <Button
                onClick={() => setShowClearButton(!showClearButton)}
                variant={showClearButton ? "default" : "outline"}
              >
                {showClearButton ? "Hide" : "Show"} Clear Button
              </Button>
            </div>
            <DateInput
              label="Clearable Date"
              showClearButton={showClearButton}
              value={dateValue}
              onChange={handleDateChange}
              placeholder="Select date or clear it"
              helperText="Use the Clear button to reset the date"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput with Custom Format
          </h2>
          <div className="space-y-4">
            <DateInput
              label="Custom Format Date"
              formatDate={formatDateCustom}
              parseDate={customParseDate}
              value={customFormatDate}
              onChange={handleCustomFormatChange}
              placeholder="Enter date as DD/MM/YYYY"
              helperText="Custom format: DD/MM/YYYY (e.g., 15/1/2024)"
            />
            <div className="text-sm text-gray-600">
              Custom formatted date: {customFormatDate || "None"}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput with UTC Support
          </h2>
          <div className="space-y-4">
            <DateInput
              label="UTC Date"
              useUTC
              value={dateWithTime}
              onChange={handleDateWithTimeChange}
              placeholder="Select UTC date"
              helperText="This date will be handled in UTC timezone"
            />
            <div className="text-sm text-gray-600">
              UTC date: {dateWithTime || "None"}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">DateInput Sizes</h2>
          <div className="space-y-4">
            <DateInput
              label="Small DateInput"
              size="sm"
              placeholder="Small size"
            />
            <DateInput
              label="Medium DateInput (default)"
              size="md"
              placeholder="Medium size"
            />
            <DateInput
              label="Large DateInput"
              size="lg"
              placeholder="Large size"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput with Full Width
          </h2>
          <div className="space-y-4">
            <DateInput
              label="Full Width DateInput"
              fullWidth
              placeholder="This input takes full width"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">DateInput States</h2>
          <div className="space-y-4">
            <DateInput
              label="Disabled DateInput"
              disabled
              value="2024-01-15"
              helperText="This input is disabled"
            />
            <DateInput
              label="Read-only DateInput"
              readOnly
              value="2024-01-15"
              helperText="This input is read-only"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput with Custom Styling
          </h2>
          <div className="space-y-4">
            <DateInput
              label="Custom Styled DateInput"
              className="border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              wrapperClassName="bg-purple-50 p-4 rounded-lg"
              placeholder="Custom styled input"
              helperText="This input has custom styling applied"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            DateInput Props Reference
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
              <strong>dateFormat:</strong> string - Date format to display
              (default: 'YYYY-MM-DD')
            </div>
            <div>
              <strong>minDate:</strong> Date - Minimum date allowed
            </div>
            <div>
              <strong>maxDate:</strong> Date - Maximum date allowed
            </div>
            <div>
              <strong>showDatePicker:</strong> boolean - Whether to show date
              picker (default: true)
            </div>
            <div>
              <strong>allowManualInput:</strong> boolean - Whether to allow
              manual input (default: true)
            </div>
            <div>
              <strong>placeholder:</strong> string - Placeholder text
            </div>
            <div>
              <strong>showTodayButton:</strong> boolean - Whether to show today
              button (default: false)
            </div>
            <div>
              <strong>showClearButton:</strong> boolean - Whether to show clear
              button (default: false)
            </div>
            <div>
              <strong>parseDate:</strong> function - Custom date parser function
            </div>
            <div>
              <strong>formatDate:</strong> function - Custom date formatter
              function
            </div>
            <div>
              <strong>useUTC:</strong> boolean - Whether to use UTC dates
              (default: false)
            </div>
            <div>
              <strong>timezone:</strong> string - Timezone to use
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
