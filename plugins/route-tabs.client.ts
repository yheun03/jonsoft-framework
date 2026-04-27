import { useRouteTabsStore } from '~/core/stores/route-tabs'
import { getRouteLabel, type AppRoute } from '~/router/route-meta'
import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtPlugin(() => {
    const router = useRouter()
    const store = useRouteTabsStore()

    const track = (to: RouteLocationNormalized) => {
        if (!to.path) return
        const title =
            getRouteLabel(to.path, { path: to.path, meta: to.meta as Record<string, unknown> } as AppRoute) ??
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

