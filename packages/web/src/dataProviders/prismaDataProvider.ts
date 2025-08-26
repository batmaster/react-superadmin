// In docs/SSR environments, '@prisma/client' may be stubbed without named exports
// so import the default and read PrismaClient off it when available.
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as PrismaModule from "@prisma/client";
const PrismaClient =
  (PrismaModule as any).PrismaClient ??
  (PrismaModule as any).default?.PrismaClient;
import {
  CreateParams,
  DataProvider,
  DataProviderParams,
  DeleteManyParams,
  DeleteParams,
  GetManyParams,
  GetManyReferenceParams,
  GetOneParams,
  ListResponse,
  UpdateManyParams,
  UpdateParams,
} from "@react-superadmin/core";

// Initialize Prisma client with Neon database
// Fallback no-op client during docs build if PrismaClient is absent
const prisma = PrismaClient
  ? new PrismaClient({
      datasources: {
        db: {
          url:
            typeof window === "undefined"
              ? process.env.DATABASE_URL || "postgres://localhost/disabled"
              : "postgres://localhost/browser",
        },
      },
    } as any)
  : (new Proxy(
      {},
      {
        get: () => () => {
          throw new Error("Prisma client unavailable in this environment");
        },
      },
    ) as any);

// Resource field mappings for Prisma
const resourceFields: Record<string, string[]> = {
  users: [
    "id",
    "name",
    "email",
    "role",
    "status",
    "createdAt",
    "updatedAt",
    "avatar",
    "phone",
    "department",
    "lastLogin",
  ],
  posts: [
    "id",
    "title",
    "content",
    "authorId",
    "status",
    "publishedAt",
    "tags",
    "category",
    "readTime",
    "views",
    "likes",
    "createdAt",
    "updatedAt",
  ],
  products: [
    "id",
    "name",
    "description",
    "price",
    "category",
    "inStock",
    "stock",
    "rating",
    "image",
    "createdAt",
    "updatedAt",
  ],
  categories: ["id", "name", "description", "createdAt", "updatedAt"],
};

// Helper function to build Prisma where clause from filters
const buildWhereClause = (filters: Record<string, any>): any => {
  const where: any = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "string") {
        where[key] = {
          contains: value,
          mode: "insensitive",
        };
      } else if (Array.isArray(value)) {
        where[key] = {
          in: value,
        };
      } else {
        where[key] = value;
      }
    }
  });

  return where;
};

// Helper function to build Prisma orderBy clause from sort
const buildOrderByClause = (sort?: {
  field: string;
  order: "ASC" | "DESC";
}): any => {
  if (!sort) return undefined;

  return {
    [sort.field]: sort.order.toLowerCase(),
  };
};

// Helper function to build Prisma select clause
const buildSelectClause = (resource: string): any => {
  const fields = resourceFields[resource] || ["id"];
  const select: any = {};

  fields.forEach((field) => {
    select[field] = true;
  });

  return select;
};

