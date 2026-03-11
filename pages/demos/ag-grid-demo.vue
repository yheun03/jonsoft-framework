<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">AG Grid Demo</h1>
                    <p class="demo__desc">기본 컬럼/선택/정렬/필터 케이스와 선택 로그를 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">Grid</h2>
                    <ClientOnly>
                        <AppAgGrid
                            class="grid"
                            :row-data="rows"
                            :column-defs="columnDefs"
                            :default-col-def="defaultColDef"
                            row-selection="multiple"
                            animate-rows
                            style="height: 520px; width: 100%"
                            @grid-ready="onGridReady"
                            @selection-changed="onSelectionChanged"
                        />
                        <template #fallback>
                            <div class="fallback">그리드 로딩 중...</div>
                        </template>
                    </ClientOnly>
                </section>
            </main>

            <aside class="demo-aside" aria-label="현재 값 패널">
                <div class="demo-aside__sticky">
                    <section class="card">
                        <h2 class="card__title">Actions</h2>
                        <div class="actions">
                            <AppButton variant="fill" @click="shuffle">데이터 섞기</AppButton>
                            <AppButton variant="text" @click="clearSelection">선택 해제</AppButton>
                        </div>
                    </section>

                    <section class="card">
                        <h2 class="card__title">현재 값</h2>
                        <pre class="output">{{ output }}</pre>
                    </section>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community'

type Row = {
    id: number
    name: string
    department: string
    status: 'ACTIVE' | 'PAUSED' | 'BLOCKED'
    score: number
}

const columnDefs: ColDef<Row>[] = [
    { field: 'id', headerName: 'ID', width: 90, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'name', headerName: '이름', filter: true, sortable: true },
    { field: 'department', headerName: '부서', filter: true, sortable: true },
    { field: 'status', headerName: '상태', filter: true, sortable: true, width: 120 },
    { field: 'score', headerName: '점수', filter: 'agNumberColumnFilter', sortable: true, width: 110 },
]

const defaultColDef: ColDef<Row> = {
    flex: 1,
    minWidth: 120,
    resizable: true,
}

const baseRows: Row[] = [
    { id: 1, name: '홍길동', department: '개발', status: 'ACTIVE', score: 88 },
    { id: 2, name: '김민수', department: '디자인', status: 'PAUSED', score: 73 },
    { id: 3, name: '이서연', department: '기획', status: 'ACTIVE', score: 95 },
    { id: 4, name: '박지훈', department: '운영', status: 'BLOCKED', score: 61 },
    { id: 5, name: '최유진', department: '개발', status: 'ACTIVE', score: 82 },
    { id: 6, name: '정다은', department: '디자인', status: 'PAUSED', score: 79 },
]

const rows = ref<Row[]>([...baseRows])
const selected = ref<Row[]>([])

const gridApi = shallowRef<GridApi<Row> | null>(null)

function onGridReady(e: GridReadyEvent<Row>) {
    gridApi.value = e.api
}

function onSelectionChanged(e: SelectionChangedEvent<Row>) {
    selected.value = e.api.getSelectedRows()
}

function shuffle() {
    const next = [...rows.value]
    for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[next[i], next[j]] = [next[j], next[i]]
    }
    rows.value = next
}

function clearSelection() {
    gridApi.value?.deselectAll()
    selected.value = []
}

const output = computed(() =>
    JSON.stringify(
        {
            rowCount: rows.value.length,
            selectedCount: selected.value.length,
            selected: selected.value,
        },
        null,
        2,
    ),
)
</script>

<style scoped lang="scss">
.demo {
    padding: 16px;
    max-width: 1120px;
}

.demo-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 16px;
    align-items: start;
}

.demo-main {
    display: grid;
    gap: 16px;
    min-width: 0;
}

.demo-aside {
    min-width: 0;
}

.demo-aside__sticky {
    position: sticky;
    top: 16px;
    display: grid;
    gap: 16px;
}

.demo__header {
    display: grid;
    gap: 6px;
}

.demo__title {
    font-size: 18px;
    margin: 0;
}

.demo__desc {
    margin: 0;
    color: rgba(15, 23, 42, 0.7);
    font-size: 13px;
}

.card {
    border: 1px solid rgba(226, 232, 240, 1);
    border-radius: 14px;
    padding: 14px;
    background: #fff;
    display: grid;
    gap: 12px;
}

.card__title {
    margin: 0;
    font-size: 14px;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.output {
    margin: 0;
    padding: 12px;
    background: rgba(15, 23, 42, 0.04);
    border-radius: 12px;
    overflow: auto;
    font-size: 12px;
    max-height: calc(100dvh - 220px);
}

.grid {
    --ag-border-radius: 12px;
}

.fallback {
    height: 520px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    border: 1px solid rgba(226, 232, 240, 1);
    color: rgba(15, 23, 42, 0.7);
}

@media (max-width: 900px) {
    .demo-layout {
        grid-template-columns: 1fr;
    }
    .demo-aside__sticky {
        position: static;
        top: auto;
    }
}
</style>

