import { mockUsers, mockPosts, mockProducts } from "../data/mockData";
import { ListParams, ListResponse } from "@react-superadmin/core";

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem("react-superadmin-users")) {
    localStorage.setItem("react-superadmin-users", JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem("react-superadmin-posts")) {
    localStorage.setItem("react-superadmin-posts", JSON.stringify(mockPosts));
  }
  if (!localStorage.getItem("react-superadmin-products")) {
    localStorage.setItem(
      "react-superadmin-products",
      JSON.stringify(mockProducts),
    );
  }
};

// Generic CRUD operations
export class MockService<T extends { id: string | number }> {
  private storageKey: string;
  private data: T[];

  constructor(storageKey: string, initialData: T[]) {
    this.storageKey = storageKey;
    this.data = this.loadData(initialData);
  }

  private loadData(initialData: T[]): T[] {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock data
    localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    return initialData;
  }

  private saveData(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  async list(params?: ListParams): Promise<ListResponse<T>> {
    let filteredData = [...this.data];

    // Apply search
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchLower),
        ),
      );
    }

    // Apply filters
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          filteredData = filteredData.filter(
            (item) => item[key as keyof T] === value,
          );
        }
      });
    }

    // Apply sorting
    if (params?.sort) {
      filteredData.sort((a, b) => {
        const aValue = a[params.sort as keyof T];
        const bValue = b[params.sort as keyof T];

        if (aValue < bValue) return params.order === "asc" ? -1 : 1;
        if (aValue > bValue) return params.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    const total = filteredData.length;
    const page = params?.page || 1;
    const perPage = params?.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async read(id: string | number): Promise<T> {
    const item = this.data.find((item) => item.id === id);
    if (!item) {
      throw new Error("Item not found");
    }
    return item;
  }

  async create(data: Partial<T>): Promise<T> {
    const newItem = {
      ...data,
      id: String(Date.now()), // Generate unique ID
    } as T;

    this.data.push(newItem);
    this.saveData();
    return newItem;
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Item not found");
    }

    const updatedItem = { ...this.data[index], ...data };
    this.data[index] = updatedItem;
    this.saveData();
    return updatedItem;
  }

  async delete(id: string | number): Promise<void> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Item not found");
    }

    this.data.splice(index, 1);
    this.saveData();
  }
}

// Initialize storage
initializeStorage();

// Create service instances
export const userService = new MockService("react-superadmin-users", mockUsers);
export const postService = new MockService("react-superadmin-posts", mockPosts);
export const productService = new MockService(
  "react-superadmin-products",
  mockProducts,
);

// Export service types
export type User = (typeof mockUsers)[0];
export type Post = (typeof mockPosts)[0];
export type Product = (typeof mockProducts)[0];
