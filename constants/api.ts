// constants/api.ts
export const API = {
    USERS: '/users',
    LINKS: '/links',
    USERS_WITH_PURCHASES: '/users-with-purchases',
    USER_PURCHASES: (id: number) => `/users/${id}/purchases`,
} as const