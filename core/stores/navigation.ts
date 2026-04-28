import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { NavigationMenu } from '~/core/domain/navigation/types';
import { buildNavigationTree, translateNavigationMenus } from '~/core/domain/navigation/services';
import { useI18nText } from '~/core/composables/useI18nText';
import { useApi } from '~/core/composables/useApi';

type MenusResponse = {
    menus: NavigationMenu[];
};

export const useNavigationStore = defineStore('navigation', () => {
    const { t } = useI18nText();
    const api = useApi();
    const menus = ref<NavigationMenu[]>([]);
    const isLoading = ref(false);
    const isLoaded = ref(false);

    const localizedMenus = computed(() => translateNavigationMenus(menus.value, t));
    const menuTree = computed(() => buildNavigationTree(localizedMenus.value));

    async function fetchMenus(force = false) {
        if (isLoading.value) return;
        if (isLoaded.value && !force) return;

        isLoading.value = true;
        try {
            const response = await api.get<MenusResponse>('/api/menus');
            menus.value = response?.menus ?? [];
            isLoaded.value = true;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        menus,
        menuTree,
        isLoading,
        isLoaded,
        fetchMenus,
    };
});
