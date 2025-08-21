import { useSuperAdmin } from "@react-superadmin/core";
import { Filter, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  postService,
  productService,
  userService,
} from "../../services/mockService";
import { formatDate } from "../../utils/formatDate";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Modal } from "../ui/Modal";
import { DataTable } from "./DataTable";
import { Pagination } from "./Pagination";
import { SearchBar } from "./SearchBar";

interface ResourceListProps {
  resourceName: string;
}

export const ResourceList: React.FC<ResourceListProps> = ({ resourceName }) => {
  const { resources } = useSuperAdmin();
  const navigate = useNavigate();
  const resource = resources[resourceName];
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Get the appropriate service based on resource name
  const getService = () => {
    switch (resourceName) {
      case "users":
        return userService;
      case "posts":
        return postService;
      case "products":
        return productService;
      default:
        return null;
    }
  };

  const service = getService();

  // Load data
  const loadData = async () => {
    if (!service) return;

    setLoading(true);
    setError(null);

    try {
      const result = await service.list({
        page,
        perPage: limit,
        search,
      });
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      setError("Failed to load data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, limit, search]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1); // Reset to first page when searching
  };

  // Handle create
  const handleCreate = () => {
    navigate(`/${resourceName}/create`);
  };

  // Handle view
  const handleView = (id: string | number) => {
    navigate(`/${resourceName}/${id}`);
  };

  // Handle edit
  const handleEdit = (id: string | number) => {
    navigate(`/${resourceName}/${id}/edit`);
  };

  // Handle delete
  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!service || !itemToDelete) return;

    try {
      await service.delete(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
      loadData(); // Reload data
    } catch (error) {
      setError("Failed to delete item");
      console.error("Error deleting item:", error);
    }
  };

  if (!resource) {
    return <div>Resource not found</div>;
  }

  // Define columns based on resource type
  const getColumns = () => {
    switch (resourceName) {
      case "users":
        return [
          { key: "name", label: "Name", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "role", label: "Role", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "department", label: "Department", sortable: true },
          { key: "createdAt", label: "Created At", sortable: true },
        ];
      case "posts":
        return [
          { key: "title", label: "Title", sortable: true },
          { key: "author", label: "Author", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "category", label: "Category", sortable: true },
          { key: "publishedAt", label: "Published At", sortable: true },
          { key: "views", label: "Views", sortable: true },
        ];
      case "products":
        return [
          { key: "name", label: "Name", sortable: true },
          { key: "category", label: "Category", sortable: true },
          { key: "price", label: "Price", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "stock", label: "Stock", sortable: true },
          { key: "rating", label: "Rating", sortable: true },
        ];
      default:
        return [];
    }
  };

  // Render cell content with formatting
  const renderCell = (item: any, column: any) => {
    const value = item[column.key];

    switch (column.key) {
      case "status": {
        const statusColors: Record<
          string,
          "success" | "warning" | "danger" | "secondary"
        > = {
          active: "success",
          inactive: "warning",
          suspended: "danger",
          published: "success",
          draft: "warning",
          archived: "secondary",
          in_stock: "success",
          low_stock: "warning",
          out_of_stock: "danger",
        };
        return (
          <Badge variant={statusColors[value] || "default"}>{value}</Badge>
        );
      }

      case "createdAt":
      case "publishedAt":
        return value ? formatDate(value) : "-";

      case "price":
        return value ? `$${Number(value).toFixed(2)}` : "-";

      case "views":
      case "stock":
      case "rating":
        return value || "0";

      case "role":
        return <Badge variant="outline">{value}</Badge>;

      default:
        return value || "-";
    }
  };

  const columns = getColumns().map((col) => ({
    ...col,
    render: (value: any, row: any) => renderCell(row, col),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{resource.label}</h1>
          <p className="text-gray-600">
            Manage your {resource.label.toLowerCase()}
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create {resource.label}
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder={`Search ${resource.label.toLowerCase()}...`}
            />
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <DataTable
            data={data}
            columns={columns}
            onRowClick={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} results
            </div>
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / limit)}
              onPageChange={setPage}
            />
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this {resource.label.toLowerCase()}?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
