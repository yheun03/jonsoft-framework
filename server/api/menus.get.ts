import { ROUTE_LABEL_MAP } from '~/router/route-meta'

export default defineEventHandler(() => {
    const menus = Object.entries(ROUTE_LABEL_MAP).map(([to, label], index) => ({
        id: `MENU_${String(index + 1).padStart(6, '0')}`,
        depth: to.startsWith('/demos/') ? 2 : 1,
        order: index + 1,
        label,
        to,
        newTab: false,
    }))
    return { menus }
})
