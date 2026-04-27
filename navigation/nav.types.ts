export type NavMenu = {
    id: string
    label: string
    to: string
    order: number
    depth: number
    icon?: string
    newTab?: boolean
    children?: readonly NavMenu[]
}

export type MutableNavMenu = Omit<NavMenu, 'children'> & {
    children?: MutableNavMenu[]
}

export type NavAction = {
    label: string
    icon: string
}
