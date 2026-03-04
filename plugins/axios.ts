// plugins/axios.ts
import axios from 'axios'
import type { AxiosInstance } from 'axios'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api: AxiosInstance = axios.create({
        baseURL: config.public.apiBase as string,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
    })

    api.interceptors.request.use(
        (req) => {
            // ✅ 토큰/세션스토리지 로직은 여기에 그대로 두면 됨
            // ex) const token = sessionStorage.getItem('token')
            // if (token) req.headers.Authorization = `Bearer ${token}`
            return req
        },
        (error) => Promise.reject(error)
    )

    api.interceptors.response.use(
        (res) => res,
        (error) => Promise.reject(error)
    )

    return {
        provide: { api },
    }
})

// ✅ 타입 확장(중요)
declare module '#app' {
    interface NuxtApp {
        $api: AxiosInstance
    }
}