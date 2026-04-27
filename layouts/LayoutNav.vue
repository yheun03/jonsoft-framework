<template>
    <nav class="layout-nav" aria-label="Sidebar navigation">
        <div class="layout-nav__header">
            <div class="layout-nav__logo nav-logo" aria-hidden="true">
                <span class="nav-logo__mark" v-html="logoSvg" />
            </div>

            <div class="layout-nav__actions" aria-label="메모 툴바">
                <AppButton v-for="action in headerActions" :key="action.label" class="nav-action" variant="text"
                    size="custom" :custom-size="{ width: 28 }" :ariaLabel="action.label">
                    <template #iconLeft>
                        <Icon :icon="action.icon" aria-hidden="true" />
                    </template>
                </AppButton>
            </div>
        </div>

        <div class="layout-nav__body">
            <div class="layout-nav__list-wrap">
                <ul class="layout-nav__list" role="menubar" aria-label="Main navigation">
                    <PatternNavItem v-for="menu in menuTree" :key="menu.id" :item="menu" :get-icon-svg="getIconSvg" />
                </ul>
            </div>
        </div>

        <div class="layout-nav__footer">
            <AppButton class="nav-action" variant="text" size="custom" :custom-size="{ width: 28 }" ariaLabel="테마 변경">
                <template #iconLeft>
                    <Icon icon="mdi:weather-night" aria-hidden="true" />
                </template>
            </AppButton>
        </div>
    </nav>
</template>

<script setup lang="ts">
import PatternNavItem from '@/components/PatternNavItem.vue'
import logoSvg from '~/assets/icons/logo.svg?raw'

type Menu = {
    id: string
    label: string
    to: string
    order: number
    depth: number
    icon?: string
    newTab?: boolean
    children?: readonly Menu[]
}

type MutableMenu = Omit<Menu, 'children'> & {
    children?: MutableMenu[]
}

type NavAction = {
    label: string
    icon: string
}

type AppRoute = {
    path: string
    name?: string | symbol | null
    meta?: Record<string, unknown>
}

const headerActions: NavAction[] = [
    { label: '메모 추가', icon: 'mdi:pencil-outline' },
    { label: '메모 폴더 추가', icon: 'mdi:folder-plus-outline' },
    { label: '메모 필터 적용', icon: 'mdi:filter-variant' },
    { label: '현재 열린 메모 표시', icon: 'mdi:target' },
    { label: '메모 검색', icon: 'mdi:magnify' },
]

function buildMenuTree(items: readonly Menu[]): MutableMenu[] {
    const root: MutableMenu[] = []
    const stack: MutableMenu[] = []

    for (const item of items) {
        const node: MutableMenu = {
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

function sortMenuTree(nodes: MutableMenu[]): MutableMenu[] {
    return [...nodes]
        .sort((a, b) => a.order - b.order)
        .map((node) => ({
            ...node,
            children: node.children ? sortMenuTree(node.children) : undefined,
        }))
}

const router = useRouter()

const ROUTE_LABEL_MAP: Record<string, string> = {
    '/': '메인',
    '/workspace': '워크스페이스',
    '/demos/demo-button': '버튼 데모',
    '/demos/demo-input': '인풋 데모',
    '/demos/demo-grid': 'AG Grid 데모',
    '/demos/demo-chart': '차트 데모',
    '/demos/demo-progress': '프로그레스 데모',
    '/demos/demo-datepicker': '데이트피커 데모',
    '/demos/demo-select': '셀렉트 데모',
    '/demos/demo-choice': '선택 컴포넌트 데모',
    '/demos/demo-upload-image': '이미지 업로드 데모',
    '/demos/demo-modal': '모달 데모',
}

function getRouteLabel(path: string, route: AppRoute): string {
    if (ROUTE_LABEL_MAP[path]) return ROUTE_LABEL_MAP[path]

    const metaTitle = route.meta?.title
    if (typeof metaTitle === 'string' && metaTitle.trim()) return metaTitle

    const segment = path.split('/').filter(Boolean).at(-1) ?? 'page'
    return segment
        .replace(/^demo-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

function isVisibleRoute(path: string): boolean {
    if (!path) return false
    if (path.includes(':')) return false
    if (path === '/auth/sign-in' || path === '/auth/sign-up' || path === '/auth/find-pw') return false
    if (path === '/demos') return false
    return path === '/' || path === '/workspace' || path.startsWith('/demos/')
}

const menuTree = computed(() => {
    const routes = router.getRoutes() as AppRoute[]
    const visible = routes
        .map((route) => route.path)
        .filter((path, idx, arr) => arr.indexOf(path) === idx)
        .sort((a, b) => a.localeCompare(b))
        .filter(isVisibleRoute)

    const flatMenus: Menu[] = [
        { id: 'MENU_010000', depth: 1, order: 1, label: '메인', to: '/', newTab: false },
        { id: 'MENU_010100', depth: 1, order: 2, label: '워크스페이스', to: '/workspace', newTab: false },
        { id: 'MENU_020000', depth: 1, order: 3, label: '데모', to: '', newTab: false },
    ]

    const demoRoutes = visible.filter((path) => path.startsWith('/demos/'))
    demoRoutes.forEach((path, index) => {
        const route = routes.find((r) => r.path === path) ?? { path }
        flatMenus.push({
            id: `MENU_02${String(index + 1).padStart(4, '0')}`,
            depth: 2,
            order: index + 1,
            label: getRouteLabel(path, route),
            to: path,
            newTab: false,
        })
    })

    return buildMenuTree(flatMenus)
})

function getIconSvg(_icon?: string) {
    return null
}
</script>