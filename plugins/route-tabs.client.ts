import { MENUS } from '~/server/utils/menu-data'
import { useRouteTabsStore } from '~/stores/route-tabs'
import type { RouteLocationNormalized } from 'vue-router'

const MENU_TITLE_BY_PATH: Record<string, string> = Object.fromEntries(
    (MENUS as readonly { to: string; label: string }[])
        .filter((m) => !!m.to)
        .map((m) => [m.to, m.label]),
)

export default defineNuxtPlugin(() => {
    const router = useRouter()
    const store = useRouteTabsStore()

    const track = (to: RouteLocationNormalized) => {
        if (!to.path) return
        const title =
            MENU_TITLE_BY_PATH[to.path] ??
            (typeof to.meta?.title === 'string' ? (to.meta.title as string) : null) ??
            (typeof to.name === 'string' ? to.name : null) ??
            to.path

        store.visit({
            key: to.fullPath,
            path: to.fullPath,
            title,
        })
    }

    router.afterEach((to) => track(to))

    // 초기 진입 시 현재 라우트도 탭에 포함
    track(router.currentRoute.value)
})

