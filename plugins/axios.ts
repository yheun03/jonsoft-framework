import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const axiosInstance = axios.create({
        baseURL: config.public.apiBase as string,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    // 요청 인터셉터
    axiosInstance.interceptors.request.use(
        (config) => {
            // 토큰 등 인증 정보 추가 가능
            return config
        },
        (error) => Promise.reject(error)
    )

    // 응답 인터셉터
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            // 에러 핸들링 (401, 403 등)
            return Promise.reject(error)
        }
    )

    return {
        provide: {
            axios: axiosInstance,
        },
    }
})
