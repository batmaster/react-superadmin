import { DataProviderConfig } from '../dataProviders/dataProviderFactory';

// Environment-based configuration
const getEnvironmentConfig = (): DataProviderConfig => {
  const env = process.env.NODE_ENV || 'development';
  const dataProviderType = process.env.REACT_APP_DATA_PROVIDER || 'mock';

  switch (env) {
    case 'production':
      return {
        type: 'prisma',
        options: {
          enableLogging: false,
          enableCaching: true,
        },
      };

    case 'test':
      return {
        type: 'mock',
        options: {
          enableLocalStorage: false,
          enableLogging: false,
          enableCaching: false,
        },
      };

    case 'development':
    default:
      return {
        type: dataProviderType as 'mock' | 'prisma',
        options: {
          enableLocalStorage: true,
          enableLogging: true,
          enableCaching: false,
        },
      };
  }
};

// Configuration presets
export const dataProviderPresets: Record<string, DataProviderConfig> = {
  development: {
    type: 'mock',
    options: {
      enableLocalStorage: true,
      enableLogging: true,
      enableCaching: false,
    },
  },

  production: {
    type: 'prisma',
    options: {
      enableLogging: false,
      enableCaching: true,
    },
  },

  testing: {
    type: 'mock',
    options: {
      enableLocalStorage: false,
      enableLogging: false,
      enableCaching: false,
    },
  },

  mock: {
    type: 'mock',
    options: {
      enableLocalStorage: true,
      enableLogging: process.env.NODE_ENV === 'development',
      enableCaching: false,
    },
  },

  prisma: {
    type: 'prisma',
    options: {
      enableLogging: process.env.NODE_ENV === 'development',
      enableCaching: true,
    },
  },
};

// Get current configuration
export const getCurrentConfig = (): DataProviderConfig => {
  return getEnvironmentConfig();
};

// Validate configuration
export const validateConfig = (config: DataProviderConfig): boolean => {
  if (!config.type) {
    console.error('Data provider type is required');
    return false;
  }

  if (!['mock', 'prisma'].includes(config.type)) {
    console.error(`Invalid data provider type: ${config.type}`);
    return false;
  }

  if (config.type === 'prisma' && !process.env.DATABASE_URL) {
    console.warn(
      'DATABASE_URL environment variable is not set for Prisma data provider'
    );
  }

  return true;
};

// Export default configuration
export const defaultConfig = getCurrentConfig();
