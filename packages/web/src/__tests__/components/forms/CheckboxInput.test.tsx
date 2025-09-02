import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CheckboxInput } from "../../../components/forms/CheckboxInput";

describe("CheckboxInput", () => {
  it("renders unchecked by default", () => {
    const handleChange = jest.fn();
    render(<CheckboxInput checked={false} onChange={handleChange} />);
    const input = screen.getByTestId("boolean-input");
    expect(input).toBeInTheDocument();
    expect(input).not.toBeChecked();
  });

  it("renders checked when prop set", () => {
    const handleChange = jest.fn();
    render(<CheckboxInput checked onChange={handleChange} />);
    const input = screen.getByTestId("boolean-input");
    expect(input).toBeChecked();
  });

  it("calls onChange when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<CheckboxInput checked={false} onChange={handleChange} />);
    const input = screen.getByTestId("boolean-input");
    await user.click(input);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("respects disabled state", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<CheckboxInput checked={false} disabled onChange={handleChange} />);
    const input = screen.getByTestId("boolean-input");
    await user.click(input);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("renders label and associates via htmlFor", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <CheckboxInput
        label="Accept terms"
        checked={false}
        onChange={handleChange}
      />,
    );
    const label = screen.getByText("Accept terms");
    expect(label.tagName.toLowerCase()).toBe("label");
    await user.click(label);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("shows helperText and error message", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <CheckboxInput
        label="Accept"
        helperText="Required to proceed"
        checked={false}
        onChange={handleChange}
      />,
    );
    expect(screen.getByText("Required to proceed")).toBeInTheDocument();

    rerender(
      <CheckboxInput
        label="Accept"
        error="This field is required"
        checked={false}
        onChange={handleChange}
      />,
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("supports size variants", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <CheckboxInput size="sm" checked={false} onChange={handleChange} />,
    );
    const input = screen.getByTestId("boolean-input");
    expect(input).toHaveClass("h-3", "w-3");

    rerender(
      <CheckboxInput size="md" checked={false} onChange={handleChange} />,
    );
    expect(input).toHaveClass("h-4", "w-4");

    rerender(
      <CheckboxInput size="lg" checked={false} onChange={handleChange} />,
    );
    expect(input).toHaveClass("h-5", "w-5");
  });

  it("applies error styling when error present", () => {
    const handleChange = jest.fn();
    render(
      <CheckboxInput error="Invalid" checked={false} onChange={handleChange} />,
    );
    const input = screen.getByTestId("boolean-input");
    expect(input).toHaveClass("focus:ring-red-500");
  });

  it("applies color scheme classes", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <CheckboxInput
        colorScheme="secondary"
        checked={false}
        onChange={handleChange}
      />,
    );
    const input = screen.getByTestId("boolean-input");
    expect(input).toHaveClass("text-gray-600");

    rerender(
      <CheckboxInput
        colorScheme="success"
        checked={false}
        onChange={handleChange}
      />,
    );
    expect(input).toHaveClass("text-green-600");

    rerender(
      <CheckboxInput
        colorScheme="warning"
        checked={false}
        onChange={handleChange}
      />,
    );
    expect(input).toHaveClass("text-yellow-600");

    rerender(
      <CheckboxInput
        colorScheme="danger"
        checked={false}
        onChange={handleChange}
      />,
    );
    expect(input).toHaveClass("text-red-600");

    rerender(
      <CheckboxInput
        colorScheme="primary"
        checked={false}
        onChange={handleChange}
      />,
    );
    expect(input).toHaveClass("text-primary-600");
  });

  it("supports label on left and right", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <CheckboxInput
        label="Agree"
        labelPosition="left"
        checked={false}
        onChange={handleChange}
      />,
    );
    const labelLeft = screen.getByText("Agree");
    expect(labelLeft).toBeInTheDocument();

    rerender(
      <CheckboxInput
        label="Agree"
        labelPosition="right"
        checked={false}
        onChange={handleChange}
      />,
    );
    const labelRight = screen.getByText("Agree");
    expect(labelRight).toBeInTheDocument();
  });

  it("forwards standard input attributes and ARIA", () => {
    const handleChange = jest.fn();
    render(
      <CheckboxInput
        checked={false}
        onChange={handleChange}
        name="tos"
        id="tos"
        required
        aria-label="Accept terms"
      />,
    );
    const input = screen.getByTestId("boolean-input");
    expect(input).toHaveAttribute("name", "tos");
    expect(input).toHaveAttribute("id", "tos");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-label", "Accept terms");
  });
});
