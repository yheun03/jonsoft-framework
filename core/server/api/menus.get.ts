import type { Menu } from '~/core/types/api/menu'
import { ROUTE_LABEL_MAP } from '~/core/router/route-meta'

function createMenus(): Menu[] {
    const baseMenus: Menu[] = [
        { id: 'MENU_010000', depth: 1, order: 1, label: '메인', to: '/', newTab: false },
        { id: 'MENU_010100', depth: 1, order: 2, label: '워크스페이스', to: '/workspace', newTab: false },
        { id: 'MENU_020000', depth: 1, order: 3, label: '데모', to: '', newTab: false },
    ]

    const demoRoutes = Object.entries(ROUTE_LABEL_MAP)
        .filter(([path]) => path.startsWith('/demos/'))
        .sort(([a], [b]) => a.localeCompare(b))

    const demoMenus: Menu[] = demoRoutes.map(([to, label], index) => ({
        id: `MENU_02${String(index + 1).padStart(4, '0')}`,
        depth: 2,
        order: index + 1,
        label,
        to,
        newTab: false,
    }))

    return [...baseMenus, ...demoMenus]
}

export default defineEventHandler(() => {
    return { menus: createMenus() }
})
