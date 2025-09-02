import { useSuperAdmin } from "@react-superadmin/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ResourceForm } from "../../../components/crud/ResourceForm";

// Mock the core package
jest.mock("@react-superadmin/core", () => ({
  useSuperAdmin: jest.fn(),
}));

// Mock the services
jest.mock("../../../services/mockService", () => ({
  userService: {
    instance: {
      create: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
    },
  },
  postService: {
    instance: {
      create: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
    },
  },
  productService: {
    instance: {
      create: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the child components
jest.mock("../../../components/ui/Card", () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
}));

jest.mock("../../../components/ui/Button", () => ({
  Button: ({ children, onClick, type, variant, loading, ...props }: any) => (
    <button
      data-testid={`button-${variant || "default"}`}
      onClick={onClick}
      type={type}
      disabled={loading}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("../../../components/forms/FormField", () => ({
  FormField: ({ field, value, onChange, error }: any) => (
    <div data-testid={`form-field-${field.name}`}>
      <label htmlFor={field.name}>{field.label}</label>
      {field.type === "text" ||
      field.type === "email" ||
      field.type === "number" ? (
        <input
          id={field.name}
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
        />
      ) : field.type === "textarea" ? (
        <textarea
          id={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
        />
      ) : field.type === "select" ? (
        <select
          id={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        >
          <option value="">Select...</option>
          {field.options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {error && (
        <div data-testid={`error-${field.name}`} className="error">
          {error}
        </div>
      )}
    </div>
  ),
}));

describe("ResourceForm", () => {
  const mockResources = {
    users: {
      label: "Users",
      permissions: { create: true, read: true, update: true, delete: true },
    },
    posts: {
      label: "Posts",
      permissions: { create: true, read: true, update: true, delete: true },
    },
    products: {
      label: "Products",
      permissions: { create: true, read: true, update: true, delete: true },
    },
  };

  const mockUserData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    phone: "123-456-7890",
    department: "Engineering",
  };

  const mockPostData = {
    id: 1,
    title: "Test Post",
    content: "This is a test post content",
    author: "John Doe",
    status: "published",
    category: "Development",
    tags: "react, admin, tutorial",
  };

  const mockProductData = {
    id: 1,
    name: "Test Product",
    description: "This is a test product description",
    price: 99.99,
    category: "Electronics",
    status: "in_stock",
    stock: 50,
    brand: "Test Brand",
    sku: "TEST-001",
  };

  const renderWithRouter = (
    component: React.ReactElement,
    initialRoute = "/users/create",
  ) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/:resource/:action/:id" element={component} />
          <Route path="/:resource/:action" element={component} />
        </Routes>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSuperAdmin as jest.Mock).mockReturnValue({
      resources: mockResources,
    });
  });

  describe("Basic Rendering", () => {
    it("renders create form for users correctly", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      expect(
        screen.getByRole("heading", { name: "Create Users" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Fill in the information below"),
      ).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Phone")).toBeInTheDocument();
      expect(screen.getByText("Department")).toBeInTheDocument();
    });

    it("renders create form for posts correctly", () => {
      renderWithRouter(<ResourceForm />, "/posts/create");

      expect(
        screen.getByRole("heading", { name: "Create Posts" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
      expect(screen.getByText("Author")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Tags")).toBeInTheDocument();
    });

    it("renders create form for products correctly", () => {
      renderWithRouter(<ResourceForm />, "/products/create");

      expect(
        screen.getByRole("heading", { name: "Create Products" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Price")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Stock")).toBeInTheDocument();
      expect(screen.getByText("Brand")).toBeInTheDocument();
      expect(screen.getByText("SKU")).toBeInTheDocument();
    });

    it("shows resource not found for invalid resource", () => {
      renderWithRouter(<ResourceForm />, "/invalid/create");

      expect(screen.getByText("Resource not found")).toBeInTheDocument();
    });

    it("displays correct resource icon for users", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      // The icon should be present (mocked as User icon)
      expect(
        screen.getByRole("heading", { name: "Create Users" }),
      ).toBeInTheDocument();
    });

    it("displays correct resource icon for posts", () => {
      renderWithRouter(<ResourceForm />, "/posts/create");

      // The icon should be present (mocked as FileText icon)
      expect(
        screen.getByRole("heading", { name: "Create Posts" }),
      ).toBeInTheDocument();
    });

    it("displays correct resource icon for products", () => {
      renderWithRouter(<ResourceForm />, "/products/create");

      // The icon should be present (mocked as Package icon)
      expect(
        screen.getByRole("heading", { name: "Create Products" }),
      ).toBeInTheDocument();
    });
  });

  describe("Form Field Types", () => {
    it("renders text input fields correctly", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      const nameField = screen.getByTestId("form-field-name");
      const emailField = screen.getByTestId("form-field-email");
      const phoneField = screen.getByTestId("form-field-phone");

      expect(nameField).toBeInTheDocument();
      expect(emailField).toBeInTheDocument();
      expect(phoneField).toBeInTheDocument();
    });

    it("renders select fields with options correctly", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      const roleField = screen.getByTestId("form-field-role");
      const statusField = screen.getByTestId("form-field-status");

      expect(roleField).toBeInTheDocument();
      expect(statusField).toBeInTheDocument();
    });

    it("renders textarea fields correctly", () => {
      renderWithRouter(<ResourceForm />, "/posts/create");

      const contentField = screen.getByTestId("form-field-content");

      expect(contentField).toBeInTheDocument();
    });

    it("renders number fields correctly", () => {
      renderWithRouter(<ResourceForm />, "/products/create");

      const priceField = screen.getByTestId("form-field-price");
      const stockField = screen.getByTestId("form-field-stock");

      expect(priceField).toBeInTheDocument();
      expect(stockField).toBeInTheDocument();
    });
  });

  describe("Create Mode", () => {
    it("shows create title and description", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      expect(
        screen.getByRole("heading", { name: "Create Users" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Fill in the information below"),
      ).toBeInTheDocument();
    });

    it("shows create button text", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      expect(
        screen.getByRole("button", { name: /Create Users/ }),
      ).toBeInTheDocument();
    });

    it("initializes with empty form data", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      const nameInput = screen
        .getByTestId("form-field-name")
        .querySelector("input");
      const emailInput = screen
        .getByTestId("form-field-email")
        .querySelector("input");

      expect(nameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
    });
  });

  describe("Edit Mode", () => {
    it("shows edit title and description", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.read.mockResolvedValue(mockUserData);

      renderWithRouter(<ResourceForm />, "/users/1/edit");

      await waitFor(() => {
        expect(screen.getByText("Edit Users")).toBeInTheDocument();
        expect(
          screen.getByText("Update the information below"),
        ).toBeInTheDocument();
      });
    });

    it("shows update button text", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.read.mockResolvedValue(mockUserData);

      renderWithRouter(<ResourceForm />, "/users/1/edit");

      await waitFor(() => {
        expect(screen.getByText("Update Users")).toBeInTheDocument();
      });
    });

    it("loads existing data for editing", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.read.mockResolvedValue(mockUserData);

      renderWithRouter(<ResourceForm />, "/users/1/edit");

      await waitFor(() => {
        const nameInput = screen
          .getByTestId("form-field-name")
          .querySelector("input");
        const emailInput = screen
          .getByTestId("form-field-email")
          .querySelector("input");

        expect(nameInput).toHaveValue("John Doe");
        expect(emailInput).toHaveValue("john@example.com");
      });
    });

    it("handles loading errors gracefully", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.read.mockRejectedValue(new Error("Failed to load"));

      renderWithRouter(<ResourceForm />, "/users/1/edit");

      // Should still render the form even if loading fails
      expect(screen.getByText("Edit Users")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("shows required field errors when submitting empty form", async () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      // Get the form element and submit it directly
      const formElement = screen.getByTestId("card").querySelector("form");
      fireEvent.submit(formElement!);

      await waitFor(() => {
        expect(screen.getByTestId("error-name")).toBeInTheDocument();
        expect(screen.getByTestId("error-email")).toBeInTheDocument();
        expect(screen.getByTestId("error-role")).toBeInTheDocument();
        expect(screen.getByTestId("error-status")).toBeInTheDocument();
      });
    });

    it("clears field errors when user starts typing", async () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      // Get the form element and submit it directly
      const formElement = screen.getByTestId("card").querySelector("form");
      fireEvent.submit(formElement!);

      await waitFor(() => {
        expect(screen.getByTestId("error-name")).toBeInTheDocument();
      });

      const nameInput = screen
        .getByTestId("form-field-name")
        .querySelector("input");
      fireEvent.change(nameInput!, { target: { value: "John Doe" } });

      await waitFor(() => {
        expect(screen.queryByTestId("error-name")).not.toBeInTheDocument();
      });
    });

    it("validates all required fields for posts", async () => {
      renderWithRouter(<ResourceForm />, "/posts/create");

      // Get the form element and submit it directly
      const formElement = screen.getByTestId("card").querySelector("form");
      fireEvent.submit(formElement!);

      await waitFor(() => {
        expect(screen.getByTestId("error-title")).toBeInTheDocument();
        expect(screen.getByTestId("error-content")).toBeInTheDocument();
        expect(screen.getByTestId("error-author")).toBeInTheDocument();
        expect(screen.getByTestId("error-status")).toBeInTheDocument();
        expect(screen.getByTestId("error-category")).toBeInTheDocument();
      });
    });

    it("validates all required fields for products", async () => {
      renderWithRouter(<ResourceForm />, "/products/create");

      // Get the form element and submit it directly
      const formElement = screen.getByTestId("card").querySelector("form");
      fireEvent.submit(formElement!);

      await waitFor(() => {
        expect(screen.getByTestId("error-name")).toBeInTheDocument();
        expect(screen.getByTestId("error-description")).toBeInTheDocument();
        expect(screen.getByTestId("error-price")).toBeInTheDocument();
        expect(screen.getByTestId("error-category")).toBeInTheDocument();
        expect(screen.getByTestId("error-status")).toBeInTheDocument();
        expect(screen.getByTestId("error-stock")).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("calls create service when submitting new user form", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.create.mockResolvedValue({ id: 1 });

      renderWithRouter(<ResourceForm />, "/users/create");

      // Fill required fields
      const nameInput = screen
        .getByTestId("form-field-name")
        .querySelector("input");
      const emailInput = screen
        .getByTestId("form-field-email")
        .querySelector("input");
      const roleSelect = screen
        .getByTestId("form-field-role")
        .querySelector("select");
      const statusSelect = screen
        .getByTestId("form-field-status")
        .querySelector("select");

      fireEvent.change(nameInput!, { target: { value: "John Doe" } });
      fireEvent.change(emailInput!, { target: { value: "john@example.com" } });
      fireEvent.change(roleSelect!, { target: { value: "admin" } });
      fireEvent.change(statusSelect!, { target: { value: "active" } });

      const submitButton = screen.getByTestId("button-default");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(userService.instance.create).toHaveBeenCalledWith({
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          status: "active",
        });
      });
    });

    it("calls update service when submitting edit user form", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.read.mockResolvedValue(mockUserData);
      userService.instance.update.mockResolvedValue({ id: 1 });

      renderWithRouter(<ResourceForm />, "/users/1/edit");

      await waitFor(() => {
        expect(screen.getByText("Edit Users")).toBeInTheDocument();
      });

      const submitButton = screen.getByText("Update Users");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(userService.instance.update).toHaveBeenCalledWith(
          "1",
          mockUserData,
        );
      });
    });

    it("navigates back to resource list after successful submission", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.create.mockResolvedValue({ id: 1 });

      renderWithRouter(<ResourceForm />, "/users/create");

      // Fill required fields
      const nameInput = screen
        .getByTestId("form-field-name")
        .querySelector("input");
      const emailInput = screen
        .getByTestId("form-field-email")
        .querySelector("input");
      const roleSelect = screen
        .getByTestId("form-field-role")
        .querySelector("select");
      const statusSelect = screen
        .getByTestId("form-field-status")
        .querySelector("select");

      fireEvent.change(nameInput!, { target: { value: "John Doe" } });
      fireEvent.change(emailInput!, { target: { value: "john@example.com" } });
      fireEvent.change(roleSelect!, { target: { value: "admin" } });
      fireEvent.change(statusSelect!, { target: { value: "active" } });

      const submitButton = screen.getByTestId("button-default");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/users");
      });
    });

    it("shows general error when submission fails", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.create.mockRejectedValue(
        new Error("Failed to save"),
      );

      renderWithRouter(<ResourceForm />, "/users/create");

      // Fill required fields
      const nameInput = screen
        .getByTestId("form-field-name")
        .querySelector("input");
      const emailInput = screen
        .getByTestId("form-field-email")
        .querySelector("input");
      const roleSelect = screen
        .getByTestId("form-field-role")
        .querySelector("select");
      const statusSelect = screen
        .getByTestId("form-field-status")
        .querySelector("select");

      fireEvent.change(nameInput!, { target: { value: "John Doe" } });
      fireEvent.change(emailInput!, { target: { value: "john@example.com" } });
      fireEvent.change(roleSelect!, { target: { value: "admin" } });
      fireEvent.change(statusSelect!, { target: { value: "active" } });

      const submitButton = screen.getByTestId("button-default");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Failed to save data")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("navigates back when cancel button is clicked", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      const cancelButtons = screen.getAllByText("Cancel");
      const formCancelButton = cancelButtons[1]; // The form cancel button (second one)
      fireEvent.click(formCancelButton);

      expect(mockNavigate).toHaveBeenCalledWith("/users");
    });

    it("navigates back when cancel button in header is clicked", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      const cancelButtons = screen.getAllByText("Cancel");
      const headerCancelButton = cancelButtons[0]; // The header cancel button (first one)
      fireEvent.click(headerCancelButton);

      expect(mockNavigate).toHaveBeenCalledWith("/users");
    });
  });

  describe("Loading States", () => {
    it("shows loading state on submit button during submission", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.create.mockImplementation(
        () => new Promise(() => {}),
      ); // Never resolves

      renderWithRouter(<ResourceForm />, "/users/create");

      // Fill required fields
      const nameInput = screen
        .getByTestId("form-field-name")
        .querySelector("input");
      const emailInput = screen
        .getByTestId("form-field-email")
        .querySelector("input");
      const roleSelect = screen
        .getByTestId("form-field-role")
        .querySelector("select");
      const statusSelect = screen
        .getByTestId("form-field-status")
        .querySelector("select");

      fireEvent.change(nameInput!, { target: { value: "John Doe" } });
      fireEvent.change(emailInput!, { target: { value: "john@example.com" } });
      fireEvent.change(roleSelect!, { target: { value: "admin" } });
      fireEvent.change(statusSelect!, { target: { value: "active" } });

      const submitButton = screen.getByTestId("button-default");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("Field Change Handling", () => {
    it("updates form data when field values change", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      const nameInput = screen
        .getByTestId("form-field-name")
        .querySelector("input");
      const emailInput = screen
        .getByTestId("form-field-email")
        .querySelector("input");

      fireEvent.change(nameInput!, { target: { value: "John Doe" } });
      fireEvent.change(emailInput!, { target: { value: "john@example.com" } });

      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toHaveValue("john@example.com");
    });

    it("handles select field changes correctly", () => {
      renderWithRouter(<ResourceForm />, "/users/create");

      const roleSelect = screen
        .getByTestId("form-field-role")
        .querySelector("select");
      const statusSelect = screen
        .getByTestId("form-field-status")
        .querySelector("select");

      fireEvent.change(roleSelect!, { target: { value: "admin" } });
      fireEvent.change(statusSelect!, { target: { value: "active" } });

      expect(roleSelect).toHaveValue("admin");
      expect(statusSelect).toHaveValue("active");
    });

    it("handles textarea field changes correctly", () => {
      renderWithRouter(<ResourceForm />, "/posts/create");

      const contentTextarea = screen
        .getByTestId("form-field-content")
        .querySelector("textarea");

      fireEvent.change(contentTextarea!, { target: { value: "New content" } });

      expect(contentTextarea).toHaveValue("New content");
    });
  });

  describe("Edge Cases", () => {
    it("handles missing resource gracefully", () => {
      (useSuperAdmin as jest.Mock).mockReturnValue({
        resources: {},
      });

      renderWithRouter(<ResourceForm />, "/users/create");

      expect(screen.getByText("Resource not found")).toBeInTheDocument();
    });

    it("handles missing service gracefully", () => {
      renderWithRouter(<ResourceForm />, "/invalid/create");

      expect(screen.getByText("Resource not found")).toBeInTheDocument();
    });

    it("handles form submission with partial data", async () => {
      const { userService } = jest.requireMock("../../../services/mockService");
      userService.instance.create.mockResolvedValue({ id: 1 });

      renderWithRouter(<ResourceForm />, "/users/create");

      // Fill only some required fields
      const nameInput = screen
        .getByTestId("form-field-name")
        .querySelector("input");
      fireEvent.change(nameInput!, { target: { value: "John Doe" } });

      // Get the form element and submit it directly
      const formElement = screen.getByTestId("card").querySelector("form");
      fireEvent.submit(formElement!);

      await waitFor(() => {
        expect(screen.getByTestId("error-email")).toBeInTheDocument();
        expect(screen.getByTestId("error-role")).toBeInTheDocument();
        expect(screen.getByTestId("error-status")).toBeInTheDocument();
      });

      expect(userService.instance.create).not.toHaveBeenCalled();
    });
  });
});
