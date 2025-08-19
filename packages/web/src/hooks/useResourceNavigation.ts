import { useNavigate, useParams } from 'react-router-dom';
import { useSuperAdmin } from '@react-superadmin/core';

export function useResourceNavigation() {
  const navigate = useNavigate();
  const { resourceName } = useParams();
  const { resources } = useSuperAdmin();

  const navigateToList = () => {
    if (resourceName) {
      navigate(`/${resourceName}`);
    }
  };

  const navigateToCreate = () => {
    if (resourceName) {
      navigate(`/${resourceName}/create`);
    }
  };

  const navigateToShow = (id: string | number) => {
    if (resourceName) {
      navigate(`/${resourceName}/${id}`);
    }
  };

  const navigateToEdit = (id: string | number) => {
    if (resourceName) {
      navigate(`/${resourceName}/${id}/edit`);
    }
  };

  const navigateToResource = (newResourceName: string) => {
    navigate(`/${newResourceName}`);
  };

  return {
    resourceName,
    resources,
    navigateToList,
    navigateToCreate,
    navigateToShow,
    navigateToEdit,
    navigateToResource,
  };
}
