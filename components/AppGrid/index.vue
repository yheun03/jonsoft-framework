<template>
    <AgGridVue v-bind="gridAttrs" :locale-text="localeText" :class="['ag-theme-quartz', attrs.class]"
        @grid-ready="onGridReady" />
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import type { GridOptions, GridReadyEvent } from 'ag-grid-community'
import { useAgGridRegistry } from '~/core/composables/useAgGridRegistry'

const { register } = useAgGridRegistry()

const { $agGridLocale } = useNuxtApp()
const attrs = useAttrs()

function onGridReady(e: GridReadyEvent) {

    const id = e.api.getGridId()

    if (!id) {
        console.warn('gridId missing')
        return
    }

    register(id, e.api)
}

/* attrs -> grid-id 전달 */

const gridAttrs = computed(() => {

    const a = attrs as Record<string, any>

    const {
        localeText: _,
        class: __,
        gridId,
        'grid-id': gridIdKebab,
        ...rest
    } = a

    const id = gridId ?? gridIdKebab

    return {
        ...rest,
        'grid-id': id
    }

})

const localeText = computed<GridOptions['localeText']>(() => {
    return (attrs.localeText as GridOptions['localeText']) ?? $agGridLocale
})
</script>