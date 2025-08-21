import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { ReferenceField } from "../../components/ReferenceField";

// Mock data provider
const mockDataProvider = {
  getOne: jest.fn(),
  getMany: jest.fn(),
};

// Mock data
const mockUser = { id: "123", name: "John Doe", email: "john@example.com" };
const mockPost = { id: "456", title: "Sample Post", content: "Post content" };
const mockUsers = [
  { id: "123", name: "John Doe" },
  { id: "456", name: "Jane Smith" },
];

describe("ReferenceField Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders single reference without data provider", () => {
      render(<ReferenceField value="123" reference="users" source="name" />);

      expect(screen.getByTestId("reference-field")).toBeInTheDocument();
      expect(screen.getByTestId("reference-field-no-data")).toBeInTheDocument();
    });

    it("renders multiple references without data provider", () => {
      render(
        <ReferenceField
          value={["123", "456"]}
          reference="users"
          source="name"
        />,
      );

      expect(screen.getByTestId("reference-field")).toBeInTheDocument();
      expect(screen.getByTestId("reference-field-no-data")).toBeInTheDocument();
    });

    it("renders empty state when no valid IDs provided", () => {
      render(<ReferenceField value={null} reference="users" source="name" />);

      expect(screen.getByTestId("reference-field-empty")).toBeInTheDocument();
      expect(screen.getByText("No references found")).toBeInTheDocument();
    });

    it("renders empty state when empty array provided", () => {
      render(<ReferenceField value={[]} reference="users" source="name" />);

      expect(screen.getByTestId("reference-field-empty")).toBeInTheDocument();
      expect(screen.getByText("No references found")).toBeInTheDocument();
    });

    it("renders empty state when empty string provided", () => {
      render(<ReferenceField value="" reference="users" source="name" />);

      expect(screen.getByTestId("reference-field-empty")).toBeInTheDocument();
      expect(screen.getByText("No references found")).toBeInTheDocument();
    });
  });

  describe("Data Provider Integration", () => {
    it("fetches and displays single reference data", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      expect(screen.getByTestId("reference-field-loading")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId("reference-field")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      expect(mockDataProvider.getOne).toHaveBeenCalledWith("users", "123");
    });

    it("fetches and displays multiple references data", async () => {
      mockDataProvider.getMany.mockResolvedValue(mockUsers);

      render(
        <ReferenceField
          value={["123", "456"]}
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      expect(screen.getByTestId("reference-field-loading")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId("reference-field")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });

      expect(mockDataProvider.getMany).toHaveBeenCalledWith("users", [
        "123",
        "456",
      ]);
    });

    it("falls back to multiple single requests when getMany not available", async () => {
      const dataProviderWithoutGetMany = { getOne: mockDataProvider.getOne };
      mockDataProvider.getOne
        .mockResolvedValueOnce(mockUsers[0])
        .mockResolvedValueOnce(mockUsers[1]);

      render(
        <ReferenceField
          value={["123", "456"]}
          reference="users"
          source="name"
          dataProvider={dataProviderWithoutGetMany}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });

      expect(mockDataProvider.getOne).toHaveBeenCalledWith("users", "123");
      expect(mockDataProvider.getOne).toHaveBeenCalledWith("users", "456");
    });

    it("handles data provider errors gracefully", async () => {
      const error = new Error("Failed to fetch user");
      mockDataProvider.getOne.mockRejectedValue(error);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByTestId("reference-field-error")).toBeInTheDocument();
        expect(
          screen.getByText("Error: Failed to fetch user"),
        ).toBeInTheDocument();
      });
    });

    it("handles non-Error exceptions", async () => {
      mockDataProvider.getOne.mockRejectedValue("String error");

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByTestId("reference-field-error")).toBeInTheDocument();
        expect(
          screen.getByText("Error: Failed to fetch reference data"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Source Field Handling", () => {
    it("displays the specified source field", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="email"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
      });
    });

    it("falls back to id when source field is not found", async () => {
      const userWithoutName = { id: "123", email: "john@example.com" };
      mockDataProvider.getOne.mockResolvedValue(userWithoutName);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("123")).toBeInTheDocument();
      });
    });

    it('displays "Unknown" when neither source nor id is found', async () => {
      const userWithoutId = { email: "john@example.com" };
      mockDataProvider.getOne.mockResolvedValue(userWithoutId);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("Unknown")).toBeInTheDocument();
      });
    });
  });

  describe("Multiple References Display", () => {
    it("displays multiple references with default separator", async () => {
      mockDataProvider.getMany.mockResolvedValue(mockUsers);

      render(
        <ReferenceField
          value={["123", "456"]}
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        // Check for separator element instead of text content
        const separator = screen
          .getByTestId("reference-field")
          .querySelector(".reference-separator");
        expect(separator).toBeInTheDocument();
        // Use a more flexible text matching approach
        expect(separator?.textContent).toContain(",");
      });
    });

    it("displays multiple references with custom separator", async () => {
      mockDataProvider.getMany.mockResolvedValue(mockUsers);

      render(
        <ReferenceField
          value={["123", "456"]}
          reference="users"
          source="name"
          separator=" | "
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        // Check for separator element instead of text content
        const separator = screen
          .getByTestId("reference-field")
          .querySelector(".reference-separator");
        expect(separator).toBeInTheDocument();
        // Use a more flexible text matching approach
        expect(separator?.textContent).toContain("|");
      });
    });

    it("displays multiple references as list when showAsList is true", async () => {
      mockDataProvider.getMany.mockResolvedValue(mockUsers);

      render(
        <ReferenceField
          value={["123", "456"]}
          reference="users"
          source="name"
          showAsList
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        const list = screen
          .getByTestId("reference-field")
          .querySelector(".reference-list");
        expect(list).toBeInTheDocument();
        expect(list?.querySelectorAll("li")).toHaveLength(2);
      });
    });

    it("limits displayed items when maxItems is specified", async () => {
      const manyUsers = [
        { id: "1", name: "User 1" },
        { id: "2", name: "User 2" },
        { id: "3", name: "User 3" },
        { id: "4", name: "User 4" },
      ];
      mockDataProvider.getMany.mockResolvedValue(manyUsers);

      render(
        <ReferenceField
          value={["1", "2", "3", "4"]}
          reference="users"
          source="name"
          maxItems={2}
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("User 1")).toBeInTheDocument();
        expect(screen.getByText("User 2")).toBeInTheDocument();
        expect(screen.getByText("+2 more")).toBeInTheDocument();
        expect(screen.queryByText("User 3")).not.toBeInTheDocument();
        expect(screen.queryByText("User 4")).not.toBeInTheDocument();
      });
    });
  });

  describe("Custom Rendering", () => {
    it("uses custom renderer when provided", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      const customRender = (data: any) => (
        <span data-testid="custom-render" className="custom-user">
          {data.name.toUpperCase()}
        </span>
      );

      render(
        <ReferenceField
          value="123"
          reference="users"
          dataProvider={mockDataProvider}
          render={customRender}
        />,
      );

      await waitFor(() => {
        const customElement = screen.getByTestId("custom-render");
        expect(customElement).toBeInTheDocument();
        expect(customElement).toHaveTextContent("JOHN DOE");
        expect(customElement).toHaveClass("custom-user");
      });
    });

    it("uses custom renderer for multiple references", async () => {
      mockDataProvider.getMany.mockResolvedValue(mockUsers);

      const customRender = (data: any[]) => (
        <div data-testid="custom-multiple-render">
          {data.map((user) => (
            <span key={user.id} className="user-tag">
              {user.name}
            </span>
          ))}
        </div>
      );

      render(
        <ReferenceField
          value={["123", "456"]}
          reference="users"
          dataProvider={mockDataProvider}
          render={customRender}
        />,
      );

      await waitFor(() => {
        const customElement = screen.getByTestId("custom-multiple-render");
        expect(customElement).toBeInTheDocument();
        expect(customElement.querySelectorAll(".user-tag")).toHaveLength(2);
      });
    });
  });

  describe("Link Functionality", () => {
    it("renders links when showLink is true", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          showLink
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        const link = screen.getByTestId("reference-link");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/users/123");
        expect(link).toHaveTextContent("John Doe");
      });
    });

    it("uses custom link renderer when provided", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      const customLinkRenderer = (id: string | number, data: any) => (
        <a
          href={`/custom/${id}`}
          className="custom-link"
          data-testid="custom-link"
        >
          {data.name}
        </a>
      );

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          showLink
          linkRenderer={customLinkRenderer}
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        const link = screen.getByTestId("custom-link");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/custom/123");
        expect(link).toHaveClass("custom-link");
        expect(link).toHaveTextContent("John Doe");
      });
    });
  });

  describe("Loading and Error States", () => {
    it("shows loading state while fetching data", () => {
      mockDataProvider.getOne.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      expect(screen.getByTestId("reference-field-loading")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("hides loading state when showLoading is false", () => {
      mockDataProvider.getOne.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          showLoading={false}
          dataProvider={mockDataProvider}
        />,
      );

      expect(
        screen.queryByTestId("reference-field-loading"),
      ).not.toBeInTheDocument();
    });

    it("hides error state when showError is false", async () => {
      mockDataProvider.getOne.mockRejectedValue(new Error("Test error"));

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          showError={false}
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId("reference-field-error"),
        ).not.toBeInTheDocument();
      });
    });

    it("uses custom loading component when provided", () => {
      const CustomLoading = () => (
        <div data-testid="custom-loading">Custom Loading...</div>
      );
      mockDataProvider.getOne.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          loadingComponent={CustomLoading}
          dataProvider={mockDataProvider}
        />,
      );

      expect(screen.getByTestId("custom-loading")).toBeInTheDocument();
      expect(screen.getByText("Custom Loading...")).toBeInTheDocument();
    });

    it("uses custom error component when provided", async () => {
      const CustomError = () => (
        <div data-testid="custom-error">Custom Error</div>
      );
      mockDataProvider.getOne.mockRejectedValue(new Error("Test error"));

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          errorComponent={CustomError}
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByTestId("custom-error")).toBeInTheDocument();
        expect(screen.getByText("Custom Error")).toBeInTheDocument();
      });
    });
  });

  describe("Customization and Styling", () => {
    it("applies custom className to container", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          className="custom-container"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        const container = screen.getByTestId("reference-field");
        expect(container).toHaveClass("custom-container");
      });
    });

    it("applies custom contentClassName to content", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          contentClassName="custom-content"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        const content = screen
          .getByTestId("reference-field")
          .querySelector(".reference-field-content");
        expect(content).toHaveClass("custom-content");
      });
    });

    it("applies custom loadingClassName", () => {
      mockDataProvider.getOne.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          loadingClassName="custom-loading"
          dataProvider={mockDataProvider}
        />,
      );

      const loadingContainer = screen.getByTestId("reference-field-loading");
      expect(loadingContainer).toHaveClass("custom-loading");
    });

    it("applies custom errorClassName", async () => {
      mockDataProvider.getOne.mockRejectedValue(new Error("Test error"));

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          errorClassName="custom-error"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        const errorContainer = screen.getByTestId("reference-field-error");
        expect(errorContainer).toHaveClass("custom-error");
      });
    });
  });

  describe("Accessibility", () => {
    it("sets aria-required attribute when required is true", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          required={true}
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        const field = screen.getByTestId("reference-field");
        expect(field).toHaveAttribute("aria-required", "true");
      });
    });

    it("does not set aria-required attribute when required is false", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      render(
        <ReferenceField
          value="123"
          reference="users"
          source="name"
          required={false}
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        const field = screen.getByTestId("reference-field");
        expect(field).not.toHaveAttribute("aria-required");
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles null and undefined values gracefully", () => {
      const { unmount } = render(
        <ReferenceField value={null as any} reference="users" source="name" />,
      );

      expect(screen.getByTestId("reference-field-empty")).toBeInTheDocument();

      unmount();

      render(
        <ReferenceField
          value={undefined as any}
          reference="users"
          source="name"
        />,
      );

      expect(screen.getByTestId("reference-field-empty")).toBeInTheDocument();
    });

    it("handles mixed valid and invalid IDs", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      render(
        <ReferenceField
          value={["123", "", null, "456"]}
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
    });

    it("handles empty string values in array", async () => {
      mockDataProvider.getOne.mockResolvedValue(mockUser);

      render(
        <ReferenceField
          value={["", "123", ""]}
          reference="users"
          source="name"
          dataProvider={mockDataProvider}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
    });
  });
});
