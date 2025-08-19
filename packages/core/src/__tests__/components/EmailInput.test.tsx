import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EmailInput } from "../../components/EmailInput";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

const mockConfig = {
  title: "Test Admin",
  theme: { primary: "#1976d2" },
  layout: { sidebarWidth: 240 },
  auth: { enabled: true },
  resources: [],
};

describe("EmailInput", () => {
  const renderWithProvider = (props: any) => {
    return render(
      <SuperAdminProvider config={mockConfig}>
        <EmailInput {...props} />
      </SuperAdminProvider>,
    );
  };

  it("renders without crashing", () => {
    renderWithProvider({});
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with label", () => {
    renderWithProvider({ label: "Email Address" });
    expect(screen.getByText("Email Address")).toBeInTheDocument();
  });

  it("renders with required indicator", () => {
    renderWithProvider({ label: "Email Address", required: true });
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders with helper text", () => {
    renderWithProvider({ helperText: "Please enter your email address" });
    expect(
      screen.getByText("Please enter your email address"),
    ).toBeInTheDocument();
  });

  it("renders with error message", () => {
    renderWithProvider({ error: "Invalid email format" });
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  it("renders with custom size", () => {
    renderWithProvider({ size: "lg" });
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("px-4", "py-3", "text-lg");
  });

  it("renders with full width", () => {
    renderWithProvider({ fullWidth: true });
    const wrapper = screen.getByRole("textbox").closest("div");
    expect(wrapper).toHaveClass("w-full");
  });

  it("renders with left icon", () => {
    renderWithProvider({ leftIcon: "📧" });
    expect(screen.getByText("📧")).toBeInTheDocument();
  });

  it("renders with right icon", () => {
    renderWithProvider({ rightIcon: "📧" });
    expect(screen.getByText("📧")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    renderWithProvider({ placeholder: "Enter your email" });
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Enter your email",
    );
  });

  it("shows email format hint when showFormatHint is true", () => {
    renderWithProvider({ showFormatHint: true });
    expect(screen.getByText(/Format: user@domain\.com/)).toBeInTheDocument();
  });

  it("shows multiple email format hint when allowMultiple is true", () => {
    renderWithProvider({ showFormatHint: true, allowMultiple: true });
    expect(
      screen.getByText(/multiple emails separated by commas/),
    ).toBeInTheDocument();
  });

  it("shows email preview when showPreview is true", () => {
    renderWithProvider({ showPreview: true, value: "test@example.com" });
    expect(screen.getByText("Preview: test@example.com")).toBeInTheDocument();
  });

  it("shows verification status when showVerificationStatus is true", () => {
    renderWithProvider({ showVerificationStatus: true, isVerified: true });
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("shows not verified status when isVerified is false", () => {
    renderWithProvider({ showVerificationStatus: true, isVerified: false });
    expect(screen.getByText("Not verified")).toBeInTheDocument();
  });

  it("shows resend verification button when showResendVerification is true and not verified", () => {
    const handleResend = jest.fn();
    renderWithProvider({
      showVerificationStatus: true,
      isVerified: false,
      showResendVerification: true,
      onResendVerification: handleResend,
    });

    const resendButton = screen.getByText("Resend verification");
    expect(resendButton).toBeInTheDocument();

    fireEvent.click(resendButton);
    expect(handleResend).toHaveBeenCalled();
  });

  it("does not show resend verification button when verified", () => {
    renderWithProvider({
      showVerificationStatus: true,
      isVerified: true,
      showResendVerification: true,
    });

    expect(screen.queryByText("Resend verification")).not.toBeInTheDocument();
  });

  it("handles input change", () => {
    const handleChange = jest.fn();
    renderWithProvider({ onChange: handleChange });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("handles input blur", () => {
    const handleBlur = jest.fn();
    renderWithProvider({ onBlur: handleBlur });

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalled();
  });

  it("handles input focus", () => {
    renderWithProvider({});

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(input).toHaveClass("border-blue-500");
  });

  it("applies error styling when error is present", () => {
    renderWithProvider({ error: "Invalid email" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "border-red-300",
      "focus:ring-red-500",
      "focus:border-red-500",
    );
  });

  it("applies focused styling when focused", () => {
    renderWithProvider({});

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(input).toHaveClass("border-blue-500");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    renderWithProvider({ ref });

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies custom className", () => {
    renderWithProvider({ className: "custom-email-input" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-email-input");
  });

  it("applies custom wrapper className", () => {
    renderWithProvider({ wrapperClassName: "custom-wrapper" });

    const wrapper = screen.getByRole("textbox").closest("div");
    expect(wrapper).toHaveClass("custom-wrapper");
  });

  it("handles disabled state", () => {
    renderWithProvider({ disabled: true });

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      "disabled:bg-gray-50",
      "disabled:text-gray-500",
      "disabled:cursor-not-allowed",
    );
  });

  it("handles value prop correctly", () => {
    renderWithProvider({ value: "test@example.com" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("test@example.com");
  });

  it("applies correct padding when left icon is present", () => {
    renderWithProvider({ leftIcon: "📧" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("pl-10");
  });

  it("applies correct padding when right icon is present", () => {
    renderWithProvider({ rightIcon: "📧" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("pr-10");
  });

  it("applies correct padding when both icons are present", () => {
    renderWithProvider({ leftIcon: "📧", rightIcon: "📧" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("pl-10", "pr-10");
  });

  it("applies correct size classes for small size", () => {
    renderWithProvider({ size: "sm" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("applies correct size classes for large size", () => {
    renderWithProvider({ size: "lg" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("px-4", "py-3", "text-lg");
  });

  it("applies correct icon size classes for small size", () => {
    renderWithProvider({ size: "sm", leftIcon: "📧" });

    const icon = screen.getByText("📧");
    expect(icon.parentElement).toHaveClass("w-4", "h-4");
  });

  it("applies correct icon size classes for large size", () => {
    renderWithProvider({ size: "lg", leftIcon: "📧" });

    const icon = screen.getByText("📧");
    expect(icon.parentElement).toHaveClass("w-6", "h-6");
  });

  it("shows domain suggestions when autoCompleteDomains is true", () => {
    renderWithProvider({
      autoCompleteDomains: true,
      commonDomains: ["gmail.com", "yahoo.com"],
    });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test@g" } });

    expect(screen.getByText("gmail.com")).toBeInTheDocument();
  });

  it("handles domain suggestion click", () => {
    const handleChange = jest.fn();
    renderWithProvider({
      autoCompleteDomains: true,
      commonDomains: ["gmail.com"],
      onChange: handleChange,
      value: "test@g",
    });

    const suggestion = screen.getByText("gmail.com");
    fireEvent.click(suggestion);

    expect(handleChange).toHaveBeenCalled();
  });

  it("shows email strength indicator when showStrengthIndicator is true", () => {
    renderWithProvider({
      showStrengthIndicator: true,
      value: "test@example.com",
    });

    expect(screen.getByText(/Weak|Medium|Strong/)).toBeInTheDocument();
  });

  it("calculates email strength correctly", () => {
    renderWithProvider({ showStrengthIndicator: true });

    const input = screen.getByRole("textbox");

    // Weak email
    fireEvent.change(input, { target: { value: "a@b.c" } });
    expect(screen.getByText("Weak")).toBeInTheDocument();

    // Medium email
    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect(screen.getByText("Medium")).toBeInTheDocument();

    // Strong email
    fireEvent.change(input, { target: { value: "Test123@Example.com" } });
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });

  it("validates email format correctly", () => {
    renderWithProvider({ showValidation: true });

    const input = screen.getByRole("textbox");

    // Invalid email
    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.blur(input);

    expect(
      screen.getByText(/Please enter a valid email address/),
    ).toBeInTheDocument();

    // Valid email
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.blur(input);

    expect(
      screen.queryByText(/Please enter a valid email address/),
    ).not.toBeInTheDocument();
  });

  it("validates multiple emails when allowMultiple is true", () => {
    renderWithProvider({ showValidation: true, allowMultiple: true });

    const input = screen.getByRole("textbox");

    // Valid multiple emails
    fireEvent.change(input, {
      target: { value: "test1@example.com, test2@example.com" },
    });
    fireEvent.blur(input);

    expect(
      screen.queryByText(/One or more email addresses are invalid/),
    ).not.toBeInTheDocument();

    // Invalid multiple emails
    fireEvent.change(input, {
      target: { value: "test1@example.com, invalid-email" },
    });
    fireEvent.blur(input);

    expect(
      screen.getByText(/One or more email addresses are invalid/),
    ).toBeInTheDocument();
  });

  it("uses custom validation function when provided", () => {
    const customValidator = jest.fn().mockReturnValue("Custom error message");
    renderWithProvider({
      showValidation: true,
      validateEmail: customValidator,
      value: "test@example.com",
    });

    expect(customValidator).toHaveBeenCalledWith("test@example.com");
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("allows international email addresses when allowInternational is true", () => {
    renderWithProvider({ showValidation: true, allowInternational: true });

    const input = screen.getByRole("textbox");

    // International email
    fireEvent.change(input, { target: { value: "test@example.co.uk" } });
    fireEvent.blur(input);

    expect(
      screen.queryByText(/Please enter a valid email address/),
    ).not.toBeInTheDocument();
  });

  it("restricts international email addresses when allowInternational is false", () => {
    renderWithProvider({ showValidation: true, allowInternational: false });

    const input = screen.getByRole("textbox");

    // International email
    fireEvent.change(input, { target: { value: "test@example.co.uk" } });
    fireEvent.blur(input);

    expect(
      screen.getByText(/Please enter a valid email address/),
    ).toBeInTheDocument();
  });

  it("hides domain suggestions on blur", () => {
    renderWithProvider({
      autoCompleteDomains: true,
      commonDomains: ["gmail.com"],
    });

    const input = screen.getByRole("textbox");

    // Show suggestions
    fireEvent.change(input, { target: { value: "test@g" } });
    expect(screen.getByText("gmail.com")).toBeInTheDocument();

    // Hide suggestions on blur
    fireEvent.blur(input);
    expect(screen.queryByText("gmail.com")).not.toBeInTheDocument();
  });

  it("maintains input value state correctly", () => {
    const { rerender } = renderWithProvider({ value: "test@example.com" });

    let input = screen.getByRole("textbox");
    expect(input).toHaveValue("test@example.com");

    rerender(
      <SuperAdminProvider config={mockConfig}>
        <EmailInput value="new@example.com" />
      </SuperAdminProvider>,
    );

    input = screen.getByRole("textbox");
    expect(input).toHaveValue("new@example.com");
  });

  it("handles empty value correctly", () => {
    renderWithProvider({ value: "" });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("handles null value correctly", () => {
    renderWithProvider({ value: null as any });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("handles undefined value correctly", () => {
    renderWithProvider({ value: undefined });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });
});
