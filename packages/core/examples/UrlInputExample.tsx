import React, { useState } from "react";
import { UrlInput } from "../src/components/UrlInput";

export const UrlInputExample: React.FC = () => {
  const [basicUrl, setBasicUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [relativeUrl, setRelativeUrl] = useState("");
  const [mailtoUrl, setMailtoUrl] = useState("");
  const [telUrl, setTelUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [complexUrl, setComplexUrl] = useState("");
  const [customValidationUrl, setCustomValidationUrl] = useState("");

  const customValidateUrl = (url: string): boolean | string => {
    if (!url) return "URL is required";

    // Custom validation: only allow URLs from specific domains
    if (url.includes("example.com") || url.includes("test.com")) {
      return "URLs from example.com and test.com are not allowed in production";
    }

    try {
      new URL(url);
      return true;
    } catch {
      return "Please enter a valid URL";
    }
  };

  const commonSuggestions = [
    "https://google.com",
    "https://github.com",
    "https://stackoverflow.com",
    "https://medium.com",
  ];

  const apiSuggestions = [
    "https://api.github.com",
    "https://jsonplaceholder.typicode.com",
    "https://httpbin.org",
    "https://reqres.in",
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          UrlInput Component Examples
        </h1>
        <p className="text-gray-600">
          Various configurations and use cases for the UrlInput component
        </p>
      </div>

      {/* Basic Usage */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Basic Usage
        </h2>
        <UrlInput
          label="Basic URL Input"
          placeholder="Enter any URL"
          value={basicUrl}
          onChange={(e) => setBasicUrl(e.target.value)}
          helperText="Simple URL input with basic validation"
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {basicUrl || "None"}
        </div>
      </div>

      {/* Website URL with Icons */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Website URL with Icons
        </h2>
        <UrlInput
          label="Website URL"
          placeholder="https://yourwebsite.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          leftIcon={<span>🌐</span>}
          rightIcon={<span>🔗</span>}
          helperText="URL input with left and right icons"
          showFormatHint
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {websiteUrl || "None"}
        </div>
      </div>

      {/* API URL with Validation */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          API URL with Validation
        </h2>
        <UrlInput
          label="API Endpoint"
          placeholder="https://api.example.com/endpoint"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          helperText="API URL input with enhanced validation"
          showValidation
          showPreview
          showBreakdown
          showStatistics
          error={
            apiUrl && !apiUrl.includes("api.")
              ? 'API URLs should typically include "api." subdomain'
              : undefined
          }
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {apiUrl || "None"}
        </div>
      </div>

      {/* Relative URL Support */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Relative URL Support
        </h2>
        <UrlInput
          label="Relative Path"
          placeholder="/relative/path"
          value={relativeUrl}
          onChange={(e) => setRelativeUrl(e.target.value)}
          helperText="Supports relative URLs starting with /"
          allowRelative
          showFormatHint
          showPreview
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {relativeUrl || "None"}
        </div>
      </div>

      {/* Mailto URL */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Mailto URL</h2>
        <UrlInput
          label="Email Link"
          placeholder="mailto:user@example.com"
          value={mailtoUrl}
          onChange={(e) => setMailtoUrl(e.target.value)}
          helperText="Email link URL with mailto: protocol"
          allowMailtoUrls
          showFormatHint
          showPreview
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {mailtoUrl || "None"}
        </div>
      </div>

      {/* Tel URL */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tel URL</h2>
        <UrlInput
          label="Phone Link"
          placeholder="tel:+1234567890"
          value={telUrl}
          onChange={(e) => setTelUrl(e.target.value)}
          helperText="Phone link URL with tel: protocol"
          allowTelUrls
          showFormatHint
          showPreview
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {telUrl || "None"}
        </div>
      </div>

      {/* Data URL */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data URL</h2>
        <UrlInput
          label="Data URL"
          placeholder="data:text/plain,Hello World"
          value={dataUrl}
          onChange={(e) => setDataUrl(e.target.value)}
          helperText="Data URL for embedding content directly"
          allowDataUrls
          showFormatHint
          showPreview
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {dataUrl || "None"}
        </div>
      </div>

      {/* File URL */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">File URL</h2>
        <UrlInput
          label="File URL"
          placeholder="file:///path/to/file"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          helperText="File URL for local file references"
          allowFileUrls
          showFormatHint
          showPreview
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {fileUrl || "None"}
        </div>
      </div>

      {/* Complex URL with All Features */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Complex URL with All Features
        </h2>
        <UrlInput
          label="Complex URL"
          placeholder="https://subdomain.example.com:8080/path?param=value#section"
          value={complexUrl}
          onChange={(e) => setComplexUrl(e.target.value)}
          helperText="URL with all features enabled for demonstration"
          showValidation
          showPreview
          showBreakdown
          showStatistics
          showProtocolSuggestions
          showUrlShortening
          showQrCode
          showSocialPreview
          showHistory
          showBookmarking
          showSharing
          autoPrependProtocol
          defaultProtocol="https://"
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {complexUrl || "None"}
        </div>
      </div>

      {/* URL with Suggestions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          URL with Suggestions
        </h2>
        <UrlInput
          label="Common Websites"
          placeholder="Select from suggestions or type your own"
          value={basicUrl}
          onChange={(e) => setBasicUrl(e.target.value)}
          helperText="URL input with predefined suggestions"
          showSuggestions
          suggestions={commonSuggestions}
          showPreview
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {basicUrl || "None"}
        </div>
      </div>

      {/* API URL with API-specific Suggestions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          API URL with API-specific Suggestions
        </h2>
        <UrlInput
          label="API Endpoint"
          placeholder="Select from API suggestions or type your own"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          helperText="API URL input with API-specific suggestions"
          showSuggestions
          suggestions={apiSuggestions}
          showPreview
          showBreakdown
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {apiUrl || "None"}
        </div>
      </div>

      {/* Custom Validation */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Custom Validation
        </h2>
        <UrlInput
          label="Production URL"
          placeholder="Enter a production URL"
          value={customValidationUrl}
          onChange={(e) => setCustomValidationUrl(e.target.value)}
          helperText="Custom validation: example.com and test.com are not allowed"
          validateUrl={customValidateUrl}
          showValidation
          showPreview
        />
        <div className="mt-2 text-sm text-gray-600">
          Current value: {customValidationUrl || "None"}
        </div>
      </div>

      {/* Different Sizes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Different Sizes
        </h2>
        <div className="space-y-4">
          <UrlInput
            label="Small Size"
            placeholder="Small input"
            size="sm"
            helperText="Small size input"
          />
          <UrlInput
            label="Medium Size (Default)"
            placeholder="Medium input"
            size="md"
            helperText="Medium size input (default)"
          />
          <UrlInput
            label="Large Size"
            placeholder="Large input"
            size="lg"
            helperText="Large size input"
          />
        </div>
      </div>

      {/* Full Width */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Full Width</h2>
        <UrlInput
          label="Full Width URL Input"
          placeholder="This input takes the full width of its container"
          fullWidth
          helperText="Full width input for better mobile experience"
        />
      </div>

      {/* Disabled and Read-only States */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Disabled and Read-only States
        </h2>
        <div className="space-y-4">
          <UrlInput
            label="Disabled URL Input"
            value="https://example.com"
            disabled
            helperText="This input is disabled"
          />
          <UrlInput
            label="Read-only URL Input"
            value="https://readonly-example.com"
            readOnly
            helperText="This input is read-only"
          />
        </div>
      </div>

      {/* Error States */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Error States
        </h2>
        <div className="space-y-4">
          <UrlInput
            label="URL with Error"
            value="invalid-url"
            error="This is not a valid URL format"
            helperText="Error message overrides helper text"
          />
          <UrlInput
            label="Required URL"
            required
            error="This field is required"
          />
        </div>
      </div>

      {/* Auto-prepend Protocol */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Auto-prepend Protocol
        </h2>
        <UrlInput
          label="Website URL (Auto HTTPS)"
          placeholder="example.com (will auto-add https://)"
          helperText="Automatically adds https:// protocol if none is specified"
          autoPrependProtocol
          defaultProtocol="https://"
          showPreview
        />
      </div>

      {/* Protocol Suggestions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Protocol Suggestions
        </h2>
        <UrlInput
          label="URL with Protocol Suggestions"
          placeholder="Click the 🔗 button to see protocol options"
          helperText="Click the protocol button to see available protocols"
          showProtocolSuggestions
          allowMailtoUrls
          allowTelUrls
          showPreview
        />
      </div>

      <div className="text-center text-gray-600 mt-8">
        <p>
          These examples demonstrate the various features and configurations of
          the UrlInput component.
        </p>
        <p className="mt-2">
          Each input shows different aspects of URL handling, validation, and
          user experience.
        </p>
      </div>
    </div>
  );
};
