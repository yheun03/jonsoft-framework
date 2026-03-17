<template>
    <div ref="root" class="app-grid-search" @keydown.enter.prevent="applySearch" @change="handleAutoSearch">
        <slot />
        <AppButton size="sm" variant="outline" @click="applySearch">검색</AppButton>
        <AppButton size="sm" variant="outline" @click="resetGrid">초기화</AppButton>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useAgGridRegistry } from '~/core/composables/useAgGridRegistry'

const target = inject<string>('appGridTarget')

const root = ref<HTMLElement | null>(null)

const { getApi } = useAgGridRegistry()

function handleAutoSearch(e: Event) {

    const el = e.target as HTMLInputElement | HTMLSelectElement
    if (!el) return

    const isAuto =
        el.type === 'radio' ||
        el.type === 'checkbox' ||
        el.tagName === 'SELECT'

    if (!isAuto) return

    applySearch()

}

function applySearch() {

    if (!target) return

    const api = getApi(target)
    if (!api) return

    const inputs =
        root.value?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[name]')

    if (!inputs) return

    const filterModel: Record<string, any> = {}

    inputs.forEach((input: any) => {

        const field = input.name
        let value = ''

        if (input.type === 'radio') {

            if (!input.checked) return
            value = input.value

        } else {

            value = input.value?.trim()

        }

        if (!value) return

        const isExact =
            input.type === 'radio' ||
            input.tagName === 'SELECT'

        filterModel[field] = {
            type: isExact ? 'equals' : 'contains',
            filter: value
        }

    })

    api.setFilterModel(filterModel)
    api.onFilterChanged()

}

function resetGrid() {

    if (!target) return

    const api = getApi(target)
    if (!api) return

    api.setFilterModel(null)
    api.deselectAll()

    const inputs =
        root.value?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[name]')

    if (!inputs) return

    inputs.forEach((input: any) => {

        if (input.type === 'radio' || input.type === 'checkbox') {

            input.checked = false

        } else {

            input.value = ''

        }

    })

}
</script>