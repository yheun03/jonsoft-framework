import type { MutableNavMenu, NavMenu } from './nav.types'

export function buildMenuTree(items: readonly NavMenu[]): MutableNavMenu[] {
    const root: MutableNavMenu[] = []
    const stack: MutableNavMenu[] = []

    for (const item of items) {
        const node: MutableNavMenu = {
            ...item,
            children: item.children ? buildMenuTree(item.children) : undefined,
        }

        while (stack.length && stack[stack.length - 1].depth >= node.depth) {
            stack.pop()
        }

        const parent = stack[stack.length - 1]
        if (parent) {
            ; (parent.children ||= []).push(node)
        } else {
            root.push(node)
        }

        stack.push(node)
    }

    return sortMenuTree(root)
}

export function sortMenuTree(nodes: MutableNavMenu[]): MutableNavMenu[] {
    return [...nodes]
        .sort((a, b) => a.order - b.order)
        .map((node) => ({
            ...node,
            children: node.children ? sortMenuTree(node.children) : undefined,
        }))
}

export function createFlatNavMenus(demoMenus: { path: string; label: string }[]): NavMenu[] {
    const flatMenus: NavMenu[] = [
        { id: 'MENU_010000', depth: 1, order: 1, label: '메인', to: '/', newTab: false },
        { id: 'MENU_010100', depth: 1, order: 2, label: '워크스페이스', to: '/workspace', newTab: false },
        { id: 'MENU_020000', depth: 1, order: 3, label: '데모', to: '', newTab: false },
    ]

    demoMenus.forEach((menu, index) => {
        flatMenus.push({
            id: `MENU_02${String(index + 1).padStart(4, '0')}`,
            depth: 2,
            order: index + 1,
            label: menu.label,
            to: menu.path,
            newTab: false,
        })
    })

    return flatMenus
}
