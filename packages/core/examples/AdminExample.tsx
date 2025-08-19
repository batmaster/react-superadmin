import React from "react";
import { Admin, AdminConfig } from "../src";

// Example configuration for the admin application
const exampleConfig: AdminConfig = {
  title: "My Admin Panel",
  resources: [
    {
      name: "users",
      label: "Users",
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
        },
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            { value: "admin", label: "Administrator" },
            { value: "user", label: "User" },
            { value: "moderator", label: "Moderator" },
          ],
        },
      ],
    },
    {
      name: "products",
      label: "Products",
      fields: [
        {
          name: "name",
          label: "Product Name",
          type: "text",
          required: true,
        },
        {
          name: "price",
          label: "Price",
          type: "number",
          required: true,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: [
            { value: "electronics", label: "Electronics" },
            { value: "clothing", label: "Clothing" },
            { value: "books", label: "Books" },
          ],
        },
      ],
    },
  ],
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

// Example component that demonstrates the Admin component usage
export const AdminExample: React.FC = () => {
  return (
    <Admin config={exampleConfig}>
      <div style={{ padding: "20px" }}>
        <h1>Welcome to {exampleConfig.title}</h1>
        <p>This is an example of how to use the Admin component.</p>

        <div style={{ marginTop: "20px" }}>
          <h2>Available Resources:</h2>
          <ul>
            {exampleConfig.resources.map((resource) => (
              <li key={resource.name}>
                <strong>{resource.label}</strong> ({resource.name})
                <ul>
                  {resource.fields.map((field) => (
                    <li key={field.name}>
                      {field.label} - {field.type}
                      {field.required && (
                        <span style={{ color: "red" }}> *</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h2>Configuration Details:</h2>
          <p>
            <strong>Theme:</strong> Primary color:{" "}
            {exampleConfig.theme?.primaryColor}
          </p>
          <p>
            <strong>Layout:</strong> Sidebar:{" "}
            {exampleConfig.layout?.sidebar ? "Yes" : "No"}
          </p>
          <p>
            <strong>Authentication:</strong>{" "}
            {exampleConfig.auth?.enabled ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>
    </Admin>
  );
};

export default AdminExample;
