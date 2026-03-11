import { MENUS } from '~/server/utils/menu-data'
import { useRouteTabsStore } from '~/stores/route-tabs'

function resolveTitleByPath(path: string): string | null {
    const hit = (MENUS as readonly { to: string; label: string }[]).find((m) => m.to === path)
    return hit?.label ?? null
}

export default defineNuxtPlugin(() => {
    const router = useRouter()
    const store = useRouteTabsStore()

    const track = (to: ReturnType<typeof useRoute>) => {
        if (!to.path) return
        const title =
            resolveTitleByPath(to.path) ??
            (typeof to.meta?.title === 'string' ? (to.meta.title as string) : null) ??
            (typeof to.name === 'string' ? to.name : null) ??
            to.path

        store.visit({
            key: to.fullPath || to.path,
            path: to.fullPath || to.path,
            title,
        })
    }

    router.afterEach((to) => {
        track(to as unknown as ReturnType<typeof useRoute>)
    })

    // 초기 진입 시 현재 라우트도 탭에 포함
    track(router.currentRoute.value as unknown as ReturnType<typeof useRoute>)
})

