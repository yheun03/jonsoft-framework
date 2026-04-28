import { useRouteTabsStore } from '~/core/stores/route-tabs';
import { getRouteTitle, isVisibleRoute } from '~/core/app/router/route-meta';
import type { RouteLocationNormalized } from 'vue-router';

export default defineNuxtPlugin(() => {
    const router = useRouter();
    const store = useRouteTabsStore();

    const track = (to: RouteLocationNormalized) => {
        if (!to.path) return;
        if (!isVisibleRoute(to.path)) return;

        const title = getRouteTitle({
            path: to.path,
            name: to.name,
            meta: to.meta as Record<string, unknown>,
        });

        store.visit({
            key: to.fullPath,
            path: to.fullPath,
            title,
        });
    };

    router.afterEach((to) => track(to));
    track(router.currentRoute.value);
});
