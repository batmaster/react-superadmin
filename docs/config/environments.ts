// Environment configuration for different deployment targets
export interface EnvironmentConfig {
  name: string;
  url: string;
  firebaseProjectId: string;
  firebaseSiteId: string; // Changed from firebaseChannelId
  isProduction: boolean;
  isPreview: boolean;
  isLocal: boolean;
}

// Environment detection
const isCI = process.env.CI === 'true';
const isPreview =
  process.env.GITHUB_REF && !process.env.GITHUB_REF.includes('refs/heads/main');
const isProduction = process.env.GITHUB_REF === 'refs/heads/main';
const isLocal = !isCI && !isPreview && !isProduction;

// Environment configurations - Using single Firebase project with different sites
export const environments: Record<string, EnvironmentConfig> = {
  production: {
    name: 'Production',
    url: 'https://react-superadmin.web.app',
    firebaseProjectId: 'react-superadmin',
    firebaseSiteId: 'react-superadmin', // Main site
    isProduction: true,
    isPreview: false,
    isLocal: false,
  },
  preview: {
    name: 'Preview',
    url: 'https://react-superadmin-preview.web.app', // Separate preview URL
    firebaseProjectId: 'react-superadmin',
    firebaseSiteId: 'react-superadmin-preview', // Preview site
    isProduction: false,
    isPreview: true,
    isLocal: false,
  },
  staging: {
    name: 'Staging',
    url: 'https://react-superadmin-staging.web.app', // Separate staging URL
    firebaseProjectId: 'react-superadmin',
    firebaseSiteId: 'react-superadmin-staging', // Staging site
    isProduction: false,
    isPreview: false,
    isLocal: false,
  },
  local: {
    name: 'Local Development',
    url: 'http://localhost:3000',
    firebaseProjectId: 'react-superadmin',
    firebaseSiteId: 'react-superadmin', // Use main site for local
    isProduction: false,
    isPreview: false,
    isLocal: true,
  },
};

// Get current environment
export const getCurrentEnvironment = (): EnvironmentConfig => {
  if (isProduction) {
    return environments.production;
  } else if (isCI || isPreview) {
    return environments.preview;
  } else {
    return environments.local;
  }
};

// Get environment-specific Firebase project ID
export const getFirebaseProjectId = (): string => {
  return getCurrentEnvironment().firebaseProjectId;
};

// Get environment-specific Firebase site ID
export const getFirebaseSiteId = (): string => {
  return getCurrentEnvironment().firebaseSiteId;
};

// Get environment-specific URL
export const getEnvironmentUrl = (): string => {
  return getCurrentEnvironment().url;
};
