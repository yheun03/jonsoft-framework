import { useApiClient } from '~/core/infrastructure/http/useApiClient';

export const useApi = () => {
    return useApiClient();
};
