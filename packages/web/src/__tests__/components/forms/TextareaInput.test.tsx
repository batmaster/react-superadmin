import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { TextareaInput } from "../../../components/forms/TextareaInput";

describe("TextareaInput", () => {
  it("renders with default props", () => {
    render(<TextareaInput />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass(
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
    expect(textarea).toHaveAttribute("rows", "4");
  });

  it("renders with custom className", () => {
    render(<TextareaInput className="custom-class" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("renders with error styling when error prop is provided", () => {
    render(<TextareaInput error="This field is required" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "border-red-300",
      "focus:ring-red-500",
      "focus:border-red-500",
    );
  });

  it("renders with placeholder", () => {
    render(<TextareaInput placeholder="Enter your message..." />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("placeholder", "Enter your message...");
  });

  it("renders with value", () => {
    render(<TextareaInput value="Hello World" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Hello World");
  });

  it("renders as disabled", () => {
    render(<TextareaInput disabled />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });

  it("renders as required", () => {
    render(<TextareaInput required />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeRequired();
  });

  it("renders with name attribute", () => {
    render(<TextareaInput name="message" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("name", "message");
  });

  it("renders with id attribute", () => {
    render(<TextareaInput id="message-textarea" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("id", "message-textarea");
  });

  it("handles onChange events", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<TextareaInput onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello");

    expect(handleChange).toHaveBeenCalledTimes(5); // One for each character
  });

  it("handles onBlur events", async () => {
    const user = userEvent.setup();
    const handleBlur = jest.fn();

    render(<TextareaInput onBlur={handleBlur} />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);
    await user.tab();

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("handles onFocus events", async () => {
    const user = userEvent.setup();
    const handleFocus = jest.fn();

    render(<TextareaInput onFocus={handleFocus} />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("handles onKeyDown events", async () => {
    const user = userEvent.setup();
    const handleKeyDown = jest.fn();

    render(<TextareaInput onKeyDown={handleKeyDown} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "a");

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it("handles onKeyUp events", async () => {
    const user = userEvent.setup();
    const handleKeyUp = jest.fn();

    render(<TextareaInput onKeyUp={handleKeyUp} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "a");

    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it("handles onKeyPress events", async () => {
    const user = userEvent.setup();
    const handleKeyPress = jest.fn();

    render(<TextareaInput onKeyPress={handleKeyPress} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "a");

    expect(handleKeyPress).toHaveBeenCalledTimes(1);
  });

  it("handles controlled input value changes", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<TextareaInput value="Hello" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    await user.clear(textarea);
    await user.type(textarea, "World");

    expect(handleChange).toHaveBeenCalled();
  });

  it("handles uncontrolled input value changes", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<TextareaInput defaultValue="Hello" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    await user.clear(textarea);
    await user.type(textarea, "World");

    expect(handleChange).toHaveBeenCalled();
  });

  it("renders with rows attribute", () => {
    render(<TextareaInput rows={6} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "6");
  });

  it("renders with cols attribute", () => {
    render(<TextareaInput cols={50} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("cols", "50");
  });

  it("renders with maxLength attribute", () => {
    render(<TextareaInput maxLength={100} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("maxLength", "100");
  });

  it("renders with minLength attribute", () => {
    render(<TextareaInput minLength={10} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("minLength", "10");
  });

  it("renders with autoComplete attribute", () => {
    render(<TextareaInput autoComplete="off" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("autoComplete", "off");
  });

  // Note: Avoid autoFocus to comply with a11y linting rules

  it("renders with readOnly attribute", () => {
    render(<TextareaInput readOnly />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("readOnly");
  });

  it("renders with tabIndex attribute", () => {
    render(<TextareaInput tabIndex={0} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("tabIndex", "0");
  });

  it("renders with title attribute", () => {
    render(<TextareaInput title="Enter your message" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("title", "Enter your message");
  });

  it("renders with aria-label attribute", () => {
    render(<TextareaInput aria-label="Message textarea" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-label", "Message textarea");
  });

  it("renders with aria-describedby attribute", () => {
    render(<TextareaInput aria-describedby="message-help" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-describedby", "message-help");
  });

  it("renders with data attributes", () => {
    render(
      <TextareaInput data-testid="message-textarea" data-custom="value" />,
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("data-testid", "message-textarea");
    expect(textarea).toHaveAttribute("data-custom", "value");
  });

  it("combines error styling with custom className", () => {
    render(<TextareaInput className="custom-class" error="Error message" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass(
      "custom-class",
      "border-red-300",
      "focus:ring-red-500",
      "focus:border-red-500",
    );
  });

  it("handles multiple event handlers", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <TextareaInput
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />,
    );

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);
    await user.type(textarea, "a");
    await user.tab();

    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("forwards all HTML textarea attributes", () => {
    render(<TextareaInput wrap="soft" spellCheck={false} dir="rtl" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("wrap", "soft");
    expect(textarea).toHaveAttribute("spellCheck", "false");
    expect(textarea).toHaveAttribute("dir", "rtl");
  });

  it("handles form integration", () => {
    const { container } = render(
      <form>
        <TextareaInput name="message" />
      </form>,
    );

    const form = container.querySelector("form")!;
    const textarea = screen.getByRole("textbox");

    expect(form).toContainElement(textarea);
    expect(textarea).toHaveAttribute("name", "message");
  });

  it("maintains focus behavior", async () => {
    const user = userEvent.setup();
    render(<TextareaInput />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);
    expect(textarea).toHaveFocus();

    await user.tab();
    expect(textarea).not.toHaveFocus();
  });

  it("handles keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<TextareaInput />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);
    await user.type(textarea, "Hello");
    await user.clear(textarea);
    await user.type(textarea, "World");

    expect(textarea).toHaveValue("World");
  });

  it("handles multiline text input", async () => {
    const user = userEvent.setup();
    render(<TextareaInput />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Line 1{enter}Line 2{enter}Line 3");

    expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
  });

  it("handles paste events", async () => {
    const user = userEvent.setup();
    const handlePaste = jest.fn();
    render(<TextareaInput onPaste={handlePaste} />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);

    fireEvent.paste(textarea, {
      clipboardData: {
        getData: () => "Pasted text",
      },
    } as unknown as ClipboardEvent);

    expect(handlePaste).toHaveBeenCalled();
  });

  it("handles resize behavior", () => {
    render(<TextareaInput style={{ resize: "vertical" }} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveStyle("resize: vertical");
  });
});
