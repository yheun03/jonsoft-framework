import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { NavigationMenu } from '~/core/types/navigation';
import { buildNavigationTree } from '~/core/utils/navigation-tree';
import { useI18nText } from '~/core/composables/useI18nText';

type MenusResponse = {
    menus: NavigationMenu[];
};

export const useNavigationStore = defineStore('navigation', () => {
    const { t } = useI18nText();
    const menus = ref<NavigationMenu[]>([]);
    const isLoading = ref(false);
    const isLoaded = ref(false);

    const localizedMenus = computed(() => translateMenus(menus.value, t));
    const menuTree = computed(() => buildNavigationTree(localizedMenus.value));

    async function fetchMenus(force = false) {
        if (isLoading.value) return;
        if (isLoaded.value && !force) return;

        isLoading.value = true;
        try {
            const response = await $fetch<MenusResponse>('/api/menus');
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

function translateMenus(items: NavigationMenu[], t?: (key: string, fallback?: string) => string): NavigationMenu[] {
    if (!t) return items;
    return items.map((item) => ({
        ...item,
        label: item.labelKey ? t(item.labelKey, item.label) : item.label,
        children: item.children ? translateMenus(item.children, t) : undefined,
    }));
}
