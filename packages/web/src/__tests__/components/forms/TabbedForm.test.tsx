import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  TabbedForm,
  Tab,
  TabField,
} from "../../../components/forms/TabbedForm";

// Mock data for testing
const mockTabs: Tab[] = [
  {
    id: "basic",
    label: "Basic Info",
    description: "Basic information about the item",
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        placeholder: "Enter name",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email",
      },
    ],
  },
  {
    id: "details",
    label: "Details",
    description: "Additional details",
    fields: [
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter description",
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "tech", label: "Technology" },
          { value: "design", label: "Design" },
        ],
      },
    ],
  },
];

const mockInitialValues = {
  name: "John Doe",
  email: "john@example.com",
  description: "Test description",
  category: "tech",
};

describe("TabbedForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all tabs with correct labels and descriptions", () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
      />,
    );

    expect(screen.getByText("Basic Info")).toBeInTheDocument();
    expect(
      screen.getByText("Basic information about the item"),
    ).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Additional details")).toBeInTheDocument();
  });

  it("shows the first tab as active by default", () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
      />,
    );

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(
      screen.queryByDisplayValue("Test description"),
    ).not.toBeInTheDocument();
  });

  it("allows switching between tabs", async () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
      />,
    );

    // Click on Details tab
    fireEvent.click(screen.getByText("Details"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
      expect(screen.getByDisplayValue("tech")).toBeInTheDocument();
    });

    // Click on Basic Info tab
    fireEvent.click(screen.getByText("Basic Info"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });
  });

  it("renders form fields correctly", () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
      />,
    );

    expect(screen.getByLabelText("Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email *")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("handles field changes and updates values", async () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
      />,
    );

    const nameInput = screen.getByLabelText("Name *");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");

    expect(nameInput).toHaveValue("Jane Doe");
  });

  it("shows validation errors for required fields", async () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnChange={true}
      />,
    );

    const nameInput = screen.getByLabelText("Name *");
    await userEvent.clear(nameInput);
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("calls onSubmit with form values when submitted", async () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(mockInitialValues);
  });

  it("calls onCancel when cancel button is clicked", async () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("shows progress indicator", () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
        showProgress={true}
      />,
    );

    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("handles tab navigation with next/previous buttons", async () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
        showNavigation={true}
      />,
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
    });

    const previousButton = screen.getByRole("button", { name: /previous/i });
    await userEvent.click(previousButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });
  });

  it("prevents navigation to next tab if current tab has validation errors", async () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        showNavigation={true}
        validateOnChange={true}
      />,
    );

    const nameInput = screen.getByLabelText("Name *");
    await userEvent.clear(nameInput);
    fireEvent.blur(nameInput);

    const nextButton = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextButton);

    // Should still be on first tab due to validation error
    expect(screen.getByLabelText("Name *")).toBeInTheDocument();
  });

  it("handles form submission with validation errors", async () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnSubmit={true}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    // Should show validation errors and not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("handles loading state", () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
        loading={true}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    expect(submitButton).toBeDisabled();
  });

  it("handles form title and description", () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
        title="User Registration Form"
        description="Please fill out all required fields to complete your registration"
      />,
    );

    expect(screen.getByText("User Registration Form")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please fill out all required fields to complete your registration",
      ),
    ).toBeInTheDocument();
  });

  it("handles custom submit and cancel button text", () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={mockInitialValues}
        submitButtonText="Create User"
        cancelButtonText="Go Back"
      />,
    );

    expect(
      screen.getByRole("button", { name: /create user/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("handles different field types", () => {
    const tabsWithDifferentTypes: Tab[] = [
      {
        id: "basic",
        label: "Basic Info",
        fields: [
          { name: "text", label: "Text", type: "text" },
          { name: "number", label: "Number", type: "number" },
          { name: "boolean", label: "Boolean", type: "boolean" },
          { name: "date", label: "Date", type: "date" },
          { name: "time", label: "Time", type: "time" },
        ],
      },
    ];

    render(
      <TabbedForm
        tabs={tabsWithDifferentTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    expect(screen.getByLabelText("Text")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Number")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Boolean")).toHaveAttribute(
      "type",
      "checkbox",
    );
    expect(screen.getByLabelText("Date")).toHaveAttribute("type", "date");
    expect(screen.getByLabelText("Time")).toHaveAttribute("type", "time");
  });

  it("handles field helper text", () => {
    const tabsWithHelperText: Tab[] = [
      {
        id: "basic",
        label: "Basic Info",
        fields: [
          {
            name: "username",
            label: "Username",
            type: "text",
            helperText:
              "Username must be unique and at least 3 characters long",
          },
        ],
      },
    ];

    render(
      <TabbedForm
        tabs={tabsWithHelperText}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    expect(
      screen.getByText(
        "Username must be unique and at least 3 characters long",
      ),
    ).toBeInTheDocument();
  });

  it("handles field-level disabled state", () => {
    const tabsWithDisabledField: Tab[] = [
      {
        id: "basic",
        label: "Basic Info",
        fields: [
          {
            name: "readonly",
            label: "Read Only Field",
            type: "text",
            disabled: true,
          },
        ],
      },
    ];

    render(
      <TabbedForm
        tabs={tabsWithDisabledField}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{ readonly: "Cannot edit this" }}
      />,
    );

    const readonlyInput = screen.getByLabelText("Read Only Field");
    expect(readonlyInput).toBeDisabled();
    expect(readonlyInput).toHaveValue("Cannot edit this");
  });

  it("handles form validation modes", () => {
    render(
      <TabbedForm
        tabs={mockTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnSubmit={true}
      />,
    );

    // All validation modes should be enabled
    const nameInput = screen.getByLabelText("Name *");

    // Change should trigger validation
    fireEvent.change(nameInput, { target: { value: "" } });
    expect(screen.getByText("Name is required")).toBeInTheDocument();

    // Blur should trigger validation
    fireEvent.blur(nameInput);
    expect(screen.getByText("Name is required")).toBeInTheDocument();

    // Submit should trigger validation
    const submitButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(submitButton);
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("handles complex form scenarios", async () => {
    const complexTabs: Tab[] = [
      {
        id: "personal",
        label: "Personal Info",
        fields: [
          {
            name: "firstName",
            label: "First Name",
            type: "text",
            required: true,
          },
          {
            name: "lastName",
            label: "Last Name",
            type: "text",
            required: true,
          },
          { name: "email", label: "Email", type: "email", required: true },
        ],
      },
      {
        id: "address",
        label: "Address",
        fields: [
          { name: "street", label: "Street", type: "text", required: true },
          { name: "city", label: "City", type: "text", required: true },
          { name: "zipCode", label: "ZIP Code", type: "text", required: true },
        ],
      },
    ];

    const complexInitialValues = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      street: "123 Main St",
      city: "Anytown",
      zipCode: "12345",
    };

    render(
      <TabbedForm
        tabs={complexTabs}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={complexInitialValues}
        showNavigation={true}
        showProgress={true}
      />,
    );

    // Verify first tab content
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();

    // Navigate to second tab
    const addressTab = screen.getByText("Address");
    await userEvent.click(addressTab);

    await waitFor(() => {
      expect(screen.getByDisplayValue("123 Main St")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Anytown")).toBeInTheDocument();
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(complexInitialValues);
  });
});
