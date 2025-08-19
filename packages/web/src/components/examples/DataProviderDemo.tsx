import React, { useState, useEffect } from 'react';
import { useDataProvider } from '../../hooks/useDataProvider';
import { dataProviderPresets } from '../../config/dataProviderConfig';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const DataProviderDemo: React.FC = () => {
  const { dataProvider, switchProvider, getConfig } = useDataProvider();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState(getConfig().type);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await dataProvider.getList<User>('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
        filter: {},
        search: '',
      });

      setUsers(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const newUser = await dataProvider.create<User>('users', {
        data: {
          name: `User ${Date.now()}`,
          email: `user${Date.now()}@example.com`,
          role: 'user',
          createdAt: new Date().toISOString().split('T')[0],
        },
      });

      // Refresh the list
      await fetchUsers();
      alert(`Created user: ${newUser.data.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const switchToMock = () => {
    switchProvider(dataProviderPresets.mock);
    setCurrentProvider('mock');
  };

  const switchToPrisma = () => {
    switchProvider(dataProviderPresets.prisma);
    setCurrentProvider('prisma');
  };

  useEffect(() => {
    fetchUsers();
  }, [currentProvider]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Data Provider Demo</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Current Provider: {currentProvider}
            </h3>
            <div className="space-x-2">
              <Button onClick={switchToMock} variant="outline">
                Switch to Mock
              </Button>
              <Button onClick={switchToPrisma} variant="outline">
                Switch to Prisma
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Users</h3>
              <Button onClick={createUser} disabled={loading}>
                Create User
              </Button>
            </div>

            <Button
              onClick={fetchUsers}
              disabled={loading}
              variant="outline"
              className="mb-4"
            >
              {loading ? 'Loading...' : 'Refresh Users'}
            </Button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Error: {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <div className="space-y-2">
                {users.map(user => (
                  <div key={user.id} className="border rounded p-3 bg-gray-50">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      Role: {user.role}
                    </div>
                    <div className="text-xs text-gray-400">
                      Created: {user.createdAt}
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              Provider Information
            </h4>
            <div className="text-sm text-blue-700">
              <p>
                <strong>Type:</strong> {getConfig().type}
              </p>
              <p>
                <strong>Logging:</strong>{' '}
                {getConfig().options?.enableLogging ? 'Enabled' : 'Disabled'}
              </p>
              <p>
                <strong>Local Storage:</strong>{' '}
                {getConfig().options?.enableLocalStorage
                  ? 'Enabled'
                  : 'Disabled'}
              </p>
              <p>
                <strong>Caching:</strong>{' '}
                {getConfig().options?.enableCaching ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
