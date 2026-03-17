<template>
    <div ref="root" class="app-grid-search" @keydown.enter.prevent="applySearch">
        <slot />

        <AppButton size="sm" variant="outline" @click="applySearch">
            검색
        </AppButton>
    </div>
</template>

<script setup lang="ts">
import { useAgGridRegistry } from '~/core/composables/useAgGridRegistry'

const props = defineProps<{
    target: string
}>()

const root = ref<HTMLElement | null>(null)

const { getApi } = useAgGridRegistry()

function applySearch() {

    const api = getApi(props.target)

    if (!api) {
        console.warn('Grid not found:', props.target)
        return
    }

    const inputs = root.value?.querySelectorAll<HTMLInputElement>('[name]')

    if (!inputs) return

    const filterModel: Record<string, any> = {}

    inputs.forEach((input) => {

        const field = input.name
        const value = input.value?.trim()

        if (!value) return

        filterModel[field] = {
            type: 'contains',
            filter: value
        }

    })

    api.setFilterModel(filterModel)
    api.onFilterChanged()
}
</script>