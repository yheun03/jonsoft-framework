<template>
    <section class="page-demo-card" :data-grid-section="gridId">
        <h2 class="page-demo-card__title">{{ title ?? gridId }}</h2>

        <div class="page-demo-grid-actions">
            <AppButton variant="outline" size="sm" @click="onExportAll">
                엑셀 다운로드
            </AppButton>
            <AppButton variant="outline" size="sm" @click="onExportSelected">
                선택만 엑셀
            </AppButton>
        </div>

        <ClientOnly>
            <AppAgGrid
                :grid-id="gridId"
                class="page-demo-grid"
                :row-data="rowData"
                :column-defs="columnDefs"
                :default-col-def="defaultColDef"
                row-selection="multiple"
                animate-rows
                :style="{ height, width: '100%' }"
                @grid-ready="handleGridReady"
                @selection-changed="(e) => emit('selection-changed', { gridId, event: e })"
            />
            <template #fallback>
                <div class="page-demo-fallback">그리드 로딩 중...</div>
            </template>
        </ClientOnly>
    </section>
</template>

<script setup lang="ts" generic="TData extends Record<string, unknown>">
import type { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community'

const props = withDefaults(
    defineProps<{
        gridId: string
        title?: string
        rowData: TData[]
        columnDefs: ColDef<TData>[]
        defaultColDef?: ColDef<TData>
        height?: string
        exportOrigin?: string
    }>(),
    {
        title: undefined,
        defaultColDef: undefined,
        height: '320px',
        exportOrigin: 'A1',
    },
)

const emit = defineEmits<{
    'grid-ready': [{ gridId: string; api: GridApi<TData>; event: GridReadyEvent<TData> }]
    'selection-changed': [{ gridId: string; event: SelectionChangedEvent<TData> }]
}>()

const api = shallowRef<GridApi<TData> | null>(null)
const { exportDisplayed, exportDisplayedSelected } = useAgGridExcelExport({ origin: props.exportOrigin })

function handleGridReady(e: GridReadyEvent<TData>) {
    api.value = e.api
    emit('grid-ready', { gridId: props.gridId, api: e.api, event: e })
}

async function onExportAll() {
    if (!api.value) return
    await exportDisplayed(props.gridId, api.value)
}

async function onExportSelected() {
    if (!api.value) return
    await exportDisplayedSelected(props.gridId, api.value)
}
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->

