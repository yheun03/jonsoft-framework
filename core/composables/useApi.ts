/**
 * API 호출을 위한 composable
 * $axios 플러그인을 활용한 래퍼
 */
export const useApi = () => {
    const { $api } = useNuxtApp();

    return {
        get: <T>(url: string, config?: object) => $api.get<T>(url, config),
        post: <T>(url: string, data?: object, config?: object) => $api.post<T>(url, data, config),
        put: <T>(url: string, data?: object, config?: object) => $api.put<T>(url, data, config),
        delete: <T>(url: string, config?: object) => $api.delete<T>(url, config),
    };
};
