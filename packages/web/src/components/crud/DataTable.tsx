import { ColumnConfig } from "@react-superadmin/core";
import { Edit, Eye, Trash2 } from "lucide-react";
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
      <div className="flex justify-center items-center h-32">
        <div
          data-testid="loading-spinner"
          className="w-6 h-6 rounded-full border-b-2 animate-spin border-primary-600"
        ></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-8 text-center">
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
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
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
                  className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
                >
                  {renderCellContent(row, column)}
                </td>
              ))}
              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                <div className="flex justify-end items-center space-x-2">
                  {onRowClick && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick(row);
                      }}
                    >
                      <Eye className="w-4 h-4" />
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
                      <Edit className="w-4 h-4" />
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
                      <Trash2 className="w-4 h-4" />
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
