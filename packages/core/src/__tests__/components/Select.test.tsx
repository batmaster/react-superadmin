import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Select, SelectOption } from "../Select";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";

// Mock SuperAdminProvider for testing
const mockConfig = {
  title: "Test App",
  resources: [],
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280",
    darkMode: false,
  },
  layout: {
    sidebar: true,
    header: true,
    footer: true,
    sidebarWidth: 250,
  },
  auth: {
    enabled: true,
    loginUrl: "/login",
    logoutUrl: "/logout",
  },
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <SuperAdminProvider config={mockConfig}>{component}</SuperAdminProvider>,
  );
};

const mockOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4", disabled: true },
];

const mockGroupedOptions: SelectOption[] = [
  { value: "group1-1", label: "Group 1 Option 1", data: { group: "Group 1" } },
  { value: "group1-2", label: "Group 1 Option 2", data: { group: "Group 1" } },
  { value: "group2-1", label: "Group 2 Option 1", data: { group: "Group 2" } },
  { value: "group2-2", label: "Group 2 Option 2", data: { group: "Group 2" } },
];

describe("Select", () => {
  it("renders select button", () => {
    renderWithProvider(
      <Select options={mockOptions} data-testid="select-button" />,
    );
    expect(screen.getByTestId("select-button")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    renderWithProvider(<Select label="Test Label" options={mockOptions} />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    renderWithProvider(
      <Select helperText="This is helper text" options={mockOptions} />,
    );
    expect(screen.getByText("This is helper text")).toBeInTheDocument();
  });

  it("renders error message when provided", () => {
    renderWithProvider(
      <Select error="This is an error" options={mockOptions} />,
    );
    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });

  it("shows required indicator when required is true", () => {
    renderWithProvider(
      <Select label="Test Label" required options={mockOptions} />,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    renderWithProvider(
      <Select
        className="custom-class"
        options={mockOptions}
        data-testid="select-button"
      />,
    );
    expect(screen.getByTestId("select-button")).toHaveClass("custom-class");
  });

  it("applies wrapper class names", () => {
    renderWithProvider(
      <Select
        wrapperClassName="wrapper-class"
        options={mockOptions}
        data-testid="select-button"
      />,
    );
    const wrapper =
      screen.getByTestId("select-button").parentElement?.parentElement;
    expect(wrapper).toHaveClass("wrapper-class");
  });

  it("applies custom styles", () => {
    renderWithProvider(
      <Select
        style={{ backgroundColor: "red" }}
        options={mockOptions}
        data-testid="select-button"
      />,
    );
    expect(screen.getByTestId("select-button")).toHaveStyle({
      backgroundColor: "red",
    });
  });

  it("applies correct size classes", () => {
    const { rerender } = renderWithProvider(
      <Select size="sm" options={mockOptions} data-testid="select-button" />,
    );
    expect(screen.getByTestId("select-button")).toHaveClass(
      "px-3 py-2 text-sm",
    );

    rerender(
      <SuperAdminProvider config={mockConfig}>
        <Select size="lg" options={mockOptions} data-testid="select-button" />
      </SuperAdminProvider>,
    );
    expect(screen.getByTestId("select-button")).toHaveClass(
      "px-4 py-3 text-base",
    );
  });

  it("applies full width when specified", () => {
    renderWithProvider(
      <Select fullWidth options={mockOptions} data-testid="select-button" />,
    );
    const wrapper =
      screen.getByTestId("select-button").parentElement?.parentElement;
    expect(wrapper).toHaveClass("w-full");
  });

  it("renders left icon when provided", () => {
    const LeftIcon = () => <span data-testid="left-icon">🔍</span>;
    renderWithProvider(
      <Select
        leftIcon={<LeftIcon />}
        options={mockOptions}
        data-testid="select-button"
      />,
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon when provided", () => {
    const RightIcon = () => <span data-testid="right-icon">✅</span>;
    renderWithProvider(
      <Select
        rightIcon={<RightIcon />}
        options={mockOptions}
        data-testid="select-button"
      />,
    );
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("shows placeholder when no option is selected", () => {
    renderWithProvider(
      <Select options={mockOptions} placeholder="Custom placeholder" />,
    );
    expect(screen.getByText("Custom placeholder")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", async () => {
    renderWithProvider(
      <Select options={mockOptions} data-testid="select-button" />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });

  it("displays all options when dropdown is open", async () => {
    renderWithProvider(
      <Select options={mockOptions} data-testid="select-button" />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
      expect(screen.getByText("Option 4")).toBeInTheDocument();
    });
  });

  it("selects single option when clicked", async () => {
    renderWithProvider(
      <Select options={mockOptions} data-testid="select-button" />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      const option1 = screen.getByText("Option 1");
      fireEvent.click(option1);
    });

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument(); // Dropdown should close
  });

  it("supports multiple selection when multiple is true", async () => {
    renderWithProvider(
      <Select multiple options={mockOptions} data-testid="select-button" />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      const option1 = screen.getByText("Option 1");
      const option2 = screen.getByText("Option 2");

      fireEvent.click(option1);
      fireEvent.click(option2);
    });

    expect(screen.getByText("2 options selected")).toBeInTheDocument();
  });

  it("shows search input when searchable is true", async () => {
    renderWithProvider(
      <Select searchable options={mockOptions} data-testid="select-button" />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search options..."),
      ).toBeInTheDocument();
    });
  });

  it("filters options based on search term", async () => {
    renderWithProvider(
      <Select searchable options={mockOptions} data-testid="select-button" />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Search options...");
      fireEvent.change(searchInput, { target: { value: "Option 1" } });

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    });
  });

  it("shows option groups when showOptionGroups is true", async () => {
    renderWithProvider(
      <Select
        showOptionGroups
        options={mockGroupedOptions}
        data-testid="select-button"
      />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("GROUP 1")).toBeInTheDocument();
      expect(screen.getByText("GROUP 2")).toBeInTheDocument();
    });
  });

  it("respects maxOptions limit", async () => {
    const manyOptions = Array.from({ length: 15 }, (_, i) => ({
      value: `option${i}`,
      label: `Option ${i}`,
    }));

    renderWithProvider(
      <Select
        maxOptions={5}
        options={manyOptions}
        data-testid="select-button"
      />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("+10 more options")).toBeInTheDocument();
    });
  });

  it("disables disabled options", async () => {
    renderWithProvider(
      <Select options={mockOptions} data-testid="select-button" />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      const disabledOption = screen.getByText("Option 4");
      expect(disabledOption).toHaveClass("opacity-50", "cursor-not-allowed");
    });
  });

  it("closes dropdown when clicking outside", async () => {
    renderWithProvider(
      <Select options={mockOptions} data-testid="select-button" />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    // Click outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
  });

  it("applies error state styling", () => {
    renderWithProvider(
      <Select
        error="Error message"
        options={mockOptions}
        data-testid="select-button"
      />,
    );
    const button = screen.getByTestId("select-button");
    expect(button).toHaveClass(
      "border-red-300",
      "focus:border-red-500",
      "focus:ring-red-500",
    );
  });

  it("applies disabled state correctly", () => {
    renderWithProvider(
      <Select disabled options={mockOptions} data-testid="select-button" />,
    );
    const button = screen.getByTestId("select-button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("applies data attributes correctly", () => {
    renderWithProvider(
      <Select
        size="lg"
        fullWidth
        error="Error"
        disabled
        options={mockOptions}
        data-testid="select-button"
      />,
    );
    const button = screen.getByTestId("select-button");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveAttribute("data-error", "true");
    expect(button).toHaveAttribute("data-disabled", "true");
    expect(button).toHaveAttribute("data-full-width", "true");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLSelectElement>();
    renderWithProvider(<Select ref={ref} options={mockOptions} />);
    expect(ref.current).toBeInTheDocument();
  });

  it("handles custom option renderer", async () => {
    const customRenderOption = (option: SelectOption) => (
      <div key={option.value} data-testid={`custom-option-${option.value}`}>
        Custom: {option.label}
      </div>
    );

    renderWithProvider(
      <Select
        renderOption={customRenderOption}
        options={mockOptions}
        data-testid="select-button"
      />,
    );

    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("custom-option-option1")).toBeInTheDocument();
      expect(screen.getByText("Custom: Option 1")).toBeInTheDocument();
    });
  });
});
