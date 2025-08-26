import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { TextInput } from "../../../components/forms/TextInput";

describe("TextInput", () => {
  it("renders with default props", () => {
    render(<TextInput />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass(
      "block",
      "w-full",
      "px-3",
      "py-2",
      "border",
      "border-gray-300",
      "rounded-md",
      "shadow-sm",
      "placeholder-gray-400",
      "focus:outline-none",
      "focus:ring-primary-500",
      "focus:border-primary-500",
      "sm:text-sm",
    );
  });

  it("renders with custom className", () => {
    render(<TextInput className="custom-class" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });

  it("renders with error styling when error prop is provided", () => {
    render(<TextInput error="This field is required" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "border-red-300",
      "focus:ring-red-500",
      "focus:border-red-500",
    );
  });

  it("renders with placeholder", () => {
    render(<TextInput placeholder="Enter your name" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Enter your name");
  });

  it("renders with value", () => {
    render(<TextInput value="John Doe" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("John Doe");
  });

  it("renders as disabled", () => {
    render(<TextInput disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("renders as required", () => {
    render(<TextInput required />);

    const input = screen.getByRole("textbox");
    expect(input).toBeRequired();
  });

  it("renders with type attribute", () => {
    render(<TextInput type="email" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
  });

  it("renders with name attribute", () => {
    render(<TextInput name="username" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", "username");
  });

  it("renders with id attribute", () => {
    render(<TextInput id="user-input" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "user-input");
  });

  it("handles onChange events", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<TextInput onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    expect(handleChange).toHaveBeenCalledTimes(5); // One for each character
  });

  it("handles onBlur events", async () => {
    const user = userEvent.setup();
    const handleBlur = jest.fn();

    render(<TextInput onBlur={handleBlur} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.tab();

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("handles onFocus events", async () => {
    const user = userEvent.setup();
    const handleFocus = jest.fn();

    render(<TextInput onFocus={handleFocus} />);

    const input = screen.getByRole("textbox");
    await user.click(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("handles onKeyDown events", async () => {
    const user = userEvent.setup();
    const handleKeyDown = jest.fn();

    render(<TextInput onKeyDown={handleKeyDown} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "a");

    expect(handleKeyDown).toHaveBeenCalled();
  });

  it("handles onKeyUp events", async () => {
    const user = userEvent.setup();
    const handleKeyUp = jest.fn();

    render(<TextInput onKeyUp={handleKeyUp} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "a");

    expect(handleKeyUp).toHaveBeenCalled();
  });

  it("handles onKeyPress events", async () => {
    const user = userEvent.setup();
    const handleKeyPress = jest.fn();

    render(<TextInput onKeyPress={handleKeyPress} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "a");

    expect(handleKeyPress).toHaveBeenCalled();
  });

  it("handles controlled input value changes", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<TextInput value="initial" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("initial");

    await user.clear(input);
    await user.type(input, "new value");

    expect(handleChange).toHaveBeenCalled();
  });

  it("handles uncontrolled input value changes", async () => {
    const user = userEvent.setup();

    render(<TextInput defaultValue="default" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("default");

    await user.clear(input);
    await user.type(input, "new value");

    expect(input).toHaveValue("new value");
  });

  it("renders with maxLength attribute", () => {
    render(<TextInput maxLength={10} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("renders with minLength attribute", () => {
    render(<TextInput minLength={3} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("minLength", "3");
  });

  it("renders with pattern attribute", () => {
    render(<TextInput pattern="[0-9]+" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("pattern", "[0-9]+");
  });

  it("renders with autoComplete attribute", () => {
    render(<TextInput autoComplete="email" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("autoComplete", "email");
  });

  // Note: Avoid autoFocus to comply with a11y linting rules

  it("renders with readOnly attribute", () => {
    render(<TextInput readOnly />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readOnly");
  });

  it("renders with tabIndex attribute", () => {
    render(<TextInput tabIndex={0} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("tabIndex", "0");
  });

  it("renders with title attribute", () => {
    render(<TextInput title="Enter your name" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("title", "Enter your name");
  });

  it("renders with aria-label attribute", () => {
    render(<TextInput aria-label="Username input" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-label", "Username input");
  });

  it("renders with aria-describedby attribute", () => {
    render(<TextInput aria-describedby="help-text" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "help-text");
  });

  it("renders with data attributes", () => {
    render(<TextInput data-testid="username-input" />);

    const input = screen.getByTestId("username-input");
    expect(input).toBeInTheDocument();
  });

  it("combines error styling with custom className", () => {
    render(<TextInput error="Error message" className="custom-class" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "custom-class",
      "border-red-300",
      "focus:ring-red-500",
      "focus:border-red-500",
    );
  });

  it("handles multiple event handlers", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const handleBlur = jest.fn();
    const handleFocus = jest.fn();

    render(
      <TextInput
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />,
    );

    const input = screen.getByRole("textbox");

    // Test focus
    await user.click(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    // Test change
    await user.type(input, "test");
    expect(handleChange).toHaveBeenCalled();

    // Test blur
    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("forwards all HTML input attributes", () => {
    render(
      <TextInput
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        inputMode="numeric"
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("spellCheck", "false");
    expect(input).toHaveAttribute("autoCorrect", "off");
    expect(input).toHaveAttribute("autoCapitalize", "off");
    expect(input).toHaveAttribute("inputMode", "numeric");
  });

  it("handles form integration", () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());

    const { container } = render(
      <form onSubmit={handleSubmit}>
        <TextInput name="username" required />
        <button type="submit">Submit</button>
      </form>,
    );

    const input = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button");

    expect(input).toHaveAttribute("name", "username");
    expect(input).toBeRequired();

    fireEvent.submit(container.querySelector("form")!);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("maintains focus behavior", async () => {
    const user = userEvent.setup();

    render(<TextInput />);

    const input = screen.getByRole("textbox");

    await user.click(input);
    expect(input).toHaveFocus();

    await user.tab();
    expect(input).not.toHaveFocus();
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<TextInput />);

    const input = screen.getByRole("textbox");

    // Tab to focus
    await user.tab();
    expect(input).toHaveFocus();

    // Type some text
    await user.type(input, "Hello");
    expect(input).toHaveValue("Hello");

    // Select all and replace
    await user.keyboard("{Control>}a{/Control}");
    await user.clear(input);
    await user.type(input, "World");
    expect(input).toHaveValue("World");
  });
});
