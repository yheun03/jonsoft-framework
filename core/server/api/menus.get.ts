import type { Menu } from '~/core/types/api/menu'
import { ROUTE_LABEL_MAP } from '~/core/router/route-meta'

function createMenus(): Menu[] {
    const baseMenus: Menu[] = [
        { id: 'MENU_010000', depth: 1, order: 1, label: '메인', labelKey: 'nav.home', to: '/', newTab: false },
        { id: 'MENU_010100', depth: 1, order: 2, label: '워크스페이스', labelKey: 'nav.workspace', to: '/workspace', newTab: false },
        { id: 'MENU_020000', depth: 1, order: 3, label: '데모', labelKey: 'nav.demos', to: '', newTab: false },
        { id: 'MENU_030000', depth: 1, order: 4, label: '설정', labelKey: 'nav.settings', to: '/settings', newTab: false },
    ]

    const demoRoutes = Object.entries(ROUTE_LABEL_MAP)
        .filter(([path]) => path.startsWith('/demos/'))
        .sort(([a], [b]) => a.localeCompare(b))

    const demoLabelKeyMap: Record<string, string> = {
        '/demos/demo-button': 'nav.demo.button',
        '/demos/demo-input': 'nav.demo.input',
        '/demos/demo-grid': 'nav.demo.grid',
        '/demos/demo-chart': 'nav.demo.chart',
        '/demos/demo-progress': 'nav.demo.progress',
        '/demos/demo-datepicker': 'nav.demo.datepicker',
        '/demos/demo-select': 'nav.demo.select',
        '/demos/demo-choice': 'nav.demo.choice',
        '/demos/demo-upload-image': 'nav.demo.uploadImage',
        '/demos/demo-modal': 'nav.demo.modal',
    }

    const demoMenus: Menu[] = demoRoutes.map(([to, label], index) => ({
        id: `MENU_02${String(index + 1).padStart(4, '0')}`,
        depth: 2,
        order: index + 1,
        label,
        labelKey: demoLabelKeyMap[to],
        to,
        newTab: false,
    }))

    return [...baseMenus, ...demoMenus]
}

export default defineEventHandler(() => {
    return { menus: createMenus() }
})
