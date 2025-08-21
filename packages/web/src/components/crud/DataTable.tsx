import React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { ColumnConfig } from "@react-superadmin/core";
import { Button } from "../ui/Button";

interface DataTableProps<T = any> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  loading?: boolean;
}

export function DataTable<T = any>({
  data,
  columns,
  onRowClick,
  onEdit,
  onDelete,
  loading,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"
        ></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const renderCellContent = (row: T, column: ColumnConfig<T>) => {
    if (column.render) {
      return column.render(row[column.key as keyof T], row);
    }

    const value = row[column.key as keyof T];
    if (value == null) return "";

    // Convert to string for display
    return String(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {renderCellContent(row, column)}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  {onRowClick && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick(row);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(row);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(row);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
