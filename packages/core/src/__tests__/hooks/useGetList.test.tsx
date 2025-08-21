import { renderHook, waitFor } from "@testing-library/react";
import { useGetList } from "../../hooks/useGetList";
import { SuperAdminProvider } from "../../contexts/SuperAdminContext";
import { AdminConfig, createAdmin } from "../../utils";

// Mock data for testing
const mockData = [
  { id: 1, name: "User 1", email: "user1@example.com" },
  { id: 2, name: "User 2", email: "user2@example.com" },
  { id: 3, name: "User 3", email: "user3@example.com" },
];

const mockListResponse = {
  data: mockData,
  total: 3,
  page: 1,
  perPage: 10,
  totalPages: 1,
};

// Mock data provider
const mockDataProvider = {
  getList: jest.fn().mockResolvedValue(mockListResponse),
  getOne: jest.fn(),
  getMany: jest.fn(),
  getManyReference: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
};

// Mock admin config
const mockAdminConfig: AdminConfig = createAdmin({
  title: "Test Admin",
  resources: [],
  dataProvider: mockDataProvider,
});

// Wrapper component for testing
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SuperAdminProvider config={mockAdminConfig}>{children}</SuperAdminProvider>
);

describe("useGetList Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch data successfully with default parameters", async () => {
    const { result } = renderHook(
      () =>
        useGetList({
          resource: "users",
        }),
      { wrapper: TestWrapper },
    );

    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for data to be fetched
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check that data was fetched correctly
    expect(result.current.data).toEqual(mockListResponse);
    expect(result.current.error).toBe(null);
    expect(mockDataProvider.getList).toHaveBeenCalledWith("users", {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "id", order: "ASC" },
      filter: {},
    });
  });

  it("should fetch data with custom pagination", async () => {
    const { result } = renderHook(
      () =>
        useGetList({
          resource: "users",
          pagination: { page: 2, perPage: 5 },
        }),
      { wrapper: TestWrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith("users", {
      pagination: { page: 2, perPage: 5 },
      sort: { field: "id", order: "ASC" },
      filter: {},
    });
  });

  it("should fetch data with custom sorting", async () => {
    const { result } = renderHook(
      () =>
        useGetList({
          resource: "users",
          sort: { field: "name", order: "DESC" },
        }),
      { wrapper: TestWrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith("users", {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "name", order: "DESC" },
      filter: {},
    });
  });

  it("should fetch data with custom filters", async () => {
    const customFilter = { status: "active", role: "admin" };
    const { result } = renderHook(
      () =>
        useGetList({
          resource: "users",
          filter: customFilter,
        }),
      { wrapper: TestWrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith("users", {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "id", order: "ASC" },
      filter: customFilter,
    });
  });

  it("should handle errors gracefully", async () => {
    const mockError = new Error("Failed to fetch data");
    mockDataProvider.getList.mockRejectedValueOnce(mockError);

    const onError = jest.fn();
    const { result } = renderHook(
      () =>
        useGetList({
          resource: "users",
          onError,
        }),
      { wrapper: TestWrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBe(null);
    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it("should call onSuccess callback when data is fetched successfully", async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () =>
        useGetList({
          resource: "users",
          onSuccess,
        }),
      { wrapper: TestWrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(onSuccess).toHaveBeenCalledWith(mockListResponse);
  });

  it("should refetch data when refetch is called", async () => {
    const { result } = renderHook(
      () =>
        useGetList({
          resource: "users",
        }),
      { wrapper: TestWrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Reset mock to check if it's called again
    mockDataProvider.getList.mockClear();

    // Call refetch
    result.current.refetch();

    // Should be loading again
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have called getList again
    expect(mockDataProvider.getList).toHaveBeenCalledTimes(1);
  });

  it("should handle missing data provider", async () => {
    const adminConfigWithoutDataProvider = createAdmin({
      title: "Test Admin",
      resources: [],
    });

    const TestWrapperWithoutDataProvider: React.FC<{
      children: React.ReactNode;
    }> = ({ children }) => (
      <SuperAdminProvider config={adminConfigWithoutDataProvider}>
        {children}
      </SuperAdminProvider>
    );

    const { result } = renderHook(
      () =>
        useGetList({
          resource: "users",
        }),
      { wrapper: TestWrapperWithoutDataProvider },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(
      new Error("Data provider not available"),
    );
    expect(result.current.data).toBe(null);
  });

  it("should handle non-Error exceptions", async () => {
    const mockError = "String error";
    mockDataProvider.getList.mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () =>
        useGetList({
          resource: "users",
        }),
      { wrapper: TestWrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(new Error("Unknown error"));
    expect(result.current.data).toBe(null);
  });

  it("should combine all custom parameters correctly", async () => {
    const customOptions = {
      resource: "users",
      pagination: { page: 3, perPage: 20 },
      sort: { field: "email", order: "DESC" as const },
      filter: { status: "active" },
    };

    const { result } = renderHook(() => useGetList(customOptions), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockDataProvider.getList).toHaveBeenCalledWith("users", {
      pagination: { page: 3, perPage: 20 },
      sort: { field: "email", order: "DESC" },
      filter: { status: "active" },
    });
  });

  it("should maintain state between renders", async () => {
    const { result, rerender } = renderHook(
      () =>
        useGetList({
          resource: "users",
        }),
      { wrapper: TestWrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Rerender with same options
    rerender();

    // State should remain the same
    expect(result.current.data).toEqual(mockListResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
