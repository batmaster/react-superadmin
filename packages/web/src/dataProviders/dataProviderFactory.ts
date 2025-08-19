import { DataProvider } from '@react-superadmin/core';
import { mockDataProvider } from '@react-superadmin/core';
import { prismaDataProvider } from './prismaDataProvider';

export type DataProviderType = 'mock' | 'prisma';

export interface DataProviderConfig {
  type: DataProviderType;
  options?: {
    // Prisma-specific options
    databaseUrl?: string;
    // Mock-specific options
    enableLocalStorage?: boolean;
    // General options
    enableLogging?: boolean;
    enableCaching?: boolean;
  };
}

export class DataProviderFactory {
  private static instance: DataProviderFactory;
  private currentProvider: DataProvider;
  private config: DataProviderConfig;

  private constructor(config: DataProviderConfig) {
    this.config = config;
    this.currentProvider = this.createProvider(config);
  }

  public static getInstance(config: DataProviderConfig): DataProviderFactory {
    if (!DataProviderFactory.instance) {
      DataProviderFactory.instance = new DataProviderFactory(config);
    }
    return DataProviderFactory.instance;
  }

  public static createProvider(config: DataProviderConfig): DataProvider {
    switch (config.type) {
      case 'mock':
        return mockDataProvider;
      case 'prisma':
        return prismaDataProvider;
      default:
        throw new Error(`Unknown data provider type: ${config.type}`);
    }
  }

  private createProvider(config: DataProviderConfig): DataProvider {
    const provider = DataProviderFactory.createProvider(config);

    // Add logging wrapper if enabled
    if (config.options?.enableLogging) {
      return this.wrapWithLogging(provider);
    }

    return provider;
  }

  private wrapWithLogging(provider: DataProvider): DataProvider {
    const loggedProvider: DataProvider = {
      getList: async (resource, params) => {
        console.log(`[DataProvider] getList: ${resource}`, params);
        try {
          const result = await provider.getList(resource, params);
          console.log(`[DataProvider] getList: ${resource} success`, result);
          return result;
        } catch (error) {
          console.error(`[DataProvider] getList: ${resource} error`, error);
          throw error;
        }
      },
      getOne: async (resource, params) => {
        console.log(`[DataProvider] getOne: ${resource}`, params);
        try {
          const result = await provider.getOne(resource, params);
          console.log(`[DataProvider] getOne: ${resource} success`, result);
          return result;
        } catch (error) {
          console.error(`[DataProvider] getOne: ${resource} error`, error);
          throw error;
        }
      },
      getMany: async (resource, params) => {
        console.log(`[DataProvider] getMany: ${resource}`, params);
        try {
          const result = await provider.getMany(resource, params);
          console.log(`[DataProvider] getMany: ${resource} success`, result);
          return result;
        } catch (error) {
          console.error(`[DataProvider] getMany: ${resource} error`, error);
          throw error;
        }
      },
      getManyReference: async (resource, params) => {
        console.log(`[DataProvider] getManyReference: ${resource}`, params);
        try {
          const result = await provider.getManyReference(resource, params);
          console.log(
            `[DataProvider] getManyReference: ${resource} success`,
            result
          );
          return result;
        } catch (error) {
          console.error(
            `[DataProvider] getManyReference: ${resource} error`,
            error
          );
          throw error;
        }
      },
      create: async (resource, params) => {
        console.log(`[DataProvider] create: ${resource}`, params);
        try {
          const result = await provider.create(resource, params);
          console.log(`[DataProvider] create: ${resource} success`, result);
          return result;
        } catch (error) {
          console.error(`[DataProvider] create: ${resource} error`, error);
          throw error;
        }
      },
      update: async (resource, params) => {
        console.log(`[DataProvider] update: ${resource}`, params);
        try {
          const result = await provider.update(resource, params);
          console.log(`[DataProvider] update: ${resource} success`, result);
          return result;
        } catch (error) {
          console.error(`[DataProvider] update: ${resource} error`, error);
          throw error;
        }
      },
      updateMany: async (resource, params) => {
        console.log(`[DataProvider] updateMany: ${resource}`, params);
        try {
          const result = await provider.updateMany(resource, params);
          console.log(`[DataProvider] updateMany: ${resource} success`, result);
          return result;
        } catch (error) {
          console.error(`[DataProvider] updateMany: ${resource} error`, error);
          throw error;
        }
      },
      delete: async (resource, params) => {
        console.log(`[DataProvider] delete: ${resource}`, params);
        try {
          const result = await provider.delete(resource, params);
          console.log(`[DataProvider] delete: ${resource} success`, result);
          return result;
        } catch (error) {
          console.error(`[DataProvider] delete: ${resource} error`, error);
          throw error;
        }
      },
      deleteMany: async (resource, params) => {
        console.log(`[DataProvider] deleteMany: ${resource}`, params);
        try {
          const result = await provider.deleteMany(resource, params);
          console.log(`[DataProvider] deleteMany: ${resource} success`, result);
          return result;
        } catch (error) {
          console.error(`[DataProvider] deleteMany: ${resource} error`, error);
          throw error;
        }
      },
    };

    return loggedProvider;
  }

  public getProvider(): DataProvider {
    return this.currentProvider;
  }

  public switchProvider(config: DataProviderConfig): void {
    this.config = config;
    this.currentProvider = this.createProvider(config);
  }

  public getConfig(): DataProviderConfig {
    return this.config;
  }
}

// Default configuration
export const defaultDataProviderConfig: DataProviderConfig = {
  type: 'mock',
  options: {
    enableLocalStorage: true,
    enableLogging: process.env.NODE_ENV === 'development',
    enableCaching: false,
  },
};

// Export factory instance
export const dataProviderFactory = DataProviderFactory.getInstance(
  defaultDataProviderConfig
);

// Export convenience function
export const getDataProvider = (): DataProvider => {
  return dataProviderFactory.getProvider();
};
