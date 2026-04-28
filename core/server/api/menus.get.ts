import type { NavigationMenu } from '~/core/domain/navigation/types';
type MenuEntity = {
    id: string;
    parentId: string | null;
    depth: number;
    order: number;
    to: string;
    labelKey: string;
    icon?: string;
    newTab?: boolean;
    isActive: boolean;
};

const MENU_SEED: MenuEntity[] = [
    { id: 'MENU_010000', parentId: null, depth: 1, order: 1, to: '/', labelKey: 'nav.home', isActive: true },
    {
        id: 'MENU_010100',
        parentId: null,
        depth: 1,
        order: 2,
        to: '/workspace',
        labelKey: 'nav.workspace',
        isActive: true,
    },
    { id: 'MENU_020000', parentId: null, depth: 1, order: 3, to: '', labelKey: 'nav.demos', isActive: true },
    {
        id: 'MENU_020001',
        parentId: 'MENU_020000',
        depth: 2,
        order: 1,
        to: '/demos/demo-button',
        labelKey: 'nav.demo.button',
        isActive: true,
    },
    {
        id: 'MENU_020002',
        parentId: 'MENU_020000',
        depth: 2,
        order: 2,
        to: '/demos/demo-input',
        labelKey: 'nav.demo.input',
        isActive: true,
    },
    {
        id: 'MENU_020003',
        parentId: 'MENU_020000',
        depth: 2,
        order: 3,
        to: '/demos/demo-grid',
        labelKey: 'nav.demo.grid',
        isActive: true,
    },
    {
        id: 'MENU_020004',
        parentId: 'MENU_020000',
        depth: 2,
        order: 4,
        to: '/demos/demo-chart',
        labelKey: 'nav.demo.chart',
        isActive: true,
    },
    {
        id: 'MENU_020005',
        parentId: 'MENU_020000',
        depth: 2,
        order: 5,
        to: '/demos/demo-progress',
        labelKey: 'nav.demo.progress',
        isActive: true,
    },
    {
        id: 'MENU_020006',
        parentId: 'MENU_020000',
        depth: 2,
        order: 6,
        to: '/demos/demo-datepicker',
        labelKey: 'nav.demo.datepicker',
        isActive: true,
    },
    {
        id: 'MENU_020007',
        parentId: 'MENU_020000',
        depth: 2,
        order: 7,
        to: '/demos/demo-select',
        labelKey: 'nav.demo.select',
        isActive: true,
    },
    {
        id: 'MENU_020008',
        parentId: 'MENU_020000',
        depth: 2,
        order: 8,
        to: '/demos/demo-choice',
        labelKey: 'nav.demo.choice',
        isActive: true,
    },
    {
        id: 'MENU_020009',
        parentId: 'MENU_020000',
        depth: 2,
        order: 9,
        to: '/demos/demo-upload-image',
        labelKey: 'nav.demo.uploadImage',
        isActive: true,
    },
    {
        id: 'MENU_020010',
        parentId: 'MENU_020000',
        depth: 2,
        order: 10,
        to: '/demos/demo-modal',
        labelKey: 'nav.demo.modal',
        isActive: true,
    },
    {
        id: 'MENU_030000',
        parentId: null,
        depth: 1,
        order: 4,
        to: '/settings',
        labelKey: 'nav.settings',
        isActive: true,
    },
];

function createMenus(): NavigationMenu[] {
    return MENU_SEED.filter((row) => row.isActive)
        .sort((a, b) => {
            if (a.depth !== b.depth) return a.depth - b.depth;
            return a.order - b.order;
        })
        .map((row) => ({
            id: row.id,
            parentId: row.parentId,
            depth: row.depth,
            order: row.order,
            label: row.labelKey,
            labelKey: row.labelKey,
            to: row.to,
            icon: row.icon,
            newTab: row.newTab ?? false,
        }));
}

export default defineEventHandler(() => {
    return { menus: createMenus() };
});
