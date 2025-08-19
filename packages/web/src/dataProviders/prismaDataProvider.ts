// Stub Prisma Data Provider for demo purposes
// This file provides a placeholder implementation that can be replaced with actual Prisma integration
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
} from "@react-superadmin/core";

// Stub implementation that returns mock data
export const prismaDataProvider: DataProvider = {
  getList: async (): Promise<ListResponse> => {
    // Return empty mock data
    return {
      data: [],
      total: 0,
      page: 1,
      perPage: 10,
      totalPages: 0,
    };
  },

  getOne: async () => {
    throw new Error(
      "Prisma data provider not implemented - use mock provider instead",
    );
  },

  getMany: async () => {
    throw new Error(
      "Prisma data provider not implemented - use mock provider instead",
    );
  },

  getManyReference: async () => {
    throw new Error(
      "Prisma data provider not implemented - use mock provider instead",
    );
  },

  create: async () => {
    throw new Error(
      "Prisma data provider not implemented - use mock provider instead",
    );
  },

  update: async () => {
    throw new Error(
      "Prisma data provider not implemented - use mock provider instead",
    );
  },

  updateMany: async () => {
    throw new Error(
      "Prisma data provider not implemented - use mock provider instead",
    );
  },

  delete: async () => {
    throw new Error(
      "Prisma data provider not implemented - use mock provider instead",
    );
  },

  deleteMany: async () => {
    throw new Error(
      "Prisma data provider not implemented - use mock provider instead",
    );
  },
};
