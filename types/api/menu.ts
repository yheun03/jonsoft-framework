// types/api/menu.ts
export interface Menu {
    id: string
    label: string
    to: string
    order: number
    icon?: string
    newTab?: boolean
    depth: number
    children?: Menu[]
  }