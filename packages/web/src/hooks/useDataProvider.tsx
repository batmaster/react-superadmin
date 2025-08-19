import { useContext, createContext, ReactNode } from 'react';
import { DataProvider } from '@react-superadmin/core';
import {
  dataProviderFactory,
  DataProviderConfig,
} from '../dataProviders/dataProviderFactory';

interface DataProviderContextValue {
  dataProvider: DataProvider;
  switchProvider: (config: DataProviderConfig) => void;
  getConfig: () => DataProviderConfig;
}

const DataProviderContext = createContext<DataProviderContextValue | undefined>(
  undefined
);

interface DataProviderProviderProps {
  children: ReactNode;
  initialConfig?: DataProviderConfig;
}

export const DataProviderProvider: React.FC<DataProviderProviderProps> = ({
  children,
  initialConfig,
}) => {
  // Initialize with initial config if provided
  if (initialConfig) {
    dataProviderFactory.switchProvider(initialConfig);
  }

  const value: DataProviderContextValue = {
    dataProvider: dataProviderFactory.getProvider(),
    switchProvider: (config: DataProviderConfig) => {
      dataProviderFactory.switchProvider(config);
    },
    getConfig: () => dataProviderFactory.getConfig(),
  };

  return (
    <DataProviderContext.Provider value={value}>
      {children}
    </DataProviderContext.Provider>
  );
};

export const useDataProvider = (): DataProviderContextValue => {
  const context = useContext(DataProviderContext);

  if (context === undefined) {
    throw new Error(
      'useDataProvider must be used within a DataProviderProvider'
    );
  }

  return context;
};

// Convenience hook for getting just the data provider
export const useDataProviderInstance = (): DataProvider => {
  const { dataProvider } = useDataProvider();
  return dataProvider;
};
