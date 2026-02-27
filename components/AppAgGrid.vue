<template>
    <ag-grid-vue v-bind="gridAttrs" :locale-text="localeText" :class="['ag-theme-quartz', attrs.class]" />
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'

const { $agGridLocale } = useNuxtApp()
const attrs = useAttrs()

// localeText, class 제외 attrs (템플릿에서 별도 처리)
const gridAttrs = computed(() => {
    const { localeText: _, class: __, ...rest } = attrs as Record<string, unknown>
    return rest
})

// 기본값: 한국어. 부모가 locale-text 전달 시 override
import type { GridOptions } from 'ag-grid-community'
const localeText = computed<GridOptions['localeText']>(() => {
    return (attrs.localeText as GridOptions['localeText']) ?? $agGridLocale
})
</script>
