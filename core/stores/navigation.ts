import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { NavigationMenu } from '~/core/types/navigation'
import { buildNavigationTree } from '~/core/utils/navigation-tree'

type MenusResponse = {
    menus: NavigationMenu[]
}

export const useNavigationStore = defineStore('navigation', () => {
    const menus = ref<NavigationMenu[]>([])
    const isLoading = ref(false)
    const isLoaded = ref(false)

    const menuTree = computed(() => buildNavigationTree(menus.value))

    async function fetchMenus(force = false) {
        if (isLoading.value) return
        if (isLoaded.value && !force) return

        isLoading.value = true
        try {
            const response = await $fetch<MenusResponse>('/api/menus')
            menus.value = response?.menus ?? []
            isLoaded.value = true
        } finally {
            isLoading.value = false
        }
    }

    return {
        menus,
        menuTree,
        isLoading,
        isLoaded,
        fetchMenus,
    }
})