export const prismaDataProvider: DataProvider = {
  getList: async (
    resource: string,
    params: DataProviderParams,
  ): Promise<ListResponse> => {
    const { pagination, sort, filter, search } = params;
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 10;
    const skip = (page - 1) * perPage;

    // Build where clause
    let where = buildWhereClause(filter || {});

    // Add search functionality
    if (search) {
      const searchFields = resourceFields[resource] || ["id"];
      const searchConditions = searchFields
        .filter(
          (field) =>
            field !== "id" && field !== "createdAt" && field !== "updatedAt",
        )
        .map((field) => ({
          [field]: {
            contains: search,
            mode: "insensitive",
          },
        }));

      if (searchConditions.length > 0) {
        where = {
          OR: searchConditions,
        };
      }
    }

    // Build orderBy clause
    const orderBy = buildOrderByClause(sort);

    // Build select clause
    const select = buildSelectClause(resource);

    try {
      // Get data with pagination
      const [data, total] = await Promise.all([
        (prisma[resource as keyof PrismaClient] as any).findMany({
          where,
          orderBy,
          select,
          skip,
          take: perPage,
        }),
        (prisma[resource as keyof PrismaClient] as any).count({ where }),
      ]);

      return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      };
    } catch (error) {
      console.error(`Error fetching ${resource} list:`, error);
      throw new Error(
        `Failed to fetch ${resource} list: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  getOne: async (
    resource: string,
    params: GetOneParams,
  ): Promise<{ data: any }> => {
    const { id } = params;
    const select = buildSelectClause(resource);

    try {
      const data = await (
        prisma[resource as keyof PrismaClient] as any
      ).findUnique({
        where: { id: String(id) },
        select,
      });

      if (!data) {
        throw new Error(`${resource} with id ${id} not found`);
      }

      return { data };
    } catch (error) {
      console.error(`Error fetching ${resource} with id ${id}:`, error);
      throw new Error(
        `Failed to fetch ${resource}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  getMany: async (
    resource: string,
    params: GetManyParams,
  ): Promise<{ data: any[] }> => {
    const { ids } = params;
    const select = buildSelectClause(resource);

    try {
      const data = await (
        prisma[resource as keyof PrismaClient] as any
      ).findMany({
        where: {
          id: {
            in: ids.map((id) => String(id)),
          },
        },
        select,
      });

      return { data };
    } catch (error) {
      console.error(`Error fetching ${resource} with ids ${ids}:`, error);
      throw new Error(
        `Failed to fetch ${resource}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams,
  ): Promise<ListResponse> => {
    const { target, id, pagination, sort, filter, search } = params;
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 10;
    const skip = (page - 1) * perPage;

    // Build where clause with reference filter
    let where = {
      ...buildWhereClause(filter || {}),
      [target]: String(id),
    };

    // Add search functionality
    if (search) {
      const searchFields = resourceFields[resource] || ["id"];
      const searchConditions = searchFields
        .filter(
          (field) =>
            field !== "id" && field !== "createdAt" && field !== "updatedAt",
        )
        .map((field) => ({
          [field]: {
            contains: search,
            mode: "insensitive",
          },
        }));

      if (searchConditions.length > 0) {
        where = {
          ...where,
          OR: searchConditions,
        };
      }
    }

    // Build orderBy clause
    const orderBy = buildOrderByClause(sort);

    // Build select clause
    const select = buildSelectClause(resource);

    try {
      // Get data with pagination
      const [data, total] = await Promise.all([
        (prisma[resource as keyof PrismaClient] as any).findMany({
          where,
          orderBy,
          select,
          skip,
          take: perPage,
        }),
        (prisma[resource as keyof PrismaClient] as any).count({ where }),
      ]);

      return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      };
    } catch (error) {
      console.error(
        `Error fetching ${resource} reference for ${target} ${id}:`,
        error,
      );
      throw new Error(
        `Failed to fetch ${resource} reference: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  create: async (
    resource: string,
    params: CreateParams,
  ): Promise<{ data: any }> => {
    const { data } = params;
    const select = buildSelectClause(resource);

    try {
      const createdData = await (
        prisma[resource as keyof PrismaClient] as any
      ).create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select,
      });

      return { data: createdData };
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      throw new Error(
        `Failed to create ${resource}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  update: async (
    resource: string,
    params: UpdateParams,
  ): Promise<{ data: any }> => {
    const { id, data } = params;
    const select = buildSelectClause(resource);

    try {
      const updatedData = await (
        prisma[resource as keyof PrismaClient] as any
      ).update({
        where: { id: String(id) },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        select,
      });

      return { data: updatedData };
    } catch (error) {
      console.error(`Error updating ${resource} with id ${id}:`, error);
      throw new Error(
        `Failed to update ${resource}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  updateMany: async (
    resource: string,
    params: UpdateManyParams,
  ): Promise<{ data: (string | number)[] }> => {
    const { ids, data } = params;

    try {
      const result = await (
        prisma[resource as keyof PrismaClient] as any
      ).updateMany({
        where: {
          id: {
            in: ids.map((id) => String(id)),
          },
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return { data: ids };
    } catch (error) {
      console.error(`Error updating many ${resource}:`, error);
      throw new Error(
        `Failed to update many ${resource}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  delete: async (
    resource: string,
    params: DeleteParams,
  ): Promise<{ data: any }> => {
    const { id } = params;
    const select = buildSelectClause(resource);

    try {
      const deletedData = await (
        prisma[resource as keyof PrismaClient] as any
      ).delete({
        where: { id: String(id) },
        select,
      });

      return { data: deletedData };
    } catch (error) {
      console.error(`Error deleting ${resource} with id ${id}:`, error);
      throw new Error(
        `Failed to delete ${resource}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  deleteMany: async (
    resource: string,
    params: DeleteManyParams,
  ): Promise<{ data: (string | number)[] }> => {
    const { ids } = params;

    try {
      const result = await (
        prisma[resource as keyof PrismaClient] as any
      ).deleteMany({
        where: {
          id: {
            in: ids.map((id) => String(id)),
          },
        },
      });

      return { data: ids };
    } catch (error) {
      console.error(`Error deleting many ${resource}:`, error);
      throw new Error(
        `Failed to delete many ${resource}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
};

// Graceful shutdown
if (typeof process !== "undefined" && process?.on) {
  process.on("beforeExit", async () => {
    if (typeof prisma.$disconnect === "function") {
      await prisma.$disconnect();
    }
  });
}
