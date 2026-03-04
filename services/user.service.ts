import { API } from '@/constants/api'
import type { User } from '@/types/api/user'

interface UsersResponse {
    users: User[]
}

export const userService = {
    async getUsers() {
        const { $api } = useNuxtApp()

        const { data } = await $api.get<UsersResponse>(API.USERS)

        return data.users
    }
}