import React, { useState } from "react";
import { EmailInput } from "../src/components/EmailInput";
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

export default function EmailInputExample() {
  const [emailValue, setEmailValue] = useState<string>("");
  const [multipleEmails, setMultipleEmails] = useState<string>("");
  const [showStrengthIndicator, setShowStrengthIndicator] = useState(false);
  const [showDomainSuggestions, setShowDomainSuggestions] = useState(false);
  const [showVerificationStatus, setShowVerificationStatus] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handleMultipleEmailsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMultipleEmails(e.target.value);
  };

  const handleResendVerification = () => {
    alert("Verification email sent!");
  };

  const customValidator = (email: string) => {
    if (!email) return "Email is required";
    if (email.includes("admin")) return "Admin emails are not allowed";
    if (email.length < 10) return "Email must be at least 10 characters long";
    return true;
  };

  return (
    <SuperAdminProvider config={exampleConfig}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          EmailInput Component Examples
        </h1>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Basic EmailInput</h2>
          <div className="space-y-4">
            <EmailInput
              label="Email Address"
              placeholder="Enter your email address"
              value={emailValue}
              onChange={handleEmailChange}
            />
            <div className="text-sm text-gray-600">
              Entered email: {emailValue || "None"}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">EmailInput with Icons</h2>
          <div className="space-y-4">
            <EmailInput
              label="Contact Email"
              leftIcon="📧"
              rightIcon="✉️"
              placeholder="Enter contact email"
              helperText="This will be used for communications"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Validation
          </h2>
          <div className="space-y-4">
            <EmailInput
              label="Required Email"
              required
              error="This field is required"
              placeholder="Enter a required email"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Helper Text
          </h2>
          <div className="space-y-4">
            <EmailInput
              label="Work Email"
              helperText="Please use your company email address"
              placeholder="Enter work email"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Format Hint
          </h2>
          <div className="space-y-4">
            <EmailInput
              label="Email with Format Hint"
              showFormatHint
              placeholder="Enter email address"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Multiple Emails
          </h2>
          <div className="space-y-4">
            <EmailInput
              label="Multiple Email Addresses"
              allowMultiple
              showFormatHint
              value={multipleEmails}
              onChange={handleMultipleEmailsChange}
              placeholder="Enter multiple emails separated by commas"
              helperText="You can enter multiple email addresses separated by commas"
            />
            <div className="text-sm text-gray-600">
              Entered emails: {multipleEmails || "None"}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Domain Suggestions
          </h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <Button
                onClick={() => setShowDomainSuggestions(!showDomainSuggestions)}
                variant={showDomainSuggestions ? "default" : "outline"}
              >
                {showDomainSuggestions ? "Hide" : "Show"} Domain Suggestions
              </Button>
            </div>
            <EmailInput
              label="Email with Domain Suggestions"
              autoCompleteDomains={showDomainSuggestions}
              commonDomains={[
                "gmail.com",
                "yahoo.com",
                "hotmail.com",
                "outlook.com",
                "icloud.com",
              ]}
              placeholder="Start typing to see domain suggestions"
              helperText="Type @ followed by a letter to see domain suggestions"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Strength Indicator
          </h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <Button
                onClick={() => setShowStrengthIndicator(!showStrengthIndicator)}
                variant={showStrengthIndicator ? "default" : "outline"}
              >
                {showStrengthIndicator ? "Hide" : "Show"} Strength Indicator
              </Button>
            </div>
            <EmailInput
              label="Email with Strength Indicator"
              showStrengthIndicator={showStrengthIndicator}
              value={emailValue}
              onChange={handleEmailChange}
              placeholder="Enter email to see strength indicator"
              helperText="The strength indicator shows how secure your email format is"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Preview
          </h2>
          <div className="space-y-4">
            <EmailInput
              label="Email with Preview"
              showPreview
              value={emailValue}
              onChange={handleEmailChange}
              placeholder="Enter email to see preview"
              helperText="The preview shows exactly what you've entered"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Verification Status
          </h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <Button
                onClick={() =>
                  setShowVerificationStatus(!showVerificationStatus)
                }
                variant={showVerificationStatus ? "default" : "outline"}
              >
                {showVerificationStatus ? "Hide" : "Show"} Verification Status
              </Button>
              <Button
                onClick={() => setIsVerified(!isVerified)}
                variant={isVerified ? "default" : "outline"}
                size="sm"
              >
                Toggle Verification Status
              </Button>
            </div>
            <EmailInput
              label="Email with Verification Status"
              showVerificationStatus={showVerificationStatus}
              isVerified={isVerified}
              showResendVerification={showVerificationStatus}
              onResendVerification={handleResendVerification}
              value={emailValue}
              onChange={handleEmailChange}
              placeholder="Enter email to see verification status"
              helperText="Shows whether the email has been verified"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Custom Validation
          </h2>
          <div className="space-y-4">
            <EmailInput
              label="Custom Validated Email"
              validateEmail={customValidator}
              placeholder="Enter email (admin emails not allowed)"
              helperText="Custom validation: admin emails are not allowed, minimum 10 characters"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with International Support
          </h2>
          <div className="space-y-4">
            <EmailInput
              label="International Email"
              allowInternational
              placeholder="Enter international email (e.g., test@example.co.uk)"
              helperText="Supports international email formats"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">EmailInput Sizes</h2>
          <div className="space-y-4">
            <EmailInput
              label="Small EmailInput"
              size="sm"
              placeholder="Small size"
            />
            <EmailInput
              label="Medium EmailInput (default)"
              size="md"
              placeholder="Medium size"
            />
            <EmailInput
              label="Large EmailInput"
              size="lg"
              placeholder="Large size"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Full Width
          </h2>
          <div className="space-y-4">
            <EmailInput
              label="Full Width EmailInput"
              fullWidth
              placeholder="This input takes full width"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">EmailInput States</h2>
          <div className="space-y-4">
            <EmailInput
              label="Disabled EmailInput"
              disabled
              value="disabled@example.com"
              helperText="This input is disabled"
            />
            <EmailInput
              label="Read-only EmailInput"
              readOnly
              value="readonly@example.com"
              helperText="This input is read-only"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput with Custom Styling
          </h2>
          <div className="space-y-4">
            <EmailInput
              label="Custom Styled EmailInput"
              className="border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              wrapperClassName="bg-purple-50 p-4 rounded-lg"
              placeholder="Custom styled input"
              helperText="This input has custom styling applied"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">
            EmailInput Props Reference
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
              <strong>showValidation:</strong> boolean - Whether to show email
              validation (default: true)
            </div>
            <div>
              <strong>allowMultiple:</strong> boolean - Whether to allow
              multiple emails (default: false)
            </div>
            <div>
              <strong>validateEmail:</strong> function - Custom email validation
              function
            </div>
            <div>
              <strong>showSuggestions:</strong> boolean - Whether to show email
              suggestions (default: false)
            </div>
            <div>
              <strong>commonDomains:</strong> string[] - Common email domains
              for suggestions
            </div>
            <div>
              <strong>showFormatHint:</strong> boolean - Whether to show email
              format hint (default: false)
            </div>
            <div>
              <strong>autoCompleteDomains:</strong> boolean - Whether to
              auto-complete email domains (default: false)
            </div>
            <div>
              <strong>showStrengthIndicator:</strong> boolean - Whether to show
              email strength indicator (default: false)
            </div>
            <div>
              <strong>allowInternational:</strong> boolean - Whether to allow
              international email addresses (default: true)
            </div>
            <div>
              <strong>showPreview:</strong> boolean - Whether to show email
              preview (default: false)
            </div>
            <div>
              <strong>showVerificationStatus:</strong> boolean - Whether to show
              email verification status (default: false)
            </div>
            <div>
              <strong>isVerified:</strong> boolean - Whether the email is
              verified (default: false)
            </div>
            <div>
              <strong>showResendVerification:</strong> boolean - Whether to show
              resend verification button (default: false)
            </div>
            <div>
              <strong>onResendVerification:</strong> function - Callback for
              resending verification
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
