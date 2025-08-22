import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { FormField, SimpleForm } from "../../../components/forms/SimpleForm";

// Helper function to find form fields reliably
const getFieldByLabel = (labelText: string) => {
  // Find all elements with the text, then find the first label element
  const elements = screen.getAllByText(labelText);
  const label = elements.find((el) => el.tagName === "LABEL");
  if (!label) return null;

  // Find the parent div that contains both label and input
  const fieldContainer = label.closest("div");
  if (!fieldContainer) return null;

  // Look for input/select/textarea in the same container or in the next sibling
  let input = fieldContainer.querySelector("input, select, textarea");
  if (!input) {
    // If not found in the same container, look in the next sibling
    const nextSibling = fieldContainer.nextElementSibling;
    if (nextSibling) {
      input = nextSibling.querySelector("input, select, textarea");
    }
  }

  return input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
};

// Mock data for testing
const mockFields: FormField[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "Enter your full name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "Enter your email",
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    validation: {
      min: 18,
      max: 100,
    },
    helperText: "Must be between 18 and 100 years old",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: [
      { value: "admin", label: "Administrator" },
      { value: "user", label: "Regular User" },
      { value: "moderator", label: "Moderator" },
    ],
  },
  {
    name: "newsletter",
    label: "Subscribe to Newsletter",
    type: "checkbox",
    defaultValue: false,
  },
];

