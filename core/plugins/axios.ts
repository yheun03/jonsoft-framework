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
            return req
        },
        (error) => Promise.reject(error),
    )

    api.interceptors.response.use(
        (res) => res,
        (error) => Promise.reject(error),
    )

    return {
        provide: { api },
    }
})

declare module '#app' {
    interface NuxtApp {
        $api: AxiosInstance
    }
}
