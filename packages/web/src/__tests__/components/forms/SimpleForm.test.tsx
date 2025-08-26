import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { FormField, SimpleForm } from "../../../components/forms/SimpleForm";

// Helper function to find form fields reliably
const getFieldByLabel = (labelText: string) => {
  // For checkbox fields, find the input directly by name
  if (labelText === "Subscribe to Newsletter") {
    return document.querySelector(
      `input[name="newsletter"]`,
    ) as HTMLInputElement;
  }

  if (labelText === "Checkbox") {
    return document.querySelector(`input[name="checkbox"]`) as HTMLInputElement;
  }

  // For array fields, return the container div since it's a complex structure
  if (labelText === "Array") {
    const label = screen.getByText(labelText);
    if (!label) return null;
    const fieldContainer = label.closest("div");
    return fieldContainer as HTMLElement;
  }

  // Find the label element with the exact text
  const label = screen.queryByText(labelText);
  if (!label) {
    // Try to find by name attribute as fallback
    const fieldName = labelText.toLowerCase().replace(/\s+/g, "");
    return document.querySelector(
      `input[name="${fieldName}"], select[name="${fieldName}"], textarea[name="${fieldName}"]`,
    ) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  }

  // For SimpleForm, the input is typically in the next sibling div or within the same container
  // Look for the closest parent div that contains both label and input
  const fieldContainer = label.closest("div");
  if (!fieldContainer) return null;

  // Look for input/select/textarea in the same container
  let input = fieldContainer.querySelector("input, select, textarea");

  // If not found in the same container, look in the next sibling div
  if (!input) {
    const nextSibling = fieldContainer.nextElementSibling;
    if (nextSibling && nextSibling.tagName === "DIV") {
      input = nextSibling.querySelector("input, select, textarea");
    }
  }

  // If still not found, look for any input with the same name attribute
  if (!input) {
    const fieldName = labelText.toLowerCase().replace(/\s+/g, "");
    input = document.querySelector(
      `input[name="${fieldName}"], select[name="${fieldName}"], textarea[name="${fieldName}"]`,
    );
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

    // For select fields, check if the correct option is selected
    const roleSelect = screen.getByRole("combobox", { name: /role/i });
    expect(roleSelect).toHaveValue("user");

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

    const nameInput = getFieldByLabel("Full Name");
    expect(nameInput).toBeInTheDocument();

    if (nameInput) {
      await userEvent.type(nameInput, "Jane Doe");
      expect(nameInput).toHaveValue("Jane Doe");
    }
  });

  it("validates required fields on blur", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnBlur={true}
      />,
    );

    const nameInput = getFieldByLabel("Full Name");
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

    const ageInput = getFieldByLabel("Age");
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
        validateOnChange={true}
      />,
    );

    const emailInput = getFieldByLabel("Email Address");
    await userEvent.type(emailInput, "invalid-email");
    fireEvent.blur(emailInput);

    // Should show email validation error
    expect(
      screen.getByText("Email Address must be a valid email address"),
    ).toBeInTheDocument();
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

    const submitButton = screen.getByRole("button", { name: /saving/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("handles form reset", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{
          name: "John Doe",
          email: "john@example.com",
          age: 25,
          role: "admin",
          newsletter: false,
        }}
      />,
    );

    const nameInput = getFieldByLabel("Full Name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Modified Name");

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await userEvent.click(resetButton);

    // Form should be reset to initial values
    expect(nameInput).toHaveValue("John Doe");
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

    const form = document.querySelector("form");
    const submitButton = screen.getByRole("button", { name: /save/i });

    // Try both approaches: click the button and submit the form directly
    await userEvent.click(submitButton);

    // Also try submitting the form directly
    if (form) {
      fireEvent.submit(form);
    }

    // Should show validation errors and not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();
  });

  it("handles form submission with empty required fields", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    const form = document.querySelector("form");
    const submitButton = screen.getByRole("button", { name: /save/i });

    // Try both approaches: click the button and submit the form directly
    await userEvent.click(submitButton);

    // Also try submitting the form directly
    if (form) {
      fireEvent.submit(form);
    }

    // Should not call onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();
  });

  it("handles different field types correctly", () => {
    const fieldTypes = [
      { name: "text", type: "text", label: "Text" },
      { name: "email", type: "email", label: "Email" },
      { name: "password", type: "password", label: "Password" },
      { name: "number", type: "number", label: "Number" },
      { name: "textarea", type: "textarea", label: "Textarea" },
      { name: "select", type: "select", label: "Select", options: ["option1"] },
      { name: "checkbox", type: "checkbox", label: "Checkbox" },
      { name: "radio", type: "radio", label: "Radio", options: ["radio1"] },
      { name: "date", type: "date", label: "Date" },
      { name: "boolean", type: "boolean", label: "Boolean" },
      { name: "array", type: "array", label: "Array" },
      {
        name: "autocomplete",
        type: "autocomplete",
        label: "Autocomplete",
        options: ["Auto 1"],
      },
    ];

    render(
      <SimpleForm
        fields={fieldTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
      />,
    );

    // Check that all field types are rendered
    expect(getFieldByLabel("Text")).toHaveAttribute("type", "text");
    expect(getFieldByLabel("Email")).toHaveAttribute("type", "email");
    expect(getFieldByLabel("Password")).toHaveAttribute("type", "password");
    expect(getFieldByLabel("Number")).toHaveAttribute("type", "number");
    expect(getFieldByLabel("Textarea")).toBeInTheDocument();
    expect(getFieldByLabel("Select")).toBeInTheDocument();
    expect(getFieldByLabel("Checkbox")).toBeInTheDocument();
    expect(getFieldByLabel("Radio")).toBeInTheDocument();
    expect(getFieldByLabel("Date")).toHaveAttribute("type", "date");
    expect(getFieldByLabel("Boolean")).toBeInTheDocument();
    expect(getFieldByLabel("Array")).toBeInTheDocument();
    expect(getFieldByLabel("Autocomplete")).toBeInTheDocument();
  });

  it("handles select field options correctly", () => {
    const initialValues = {
      name: "John Doe",
      email: "john@example.com",
      age: 25,
      role: "admin",
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

    const selectField = getFieldByLabel("Role");
    expect(selectField).toHaveValue("admin");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4); // Including the default "Select Role" option
    expect(options[0]).toHaveTextContent("Select Role");
    expect(options[1]).toHaveTextContent("Administrator");
    expect(options[2]).toHaveTextContent("Regular User");
    expect(options[3]).toHaveTextContent("Moderator");
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
      />,
    );

    const form = document.querySelector("form");
    const submitButton = screen.getByRole("button", { name: /save/i });

    // Submit form to trigger validation
    if (form) {
      fireEvent.submit(form);
    }

    // Should show validation errors
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();
  });

  it("handles custom validation messages", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{}}
        validateOnBlur={true}
      />,
    );

    const emailInput = getFieldByLabel("Email Address");
    await userEvent.type(emailInput, "invalid-email");
    fireEvent.blur(emailInput);

    // Should show custom validation message
    expect(
      screen.getByText("Email Address must be a valid email address"),
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

  it("handles form with partial initial values", () => {
    const partialValues = {
      name: "John Doe",
      email: "john@example.com",
    };

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={partialValues}
      />,
    );

    const nameInput = getFieldByLabel("Full Name");
    const emailInput = getFieldByLabel("Email Address");
    const ageInput = document.querySelector(
      'input[name="age"]',
    ) as HTMLInputElement;
    const roleSelect = getFieldByLabel("Role");

    // Fields with initial values should have them
    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(ageInput.value).toBe("");
    expect(roleSelect).toHaveValue("");

    // Fill out remaining fields
    fireEvent.change(ageInput, { target: { value: "25" } });
    fireEvent.change(roleSelect, { target: { value: "admin" } });

    expect(ageInput.value).toBe("25");
    expect(roleSelect).toHaveValue("admin");
  });

  it("handles form reset with modified values", async () => {
    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{
          name: "John Doe",
          email: "john@example.com",
          age: 25,
          role: "admin",
          newsletter: false,
        }}
      />,
    );

    const nameInput = getFieldByLabel("Full Name");
    const emailInput = getFieldByLabel("Email Address");
    const ageInput = getFieldByLabel("Age");
    const roleSelect = getFieldByLabel("Role");

    // Modify values
    await act(async () => {
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "Modified Name");
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "modified@example.com");
      fireEvent.change(ageInput, { target: { value: "30" } });
      fireEvent.change(roleSelect, { target: { value: "user" } });
    });

    // Reset form
    const resetButton = screen.getByRole("button", { name: /reset/i });
    await act(async () => {
      await userEvent.click(resetButton);
    });

    // Form should be reset to initial values
    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(ageInput).toHaveValue(25);
    expect(roleSelect).toHaveValue("admin");
  });

  it("handles form submission with loading state", async () => {
    const mockOnSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    render(
      <SimpleForm
        fields={mockFields}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={{
          name: "John Doe",
          email: "john@example.com",
          age: 25,
          role: "admin",
          newsletter: false,
        }}
      />,
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    // Button should be disabled and show loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });
});
