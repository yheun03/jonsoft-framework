import { NAV_HEADER_ACTIONS } from './nav.config'
import { buildMenuTree, createFlatNavMenus } from './nav.utils'
import { getRouteLabel, isVisibleRoute, type AppRoute } from '~/router/route-meta'

export function useNavMenu() {
    const router = useRouter()
    const headerActions = NAV_HEADER_ACTIONS

    const menuTree = computed(() => {
        const routes = router.getRoutes() as AppRoute[]
        const visiblePaths = routes
            .map((route) => route.path)
            .filter((path, index, array) => array.indexOf(path) === index)
            .sort((a, b) => a.localeCompare(b))
            .filter(isVisibleRoute)

        const demoMenus = visiblePaths
            .filter((path) => path.startsWith('/demos/'))
            .map((path) => {
                const route = routes.find((item) => item.path === path) ?? { path }
                return {
                    path,
                    label: getRouteLabel(path, route),
                }
            })

        const flatMenus = createFlatNavMenus(demoMenus)
        return buildMenuTree(flatMenus)
    })

    function getIconSvg(_icon?: string) {
        return null
    }

    return {
        headerActions,
        menuTree,
        getIconSvg,
    }
}
