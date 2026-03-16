// types/api/user.ts
export interface User {
    id: number
    name: string
    email?: string
    [key: string]: unknown
}