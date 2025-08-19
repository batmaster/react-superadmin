import { PrismaClient } from '@prisma/client';
import {
  DataProvider,
  DataProviderParams,
  GetOneParams,
  GetManyParams,
  GetManyReferenceParams,
  CreateParams,
  UpdateParams,
  UpdateManyParams,
  DeleteParams,
  DeleteManyParams,
  ListResponse,
} from '@react-superadmin/core';

// Initialize Prisma client
const prisma = new PrismaClient();

// Resource field mappings for Prisma
const resourceFields: Record<string, string[]> = {
  users: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
  posts: [
    'id',
    'title',
    'content',
    'authorId',
    'published',
    'createdAt',
    'updatedAt',
  ],
  products: [
    'id',
    'name',
    'price',
    'category',
    'inStock',
    'createdAt',
    'updatedAt',
  ],
  categories: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
};

// Helper function to build Prisma where clause from filters
const buildWhereClause = (filters: Record<string, any>): any => {
  const where: any = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string') {
        where[key] = {
          contains: value,
          mode: 'insensitive',
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
  order: 'ASC' | 'DESC';
}): any => {
  if (!sort) return undefined;

  return {
    [sort.field]: sort.order.toLowerCase(),
  };
};

// Helper function to build Prisma select clause
const buildSelectClause = (resource: string): any => {
  const fields = resourceFields[resource] || ['id'];
  const select: any = {};

  fields.forEach(field => {
    select[field] = true;
  });

  return select;
};

export const prismaDataProvider: DataProvider = {
  getList: async (
    resource: string,
    params: DataProviderParams
  ): Promise<ListResponse> => {
    const { pagination, sort, filter, search } = params;
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 10;
    const skip = (page - 1) * perPage;

    // Build where clause
    let where = buildWhereClause(filter || {});

    // Add search functionality
    if (search) {
      const searchFields = resourceFields[resource] || ['id'];
      const searchConditions = searchFields
        .filter(
          field =>
            field !== 'id' && field !== 'createdAt' && field !== 'updatedAt'
        )
        .map(field => ({
          [field]: {
            contains: search,
            mode: 'insensitive',
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
        prisma[resource as keyof PrismaClient].findMany({
          where,
          orderBy,
          select,
          skip,
          take: perPage,
        }),
        prisma[resource as keyof PrismaClient].count({ where }),
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
        `Failed to fetch ${resource} list: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  getOne: async (
    resource: string,
    params: GetOneParams
  ): Promise<{ data: any }> => {
    const { id } = params;
    const select = buildSelectClause(resource);

    try {
      const data = await prisma[resource as keyof PrismaClient].findUnique({
        where: { id: Number(id) },
        select,
      });

      if (!data) {
        throw new Error(`${resource} with id ${id} not found`);
      }

      return { data };
    } catch (error) {
      console.error(`Error fetching ${resource} with id ${id}:`, error);
      throw new Error(
        `Failed to fetch ${resource}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  getMany: async (
    resource: string,
    params: GetManyParams
  ): Promise<{ data: any[] }> => {
    const { ids } = params;
    const select = buildSelectClause(resource);

    try {
      const data = await prisma[resource as keyof PrismaClient].findMany({
        where: {
          id: {
            in: ids.map(id => Number(id)),
          },
        },
        select,
      });

      return { data };
    } catch (error) {
      console.error(`Error fetching ${resource} with ids ${ids}:`, error);
      throw new Error(
        `Failed to fetch ${resource}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams
  ): Promise<ListResponse> => {
    const { target, id, pagination, sort, filter, search } = params;
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 10;
    const skip = (page - 1) * perPage;

    // Build where clause with reference filter
    let where = {
      ...buildWhereClause(filter || {}),
      [target]: Number(id),
    };

    // Add search functionality
    if (search) {
      const searchFields = resourceFields[resource] || ['id'];
      const searchConditions = searchFields
        .filter(
          field =>
            field !== 'id' && field !== 'createdAt' && field !== 'updatedAt'
        )
        .map(field => ({
          [field]: {
            contains: search,
            mode: 'insensitive',
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
        prisma[resource as keyof PrismaClient].findMany({
          where,
          orderBy,
          select,
          skip,
          take: perPage,
        }),
        prisma[resource as keyof PrismaClient].count({ where }),
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
        error
      );
      throw new Error(
        `Failed to fetch ${resource} reference: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  create: async (
    resource: string,
    params: CreateParams
  ): Promise<{ data: any }> => {
    const { data } = params;
    const select = buildSelectClause(resource);

    try {
      const createdData = await prisma[resource as keyof PrismaClient].create({
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
        `Failed to create ${resource}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  update: async (
    resource: string,
    params: UpdateParams
  ): Promise<{ data: any }> => {
    const { id, data } = params;
    const select = buildSelectClause(resource);

    try {
      const updatedData = await prisma[resource as keyof PrismaClient].update({
        where: { id: Number(id) },
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
        `Failed to update ${resource}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  updateMany: async (
    resource: string,
    params: UpdateManyParams
  ): Promise<{ data: (string | number)[] }> => {
    const { ids, data } = params;

    try {
      const result = await prisma[resource as keyof PrismaClient].updateMany({
        where: {
          id: {
            in: ids.map(id => Number(id)),
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
        `Failed to update many ${resource}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  delete: async (
    resource: string,
    params: DeleteParams
  ): Promise<{ data: any }> => {
    const { id } = params;
    const select = buildSelectClause(resource);

    try {
      const deletedData = await prisma[resource as keyof PrismaClient].delete({
        where: { id: Number(id) },
        select,
      });

      return { data: deletedData };
    } catch (error) {
      console.error(`Error deleting ${resource} with id ${id}:`, error);
      throw new Error(
        `Failed to delete ${resource}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  deleteMany: async (
    resource: string,
    params: DeleteManyParams
  ): Promise<{ data: (string | number)[] }> => {
    const { ids } = params;

    try {
      const result = await prisma[resource as keyof PrismaClient].deleteMany({
        where: {
          id: {
            in: ids.map(id => Number(id)),
          },
        },
      });

      return { data: ids };
    } catch (error) {
      console.error(`Error deleting many ${resource}:`, error);
      throw new Error(
        `Failed to delete many ${resource}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
};

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
