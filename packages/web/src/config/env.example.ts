// Example environment configuration
// Copy this file and rename it to env.ts, then update the values

export const envConfig = {
  // Data Provider Configuration
  // Choose between 'mock' and 'prisma'
  DATA_PROVIDER: 'mock' as const,

  // Database Configuration (for Prisma provider)
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://user:password@localhost:5432/mydb',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Feature flags
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
  ENABLE_CACHING: process.env.NODE_ENV === 'production',
  ENABLE_LOCAL_STORAGE: true,
};

// Usage example:
// import { envConfig } from './env';
// const dataProviderType = envConfig.DATA_PROVIDER;
