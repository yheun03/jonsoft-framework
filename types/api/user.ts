// types/api/user.ts
export interface User {
    id: number
    name: string
    email?: string
    [key: string]: unknown
}

export interface Purchase {
    id: number
    userId: number
    itemName: string
    price: number
    purchasedAt: string
    [key: string]: unknown
}