import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "../../../components/crud/DataTable";
import { ColumnConfig } from "@react-superadmin/core";

// Mock the core package
jest.mock("@react-superadmin/core", () => ({
  ColumnConfig: {} as any,
}));

interface TestData {
  id: number;
  name: string;
  email: string;
  status: string;
}

describe("DataTable", () => {
  const mockData: TestData[] = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Inactive",
    },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active" },
  ];

  const mockColumns: ColumnConfig<TestData>[] = [
    { key: "id", label: "ID", width: "80px" },
    { key: "name", label: "Name", width: "200px" },
    { key: "email", label: "Email", width: "250px" },
    { key: "status", label: "Status", width: "120px" },
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
  };

  describe("Basic Rendering", () => {
    it("renders table with data", () => {
      render(<DataTable {...defaultProps} />);

      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
      expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    });

    it("renders empty state when no data", () => {
      render(<DataTable {...defaultProps} data={[]} />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("renders loading state", () => {
      render(<DataTable {...defaultProps} loading={true} />);

      const loadingSpinner = screen.getByTestId("loading-spinner");
      expect(loadingSpinner).toHaveClass("animate-spin");
    });
  });

  describe("Column Rendering", () => {
    it("renders all columns with correct labels", () => {
      render(<DataTable {...defaultProps} />);

      mockColumns.forEach((column) => {
        expect(screen.getByText(column.label)).toBeInTheDocument();
      });
    });

    it("applies column width styles", () => {
      render(<DataTable {...defaultProps} />);

      const idHeader = screen.getByText("ID").closest("th");
      expect(idHeader).toHaveStyle({ width: "80px" });
    });

    it("renders custom cell content when render function provided", () => {
      const customColumns = [
        ...mockColumns.slice(0, -1),
        {
          key: "status",
          label: "Status",
          render: (value: string) => (
            <span className="custom-status">{value}</span>
          ),
        },
      ];

      render(<DataTable {...defaultProps} columns={customColumns} />);

      const customStatusElements = screen.getAllByText("Active");
      const customStatus = customStatusElements.find((el) =>
        el.classList.contains("custom-status"),
      );
      expect(customStatus).toHaveClass("custom-status");
    });
  });

  describe("Row Interactions", () => {
    it("calls onRowClick when row is clicked", () => {
      const onRowClick = jest.fn();
      render(<DataTable {...defaultProps} onRowClick={onRowClick} />);

      const firstRow = screen.getByText("John Doe").closest("tr");
      fireEvent.click(firstRow!);

      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it("applies hover styles when onRowClick is provided", () => {
      const onRowClick = jest.fn();
      render(<DataTable {...defaultProps} onRowClick={onRowClick} />);

      const firstRow = screen.getByText("John Doe").closest("tr");
      expect(firstRow).toHaveClass("cursor-pointer");
    });

    it("does not apply hover styles when onRowClick is not provided", () => {
      render(<DataTable {...defaultProps} />);

      const firstRow = screen.getByText("John Doe").closest("tr");
      expect(firstRow).not.toHaveClass("cursor-pointer");
    });
  });

  describe("Action Buttons", () => {
    it("renders view button when onRowClick is provided", () => {
      const onRowClick = jest.fn();
      render(<DataTable {...defaultProps} onRowClick={onRowClick} />);

      const viewButtons = screen.getAllByRole("button");
      expect(viewButtons.length).toBeGreaterThan(0);

      const firstViewButton = viewButtons[0];
      expect(firstViewButton).toBeInTheDocument();
    });

    it("renders edit button when onEdit is provided", () => {
      const onEdit = jest.fn();
      render(<DataTable {...defaultProps} onEdit={onEdit} />);

      const editButtons = screen.getAllByRole("button");
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it("renders delete button when onDelete is provided", () => {
      const onDelete = jest.fn();
      render(<DataTable {...defaultProps} onDelete={onDelete} />);

      const deleteButtons = screen.getAllByRole("button");
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it("calls onEdit when edit button is clicked", () => {
      const onEdit = jest.fn();
      render(<DataTable {...defaultProps} onEdit={onEdit} />);

      const editButtons = screen.getAllByRole("button");
      fireEvent.click(editButtons[0]);

      expect(onEdit).toHaveBeenCalledWith(mockData[0]);
    });

    it("calls onDelete when delete button is clicked", () => {
      const onDelete = jest.fn();
      render(<DataTable {...defaultProps} onDelete={onDelete} />);

      const deleteButtons = screen.getAllByRole("button");
      fireEvent.click(deleteButtons[0]);

      expect(onDelete).toHaveBeenCalledWith(mockData[0]);
    });

    it("prevents row click when action button is clicked", () => {
      const onRowClick = jest.fn();
      const onEdit = jest.fn();
      render(
        <DataTable {...defaultProps} onRowClick={onRowClick} onEdit={onEdit} />,
      );

      const editButtons = screen.getAllByRole("button");
      // Click the edit button (first button after view button)
      fireEvent.click(editButtons[1]);

      expect(onEdit).toHaveBeenCalledWith(mockData[0]);
      expect(onRowClick).not.toHaveBeenCalled();
    });
  });

  describe("Data Handling", () => {
    it("handles null/undefined values gracefully", () => {
      const dataWithNulls = [
        { id: 1, name: null, email: undefined, status: "Active" },
      ];

      render(<DataTable {...defaultProps} data={dataWithNulls} />);

      // The component renders empty strings for null/undefined values
      const emptyCells = screen.getAllByText("");
      expect(emptyCells.length).toBeGreaterThan(0);
    });

    it("converts non-string values to strings", () => {
      const dataWithNumbers = [
        { id: 1, name: "John", email: "john@example.com", status: 123 },
      ];

      render(<DataTable {...defaultProps} data={dataWithNumbers} />);

      expect(screen.getByText("123")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper table structure", () => {
      render(<DataTable {...defaultProps} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(5); // 4 columns + Actions
    });

    it("has proper row structure", () => {
      render(<DataTable {...defaultProps} />);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(4); // 1 header + 3 data rows
    });
  });

  describe("Edge Cases", () => {
    it("handles empty columns array", () => {
      render(<DataTable {...defaultProps} columns={[]} />);

      expect(screen.getByText("Actions")).toBeInTheDocument();
      // With empty columns, it still shows the table structure
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("handles single row data", () => {
      const singleRowData = [mockData[0]];
      render(<DataTable {...defaultProps} data={singleRowData} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });
  });
});
