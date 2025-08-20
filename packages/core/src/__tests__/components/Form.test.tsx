import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Form } from "../../components/Form";

describe("Form Component", () => {
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <Form>
        <input type="text" name="test" />
      </Form>,
    );

    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    render(
      <Form>
        <input type="text" name="test" data-testid="test-input" />
        <button type="submit">Submit</button>
      </Form>,
    );

    expect(screen.getByTestId("test-input")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    render(
      <Form onSubmit={mockOnSubmit}>
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.submit(screen.getByRole("form"));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onReset when form is reset", () => {
    render(
      <Form onReset={mockOnReset}>
        <button type="reset">Reset</button>
      </Form>,
    );

    fireEvent.reset(screen.getByRole("form"));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it("applies custom className to form container", () => {
    render(
      <Form className="custom-form">
        <input type="text" name="test" />
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).toHaveClass("custom-form");
  });

  it("applies custom className to form fields", () => {
    render(
      <Form fieldClassName="custom-fields">
        <input type="text" name="test" />
      </Form>,
    );

    const fieldsElement = screen
      .getByRole("form")
      .querySelector(".rs-form__fields");
    expect(fieldsElement).toHaveClass("custom-fields");
  });

  it("applies custom className to form actions", () => {
    render(
      <Form actionsClassName="custom-actions">
        <input type="text" name="test" />
      </Form>,
    );

    const actionsElement = screen
      .getByRole("form")
      .querySelector(".rs-form__actions");
    expect(actionsElement).toHaveClass("custom-actions");
  });

  it("applies loading class when loading is true", () => {
    render(
      <Form loading={true}>
        <input type="text" name="test" />
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).toHaveClass("rs-form--loading");
  });

  it("applies disabled class when disabled is true", () => {
    render(
      <Form disabled={true}>
        <input type="text" name="test" />
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).toHaveClass("rs-form--disabled");
  });

  it("shows loading indicator when loading is true", () => {
    render(
      <Form loading={true}>
        <input type="text" name="test" />
      </Form>,
    );

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("does not show loading indicator when loading is false", () => {
    render(
      <Form loading={false}>
        <input type="text" name="test" />
      </Form>,
    );

    expect(screen.queryByText("Processing...")).not.toBeInTheDocument();
  });

  it("prevents form submission when disabled", () => {
    render(
      <Form onSubmit={mockOnSubmit} disabled={true}>
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.submit(screen.getByRole("form"));
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("prevents form submission when loading", () => {
    render(
      <Form onSubmit={mockOnSubmit} loading={true}>
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.submit(screen.getByRole("form"));
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("prevents form reset when disabled", () => {
    render(
      <Form onReset={mockOnReset} disabled={true}>
        <button type="reset">Reset</button>
      </Form>,
    );

    fireEvent.reset(screen.getByRole("form"));
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it("prevents form reset when loading", () => {
    render(
      <Form onReset={mockOnReset} loading={true}>
        <button type="reset">Reset</button>
      </Form>,
    );

    fireEvent.reset(screen.getByRole("form"));
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it("sets correct form method", () => {
    render(
      <Form method="PUT">
        <input type="text" name="test" />
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).toHaveAttribute("method", "PUT");
  });

  it("sets correct form action", () => {
    render(
      <Form action="/api/submit">
        <input type="text" name="test" />
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).toHaveAttribute("action", "/api/submit");
  });

  it("sets correct form encoding type", () => {
    render(
      <Form encType="multipart/form-data">
        <input type="text" name="test" />
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).toHaveAttribute("enctype", "multipart/form-data");
  });

  it("sets noValidate when validateOn is never", () => {
    render(
      <Form validateOn="never">
        <input type="text" name="test" />
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).toHaveAttribute("novalidate");
  });

  it("does not set noValidate when validateOn is not never", () => {
    render(
      <Form validateOn="submit">
        <input type="text" name="test" />
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).not.toHaveAttribute("novalidate");
  });

  it("has correct CSS class structure", () => {
    render(
      <Form className="custom-form">
        <input type="text" name="test" />
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).toHaveClass("rs-form");
    expect(formElement).toHaveClass("custom-form");

    expect(formElement.querySelector(".rs-form__fields")).toBeInTheDocument();
    expect(formElement.querySelector(".rs-form__actions")).toBeInTheDocument();
  });

  it("renders with all props correctly", () => {
    render(
      <Form
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        method="PATCH"
        action="/api/update"
        encType="application/json"
        disabled={false}
        loading={false}
        validateOn="blur"
        showErrors={true}
        className="custom-form"
        fieldClassName="custom-fields"
        actionsClassName="custom-actions"
      >
        <input type="text" name="test" />
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </Form>,
    );

    const formElement = screen.getByRole("form");
    expect(formElement).toHaveAttribute("method", "PATCH");
    expect(formElement).toHaveAttribute("action", "/api/update");
    expect(formElement).toHaveAttribute("enctype", "application/json");
    expect(formElement).toHaveClass("custom-form");

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });
});
