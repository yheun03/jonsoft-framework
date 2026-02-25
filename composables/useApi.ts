/**
 * API 호출을 위한 composable
 * $axios 플러그인을 활용한 래퍼
 */
export const useApi = () => {
  const { $axios } = useNuxtApp()

  return {
    get: <T>(url: string, config?: object) =>
      $axios.get<T>(url, config),
    post: <T>(url: string, data?: object, config?: object) =>
      $axios.post<T>(url, data, config),
    put: <T>(url: string, data?: object, config?: object) =>
      $axios.put<T>(url, data, config),
    delete: <T>(url: string, config?: object) =>
      $axios.delete<T>(url, config),
  }
}
