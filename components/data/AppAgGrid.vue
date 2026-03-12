<template>
    <ag-grid-vue v-bind="gridAttrs" :locale-text="localeText" :class="['ag-theme-quartz', attrs.class]" />
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'

const { $agGridLocale } = useNuxtApp()
const attrs = useAttrs()

// localeText, class 제외 attrs. gridId는 AG Grid 옵션으로 명시 전달 (엑셀/검색 등 타깃 지정용)
const gridAttrs = computed(() => {
    const a = attrs as Record<string, unknown>
    const { localeText: _, class: __, 'grid-id': gridIdKebab, gridId: gridIdCamel, ...rest } = a
    const gridId = gridIdCamel ?? gridIdKebab
    return { ...rest, ...(gridId != null && gridId !== '' && { gridId }) }
})

// 기본값: 한국어. 부모가 locale-text 전달 시 override
import type { GridOptions } from 'ag-grid-community'
const localeText = computed<GridOptions['localeText']>(() => {
    return (attrs.localeText as GridOptions['localeText']) ?? $agGridLocale
})
</script>
