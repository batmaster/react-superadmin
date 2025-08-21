import { useSuperAdmin } from "@react-superadmin/core";
import { FileText, Package, Save, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  postService,
  productService,
  userService,
} from "../../services/mockService";
import { FormField } from "../forms/FormField";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export const ResourceForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract resource name, action, and ID from the current path
  const pathSegments = location.pathname.split("/");
  const resourceName = pathSegments[1]; // /users/create -> users
  const secondSegment = pathSegments[2]; // /users/create -> create, /users/1/edit -> 1
  const thirdSegment = pathSegments[3]; // /users/1/edit -> edit

  // Determine if this is edit mode and extract the actual ID
  let actualId = id;
  let action = secondSegment;

  // If we have 4 segments like /users/1/edit, the ID is in segment 2
  if (pathSegments.length === 4) {
    actualId = secondSegment;
    action = thirdSegment;
  }

  const { resources } = useSuperAdmin();
  const resource = resources[resourceName || ""];
  const isEdit = action === "edit" && Boolean(actualId);

  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Load existing data for edit mode
  useEffect(() => {
    if (isEdit && service && actualId) {
      const loadData = async () => {
        try {
          const data = await service.read(actualId);
          setFormData(data);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };
      loadData();
    }
  }, [isEdit, service, actualId]);

  if (!resource || !service) {
    return <div>Resource not found</div>;
  }

  // Define form fields based on resource type
  const getFormFields = () => {
    switch (resourceName) {
      case "users":
        return [
          {
            name: "name",
            label: "Name",
            type: "text" as const,
            required: true,
          },
          {
            name: "email",
            label: "Email",
            type: "email" as const,
            required: true,
          },
          {
            name: "role",
            label: "Role",
            type: "select" as const,
            required: true,
            options: [
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
              { value: "moderator", label: "Moderator" },
            ],
          },
          {
            name: "status",
            label: "Status",
            type: "select" as const,
            required: true,
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "suspended", label: "Suspended" },
            ],
          },
          { name: "phone", label: "Phone", type: "text" as const },
          { name: "department", label: "Department", type: "text" as const },
        ];

      case "posts":
        return [
          {
            name: "title",
            label: "Title",
            type: "text" as const,
            required: true,
          },
          {
            name: "content",
            label: "Content",
            type: "textarea" as const,
            required: true,
          },
          {
            name: "author",
            label: "Author",
            type: "text" as const,
            required: true,
          },
          {
            name: "status",
            label: "Status",
            type: "select" as const,
            required: true,
            options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ],
          },
          {
            name: "category",
            label: "Category",
            type: "select" as const,
            required: true,
            options: [
              { value: "Development", label: "Development" },
              { value: "Design", label: "Design" },
              { value: "Marketing", label: "Marketing" },
              { value: "Business", label: "Business" },
            ],
          },
          {
            name: "tags",
            label: "Tags",
            type: "text" as const,
            placeholder: "react, admin, tutorial",
          },
        ];

      case "products":
        return [
          {
            name: "name",
            label: "Name",
            type: "text" as const,
            required: true,
          },
          {
            name: "description",
            label: "Description",
            type: "textarea" as const,
            required: true,
          },
          {
            name: "price",
            label: "Price",
            type: "number" as const,
            required: true,
          },
          {
            name: "category",
            label: "Category",
            type: "select" as const,
            required: true,
            options: [
              { value: "Electronics", label: "Electronics" },
              { value: "Clothing", label: "Clothing" },
              { value: "Wearables", label: "Wearables" },
              { value: "Home & Garden", label: "Home & Garden" },
            ],
          },
          {
            name: "status",
            label: "Status",
            type: "select" as const,
            required: true,
            options: [
              { value: "in_stock", label: "In Stock" },
              { value: "low_stock", label: "Low Stock" },
              { value: "out_of_stock", label: "Out of Stock" },
            ],
          },
          {
            name: "stock",
            label: "Stock",
            type: "number" as const,
            required: true,
          },
          { name: "brand", label: "Brand", type: "text" as const },
          { name: "sku", label: "SKU", type: "text" as const },
        ];

      default:
        return [];
    }
  };

  const formFields = getFormFields();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEdit && actualId) {
        await service.update(actualId, formData);
      } else {
        await service.create(formData);
      }

      navigate(`/${resourceName}`);
    } catch (error) {
      console.error("Error saving data:", error);
      setErrors({ general: "Failed to save data" });
    } finally {
      setLoading(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear field error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(e);
    }
  };

  const getResourceIcon = () => {
    switch (resourceName) {
      case "users":
        return <User className="w-6 h-6" />;
      case "posts":
        return <FileText className="w-6 h-6" />;
      case "products":
        return <Package className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {getResourceIcon()}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit" : "Create"} {resource.label}
            </h1>
            <p className="text-gray-600">
              {isEdit
                ? "Update the information below"
                : "Fill in the information below"}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/${resourceName}`)}>
          <X className="mr-2 w-4 h-4" />
          Cancel
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSave} className="p-6">
          {errors.general && (
            <div className="p-3 mb-4 bg-red-50 rounded-md border border-red-200">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {formFields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name] || ""}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
              />
            ))}
          </div>

          <div className="flex justify-end mt-8 space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${resourceName}`)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              <Save className="mr-2 w-4 h-4" />
              {isEdit ? "Update" : "Create"} {resource.label}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
