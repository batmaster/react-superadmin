import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UrlInput } from "../../components/UrlInput";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const defaultConfig = {
  theme: {
    primary: "blue",
    secondary: "gray",
  },
  layout: {
    sidebar: { width: 250, collapsed: false },
    header: { height: 64, sticky: true },
  },
  auth: {
    enabled: true,
    loginUrl: "/login",
    logoutUrl: "/logout",
  },
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <SuperAdminProvider config={defaultConfig}>{component}</SuperAdminProvider>,
  );
};

describe("UrlInput", () => {
  describe("Rendering", () => {
    it("renders with basic props", () => {
      renderWithProvider(<UrlInput placeholder="Enter URL" />);
      expect(screen.getByPlaceholderText("Enter URL")).toBeInTheDocument();
    });

    it("renders with label", () => {
      renderWithProvider(<UrlInput label="Website URL" />);
      expect(screen.getByText("Website URL")).toBeInTheDocument();
    });

    it("renders with helper text", () => {
      renderWithProvider(<UrlInput helperText="Enter your website address" />);
      expect(
        screen.getByText("Enter your website address"),
      ).toBeInTheDocument();
    });

    it("renders with error message", () => {
      renderWithProvider(<UrlInput error="Invalid URL format" />);
      expect(screen.getByText("Invalid URL format")).toBeInTheDocument();
    });

    it("renders required indicator", () => {
      renderWithProvider(<UrlInput label="Website URL" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders with different sizes", () => {
      const { rerender } = renderWithProvider(<UrlInput size="sm" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("px-3 py-1.5 text-sm");

      rerender(<UrlInput size="lg" />);
      expect(input).toHaveClass("px-4 py-3 text-lg");
    });

    it("renders with full width", () => {
      renderWithProvider(<UrlInput fullWidth />);
      const wrapper = screen.getByRole("textbox").closest("div");
      expect(wrapper).toHaveClass("w-full");
    });

    it("renders with left icon", () => {
      renderWithProvider(<UrlInput leftIcon={<span>🔗</span>} />);
      expect(screen.getByText("🔗")).toBeInTheDocument();
    });

    it("renders with right icon", () => {
      renderWithProvider(<UrlInput rightIcon={<span>📱</span>} />);
      expect(screen.getByText("📱")).toBeInTheDocument();
    });

    it("renders with placeholder", () => {
      renderWithProvider(<UrlInput placeholder="https://example.com" />);
      expect(
        screen.getByPlaceholderText("https://example.com"),
      ).toBeInTheDocument();
    });
  });

  describe("Format Hint", () => {
    it("shows format hint when enabled", () => {
      renderWithProvider(<UrlInput showFormatHint />);
      expect(screen.getByText(/Format:/)).toBeInTheDocument();
    });

    it("shows mailto format hint when allowed", () => {
      renderWithProvider(<UrlInput showFormatHint allowMailtoUrls />);
      expect(screen.getByText(/mailto:email@example.com/)).toBeInTheDocument();
    });

    it("shows tel format hint when allowed", () => {
      renderWithProvider(<UrlInput showFormatHint allowTelUrls />);
      expect(screen.getByText(/tel:\+1234567890/)).toBeInTheDocument();
    });
  });

  describe("Preview", () => {
    it("shows URL preview when enabled", () => {
      renderWithProvider(<UrlInput showPreview value="https://example.com" />);
      expect(
        screen.getByText("Preview: https://example.com"),
      ).toBeInTheDocument();
    });

    it("does not show preview when no value", () => {
      renderWithProvider(<UrlInput showPreview />);
      expect(screen.queryByText(/Preview:/)).not.toBeInTheDocument();
    });
  });

  describe("URL Breakdown", () => {
    it("shows URL breakdown when enabled", () => {
      renderWithProvider(
        <UrlInput
          showBreakdown
          value="https://example.com:8080/path?query=value#hash"
        />,
      );
      expect(screen.getByText("URL Breakdown:")).toBeInTheDocument();
      expect(screen.getByText("Protocol: https:")).toBeInTheDocument();
      expect(screen.getByText("Hostname: example.com")).toBeInTheDocument();
      expect(screen.getByText("Port: 8080")).toBeInTheDocument();
      expect(screen.getByText("Path: /path")).toBeInTheDocument();
      expect(screen.getByText("Query: ?query=value")).toBeInTheDocument();
      expect(screen.getByText("Hash: #hash")).toBeInTheDocument();
    });

    it("handles URLs without optional parts", () => {
      renderWithProvider(
        <UrlInput showBreakdown value="https://example.com" />,
      );
      expect(screen.getByText("URL Breakdown:")).toBeInTheDocument();
      expect(screen.getByText("Protocol: https:")).toBeInTheDocument();
      expect(screen.getByText("Hostname: example.com")).toBeInTheDocument();
      expect(screen.queryByText(/Port:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Path:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Query:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Hash:/)).not.toBeInTheDocument();
    });
  });

  describe("URL Statistics", () => {
    it("shows URL statistics when enabled", () => {
      renderWithProvider(
        <UrlInput
          showStatistics
          value="https://sub.example.com/path?query=value#hash"
        />,
      );
      expect(screen.getByText("Statistics:")).toBeInTheDocument();
      expect(screen.getByText(/Length: \d+ characters/)).toBeInTheDocument();
      expect(screen.getByText("Has Protocol: Yes")).toBeInTheDocument();
      expect(screen.getByText("Has Subdomain: Yes")).toBeInTheDocument();
      expect(screen.getByText("Has Path: Yes")).toBeInTheDocument();
      expect(screen.getByText("Has Query: Yes")).toBeInTheDocument();
      expect(screen.getByText("Has Hash: Yes")).toBeInTheDocument();
    });

    it("handles URLs without certain features", () => {
      renderWithProvider(
        <UrlInput showStatistics value="https://example.com" />,
      );
      expect(screen.getByText("Has Subdomain: No")).toBeInTheDocument();
      expect(screen.getByText("Has Path: No")).toBeInTheDocument();
      expect(screen.getByText("Has Query: No")).toBeInTheDocument();
      expect(screen.getByText("Has Hash: No")).toBeInTheDocument();
    });
  });

  describe("Protocol Suggestions", () => {
    it("shows protocol suggestions button when enabled", () => {
      renderWithProvider(<UrlInput showProtocolSuggestions />);
      expect(screen.getByTitle("Protocol suggestions")).toBeInTheDocument();
    });

    it("shows protocol suggestions dropdown when clicked", async () => {
      renderWithProvider(<UrlInput showProtocolSuggestions />);
      const button = screen.getByTitle("Protocol suggestions");

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("https://")).toBeInTheDocument();
        expect(screen.getByText("http://")).toBeInTheDocument();
      });
    });

    it("includes mailto in suggestions when allowed", async () => {
      renderWithProvider(<UrlInput showProtocolSuggestions allowMailtoUrls />);
      const button = screen.getByTitle("Protocol suggestions");

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("mailto:")).toBeInTheDocument();
      });
    });

    it("includes tel in suggestions when allowed", async () => {
      renderWithProvider(<UrlInput showProtocolSuggestions allowTelUrls />);
      const button = screen.getByTitle("Protocol suggestions");

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("tel:")).toBeInTheDocument();
      });
    });

    it("applies selected protocol", async () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <UrlInput
          showProtocolSuggestions
          value="example.com"
          onChange={handleChange}
        />,
      );

      const button = screen.getByTitle("Protocol suggestions");
      fireEvent.click(button);

      await waitFor(() => {
        const httpsOption = screen.getByText("https://");
        fireEvent.click(httpsOption);
      });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { value: "https://example.com" },
        }),
      );
    });
  });

  describe("URL Suggestions", () => {
    it("shows URL suggestions when provided", () => {
      const suggestions = ["https://example.com", "https://test.com"];
      renderWithProvider(
        <UrlInput showSuggestions suggestions={suggestions} />,
      );

      expect(screen.getByText("Suggestions:")).toBeInTheDocument();
      expect(screen.getByText("https://example.com")).toBeInTheDocument();
      expect(screen.getByText("https://test.com")).toBeInTheDocument();
    });

    it("applies selected suggestion", () => {
      const handleChange = jest.fn();
      const suggestions = ["https://example.com"];

      renderWithProvider(
        <UrlInput
          showSuggestions
          suggestions={suggestions}
          onChange={handleChange}
        />,
      );

      const suggestion = screen.getByText("https://example.com");
      fireEvent.click(suggestion);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { value: "https://example.com" },
        }),
      );
    });
  });

  describe("Additional Features", () => {
    it("shows URL shortening button when enabled", () => {
      renderWithProvider(<UrlInput showUrlShortening />);
      expect(screen.getByText("🔗 Shorten URL")).toBeInTheDocument();
    });

    it("shows QR code button when enabled", () => {
      renderWithProvider(<UrlInput showQrCode />);
      expect(screen.getByText("📱 Generate QR")).toBeInTheDocument();
    });

    it("shows social preview button when enabled", () => {
      renderWithProvider(<UrlInput showSocialPreview />);
      expect(screen.getByText("📱 Social Preview")).toBeInTheDocument();
    });

    it("shows history button when enabled", () => {
      renderWithProvider(<UrlInput showHistory />);
      expect(screen.getByText("📚 History")).toBeInTheDocument();
    });

    it("shows bookmarking button when enabled", () => {
      renderWithProvider(<UrlInput showBookmarking />);
      expect(screen.getByText("🔖 Bookmark")).toBeInTheDocument();
    });

    it("shows sharing button when enabled", () => {
      renderWithProvider(<UrlInput showSharing />);
      expect(screen.getByText("📤 Share")).toBeInTheDocument();
    });
  });

  describe("Input Handling", () => {
    it("calls onChange when input value changes", () => {
      const handleChange = jest.fn();
      renderWithProvider(<UrlInput onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "https://example.com" } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { value: "https://example.com" },
        }),
      );
    });

    it("calls onBlur when input loses focus", () => {
      const handleBlur = jest.fn();
      renderWithProvider(<UrlInput onBlur={handleBlur} />);

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalled();
    });

    it("calls onFocus when input gains focus", () => {
      const handleFocus = jest.fn();
      renderWithProvider(<UrlInput onFocus={handleFocus} />);

      const input = screen.getByRole("textbox");
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("renders disabled input", () => {
      renderWithProvider(<UrlInput disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("applies disabled styles", () => {
      renderWithProvider(<UrlInput disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass(
        "disabled:bg-gray-50",
        "disabled:text-gray-500",
        "disabled:cursor-not-allowed",
      );
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = React.createRef<HTMLInputElement>();
      renderWithProvider(<UrlInput ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe("URL Validation", () => {
    it("validates standard URLs", () => {
      const handleChange = jest.fn();
      renderWithProvider(<UrlInput onChange={handleChange} showValidation />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "https://example.com" } });

      expect(handleChange).toHaveBeenCalled();
    });

    it("validates relative URLs when allowed", () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <UrlInput onChange={handleChange} showValidation allowRelative />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "/relative-path" } });

      expect(handleChange).toHaveBeenCalled();
    });

    it("validates mailto URLs when allowed", () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <UrlInput onChange={handleChange} showValidation allowMailtoUrls />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "mailto:test@example.com" } });

      expect(handleChange).toHaveBeenCalled();
    });

    it("validates tel URLs when allowed", () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <UrlInput onChange={handleChange} showValidation allowTelUrls />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "tel:+1234567890" } });

      expect(handleChange).toHaveBeenCalled();
    });

    it("validates data URLs when allowed", () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <UrlInput onChange={handleChange} showValidation allowDataUrls />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "data:text/plain,Hello" } });

      expect(handleChange).toHaveBeenCalled();
    });

    it("validates file URLs when allowed", () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <UrlInput onChange={handleChange} showValidation allowFileUrls />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "file:///path/to/file" } });

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("Auto-prepend Protocol", () => {
    it("auto-prepends protocol when enabled", () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <UrlInput
          onChange={handleChange}
          autoPrependProtocol
          defaultProtocol="https://"
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "example.com" } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { value: "https://example.com" },
        }),
      );
    });

    it("handles URLs starting with //", () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <UrlInput
          onChange={handleChange}
          autoPrependProtocol
          defaultProtocol="https://"
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "//example.com" } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { value: "https://example.com" },
        }),
      );
    });

    it("does not modify relative paths", () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <UrlInput
          onChange={handleChange}
          autoPrependProtocol
          defaultProtocol="https://"
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "/relative-path" } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: { value: "/relative-path" },
        }),
      );
    });
  });

  describe("Custom Validation", () => {
    it("uses custom validation function when provided", () => {
      const customValidate = jest.fn().mockReturnValue("Custom error message");
      renderWithProvider(
        <UrlInput validateUrl={customValidate} showValidation />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "invalid-url" } });

      expect(customValidate).toHaveBeenCalledWith("invalid-url");
    });
  });
});