describe("SimpleForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields with correct labels and types", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    // Check if all fields are rendered using the helper function
    expect(getFieldByLabel("Full Name")).toBeInTheDocument();
    expect(getFieldByLabel("Email Address")).toBeInTheDocument();
    expect(getFieldByLabel("Age")).toBeInTheDocument();
    expect(getFieldByLabel("Role")).toBeInTheDocument();
    expect(getFieldByLabel("Subscribe to Newsletter")).toBeInTheDocument();
  });

  it("displays initial values correctly", () => {
    const initialValues = {
      name: "John Doe",
      email: "john@example.com",
      age: 25,
      role: "user",
      newsletter: true,
    };

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={initialValues}
      />,
    );

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
    expect(screen.getByDisplayValue("user")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("handles field changes and updates values", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    const nameLabel = screen.getByText("Full Name");
    const nameInput = nameLabel.nextElementSibling?.querySelector("input");
    expect(nameInput).toBeInTheDocument();

    if (nameInput) {
      await userEvent.type(nameInput, "Jane Doe");
      expect(nameInput).toHaveValue("Jane Doe");
    }
  });

  it("shows validation errors for required fields on blur", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnBlur={true}
      />,
    );

    const nameInput = screen.getByLabelText("Full Name *");
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText("Full Name is required")).toBeInTheDocument();
    });
  });

  it("validates min/max values for number fields", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnBlur={true}
      />,
    );

    const ageInput = screen.getByLabelText("Age");
    await userEvent.type(ageInput, "16");
    fireEvent.blur(ageInput);

    await waitFor(() => {
      expect(screen.getByText("Age must be at least 18")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnBlur={true}
      />,
    );

    const emailInput = screen.getByLabelText("Email Address *");
    await userEvent.type(emailInput, "invalid-email");
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(
        screen.getByText("Email Address must be a valid email address"),
      ).toBeInTheDocument();
    });
  });

  it("calls onSubmit with form values when submitted", async () => {
    const initialValues = {
      name: "John Doe",
      email: "john@example.com",
      age: 25,
      role: "user",
      newsletter: false,
    };

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={initialValues}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(initialValues);
  });

  it("calls onCancel when cancel button is clicked", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("shows form title when provided", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        title="User Registration Form"
      />,
    );

    expect(screen.getByText("User Registration Form")).toBeInTheDocument();
  });

  it("customizes submit and cancel button text", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        submitText="Create User"
        cancelText="Go Back"
      />,
    );

    expect(
      screen.getByRole("button", { name: /create user/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("handles loading state", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        loading={true}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("handles form reset", async () => {
    const initialValues = {
      name: "John Doe",
      email: "john@example.com",
      age: 25,
      role: "user",
      newsletter: false,
    };

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={initialValues}
      />,
    );

    const nameInput = screen.getByLabelText("Full Name *");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Modified Name");

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await userEvent.click(resetButton);

    expect(nameInput).toHaveValue("John Doe");
  });

  it("resets form after successful submission when resetOnSubmit is true", async () => {
    const initialValues = {
      name: "John Doe",
      email: "john@example.com",
      age: 25,
      role: "user",
      newsletter: false,
    };

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={initialValues}
        resetOnSubmit={true}
      />,
    );

    const nameInput = screen.getByLabelText("Full Name *");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Modified Name");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    expect(nameInput).toHaveValue("John Doe");
  });

  it("handles different field types correctly", () => {
    const fieldsWithAllTypes: FormField[] = [
      { name: "text", label: "Text", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Password", type: "password" },
      { name: "number", label: "Number", type: "number" },
      { name: "textarea", label: "Textarea", type: "textarea" },
      {
        name: "select",
        label: "Select",
        type: "select",
        options: [{ value: "option1", label: "Option 1" }],
      },
      { name: "checkbox", label: "Checkbox", type: "checkbox" },
      {
        name: "radio",
        label: "Radio",
        type: "radio",
        options: [{ value: "radio1", label: "Radio 1" }],
      },
      { name: "date", label: "Date", type: "date" },
      { name: "boolean", label: "Boolean", type: "boolean" },
      { name: "array", label: "Array", type: "array" },
      {
        name: "autocomplete",
        label: "Autocomplete",
        type: "autocomplete",
        options: [{ value: "auto1", label: "Auto 1" }],
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithAllTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    expect(screen.getByLabelText("Text")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByLabelText("Number")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Textarea")).toBeInTheDocument();
    expect(screen.getByLabelText("Select")).toBeInTheDocument();
    expect(screen.getByLabelText("Checkbox")).toHaveAttribute(
      "type",
      "checkbox",
    );
    expect(screen.getByLabelText("Radio")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toHaveAttribute("type", "date");
    expect(screen.getByLabelText("Boolean")).toBeInTheDocument();
    expect(screen.getByLabelText("Array")).toBeInTheDocument();
    expect(screen.getByLabelText("Autocomplete")).toBeInTheDocument();
  });

  it("handles select field options correctly", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{ role: "admin" }}
      />,
    );

    const selectField = screen.getByLabelText("Role *");
    expect(selectField).toHaveValue("admin");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4); // Including the default "Select Role" option
    expect(options[1]).toHaveValue("admin");
    expect(options[1]).toHaveTextContent("Administrator");
  });

  it("handles checkbox field correctly", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{ newsletter: true }}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("handles radio field options correctly", () => {
    const fieldsWithRadio: FormField[] = [
      {
        name: "gender",
        label: "Gender",
        type: "radio",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithRadio}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{ gender: "male" }}
      />,
    );

    const maleRadio = screen.getByLabelText("Male");
    const femaleRadio = screen.getByLabelText("Female");
    const otherRadio = screen.getByLabelText("Other");

    expect(maleRadio).toBeChecked();
    expect(femaleRadio).not.toBeChecked();
    expect(otherRadio).not.toBeChecked();
  });

  it("handles textarea field correctly", () => {
    const fieldsWithTextarea: FormField[] = [
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter description",
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithTextarea}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{ description: "Test description" }}
      />,
    );

    const textarea = screen.getByLabelText("Description");
    expect(textarea).toHaveValue("Test description");
    expect(textarea).toHaveAttribute("placeholder", "Enter description");
  });

  it("handles boolean field correctly", () => {
    const fieldsWithBoolean: FormField[] = [
      {
        name: "active",
        label: "Active Status",
        type: "boolean",
        defaultValue: true,
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithBoolean}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{ active: false }}
      />,
    );

    const booleanSelect = screen.getByLabelText("Active Status");
    expect(booleanSelect).toHaveValue("false");
  });

  it("handles array field correctly", async () => {
    const fieldsWithArray: FormField[] = [
      {
        name: "tags",
        label: "Tags",
        type: "array",
        placeholder: "Add tag",
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithArray}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{ tags: ["tag1", "tag2"] }}
      />,
    );

    expect(screen.getByDisplayValue("tag1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("tag2")).toBeInTheDocument();

    const addButton = screen.getByText("Add Item");
    await userEvent.click(addButton);

    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  it("handles autocomplete field correctly", () => {
    const fieldsWithAutocomplete: FormField[] = [
      {
        name: "country",
        label: "Country",
        type: "autocomplete",
        placeholder: "Search for a country",
        options: [
          { value: "us", label: "United States" },
          { value: "ca", label: "Canada" },
          { value: "uk", label: "United Kingdom" },
        ],
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithAutocomplete}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    const autocompleteInput = screen.getByPlaceholderText(
      "Search for a country",
    );
    expect(autocompleteInput).toBeInTheDocument();
  });

  it("handles field helper text", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    expect(
      screen.getByText("Must be between 18 and 100 years old"),
    ).toBeInTheDocument();
  });

  it("handles field-level disabled state", () => {
    const fieldsWithDisabled: FormField[] = [
      {
        name: "readonly",
        label: "Read Only Field",
        type: "text",
        disabled: true,
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithDisabled}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{ readonly: "Cannot edit this" }}
      />,
    );

    const readonlyInput = screen.getByLabelText("Read Only Field");
    expect(readonlyInput).toBeDisabled();
    expect(readonlyInput).toHaveValue("Cannot edit this");
  });

  it("handles field-level custom styling", () => {
    const fieldsWithCustomStyling: FormField[] = [
      {
        name: "custom",
        label: "Custom Field",
        type: "text",
        className: "custom-field-class",
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithCustomStyling}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    const customField = screen.getByLabelText("Custom Field");
    expect(customField).toHaveClass("custom-field-class");
  });

  it("handles form validation modes", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnChange={true}
        validateOnBlur={true}
      />,
    );

    const nameInput = screen.getByLabelText("Full Name *");

    // Change should trigger validation
    fireEvent.change(nameInput, { target: { value: "" } });
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();

    // Blur should trigger validation
    fireEvent.blur(nameInput);
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();
  });

  it("handles form submission with validation errors", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    // Should show validation errors and not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email Address is required")).toBeInTheDocument();
  });

  it("handles custom validation messages", () => {
    const fieldsWithCustomValidation: FormField[] = [
      {
        name: "username",
        label: "Username",
        type: "text",
        required: true,
        validation: {
          message: "Username is required for account creation",
        },
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithCustomValidation}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnBlur={true}
      />,
    );

    const usernameInput = getFieldByLabel("Username");
    fireEvent.blur(usernameInput);

    expect(
      screen.getByText("Username is required for account creation"),
    ).toBeInTheDocument();
  });

  it("handles pattern validation", () => {
    const fieldsWithPattern: FormField[] = [
      {
        name: "phone",
        label: "Phone Number",
        type: "text",
        validation: {
          pattern: "^\\+?[1-9]\\d{1,14}$",
          message: "Please enter a valid phone number",
        },
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithPattern}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnBlur={true}
      />,
    );

    const phoneInput = getFieldByLabel("Phone Number");
    fireEvent.change(phoneInput, { target: { value: "invalid-phone" } });
    fireEvent.blur(phoneInput);

    expect(
      screen.getByText("Please enter a valid phone number"),
    ).toBeInTheDocument();
  });

  it("handles form submission with async onSubmit", async () => {
    const asyncOnSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    const initialValues = {
      name: "John Doe",
      email: "john@example.com",
      age: 25,
      role: "user",
      newsletter: false,
    };

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={asyncOnSubmit}
        onCancel={mockOnCancel}
        initialValues={initialValues}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    expect(asyncOnSubmit).toHaveBeenCalledWith(initialValues);
  });

  it("handles field options with disabled state", () => {
    const fieldsWithDisabledOptions: FormField[] = [
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive", disabled: true },
          { value: "pending", label: "Pending" },
        ],
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithDisabledOptions}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    const selectField = getFieldByLabel("Status");
    const options = screen.getAllByRole("option");

    expect(options[2]).toHaveAttribute("disabled"); // Inactive option should be disabled
  });

  it("handles field default values", () => {
    const fieldsWithDefaults: FormField[] = [
      {
        name: "category",
        label: "Category",
        type: "text",
        defaultValue: "general",
      },
    ];

    render(
      <SimpleForm
        fields={fieldsWithDefaults}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    const categoryInput = getFieldByLabel("Category");
    expect(categoryInput).toHaveValue("general");
  });

  it("handles form without onCancel", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        initialValues={{}}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("handles form without showActions", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        showActions={false}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /save/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /reset/i }),
    ).not.toBeInTheDocument();
  });

  it("handles form with custom className", () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        className="custom-form-class"
      />,
    );

    const form = screen.getByRole("button", { name: /save/i }).closest("form");
    expect(form).toHaveClass("custom-form-class");
  });

  it("handles form submission with modified values", async () => {
    const initialValues = {
      name: "John Doe",
      email: "john@example.com",
      age: 25,
      role: "user",
      newsletter: false,
    };

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={initialValues}
      />,
    );

    const nameInput = getFieldByLabel("Full Name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...initialValues,
      name: "Jane Doe",
    });
  });

  it("handles form with no initial values", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={jest.fn()}
        initialValues={{}}
      />,
    );

    const nameInput = getFieldByLabel("Full Name");
    const emailInput = getFieldByLabel("Email Address");
    const ageInput = getFieldByLabel("Age");
    const roleSelect = getFieldByLabel("Role");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();

    // Fill out the form
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "jane@example.com");
    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, "25");
    await userEvent.selectOptions(roleSelect, "user");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Jane Doe",
        email: "jane@example.com",
        age: 25,
        role: "user",
        newsletter: false,
      });
    });
  });

  it("handles form with partial initial values", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={jest.fn()}
        initialValues={{ name: "John Doe", email: "john@example.com" }}
      />,
    );

    const nameInput = getFieldByLabel("Full Name");
    const emailInput = getFieldByLabel("Email Address");
    const ageInput = getFieldByLabel("Age");
    const roleSelect = getFieldByLabel("Role");

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(ageInput).toHaveValue("");
    expect(roleSelect).toHaveValue("");

    // Fill out remaining fields
    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, "30");
    await userEvent.selectOptions(roleSelect, "admin");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        age: 30,
        role: "admin",
        newsletter: false,
      });
    });
  });

  it("handles form submission with empty required fields", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={jest.fn()}
        initialValues={{}}
      />,
    );

    // Try to submit without filling required fields
    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    // Should not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email Address is required")).toBeInTheDocument();
    expect(screen.getByText("Role is required")).toBeInTheDocument();
  });

  it("handles form reset with modified values", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={jest.fn()}
        initialValues={{ name: "John Doe", email: "john@example.com", age: 25 }}
      />,
    );

    const nameInput = getFieldByLabel("Full Name");
    const ageInput = getFieldByLabel("Age");

    // Modify values
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");
    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, "30");

    // Reset the form
    const resetButton = screen.getByRole("button", { name: /reset/i });
    await userEvent.click(resetButton);

    // Values should be back to initial
    expect(nameInput).toHaveValue("John Doe");
    expect(ageInput).toHaveValue(25);
  });
});
