<template>
    <div ref="root" class="app-grid-search" @keydown.enter.prevent="applySearch">
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

function applySearch() {

    if (!target) return

    const api = getApi(target)
    if (!api) return

    const inputs = root.value?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[name]')
    if (!inputs) return

    const filterModel: Record<string, any> = {}

    inputs.forEach((input: any) => {

        const field = input.name
        let value = ''

        if (input.type === 'radio') {

            if (!input.checked) return
            value = input.value

        } else if (input.type === 'checkbox') {

            if (!input.checked) return
            value = input.value

        } else {

            value = input.value?.trim()

        }

        if (!value) return

        filterModel[field] = {
            type: 'contains',
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

    /* grid reset */

    api.setFilterModel(null)
    api.deselectAll()

    /* UI reset */

    const inputs = root.value?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[name]')
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