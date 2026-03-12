<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">AG Grid Demo</h1>
                    <p class="page-demo__desc">기본 컬럼/선택/정렬/필터 케이스와 선택 로그를 확인합니다.</p>
                </header>

                <AppAgGridExportSection
                    :grid-id="GRID_ID_1"
                    :row-data="rows1"
                    :column-defs="columnDefs"
                    :default-col-def="defaultColDef"
                    @grid-ready="({ event }) => onGridReady(event)"
                    @selection-changed="({ event }) => onSelectionChanged(event)"
                />

                <AppAgGridExportSection
                    :grid-id="GRID_ID_2"
                    :row-data="rows2"
                    :column-defs="columnDefs"
                    :default-col-def="defaultColDef"
                    @grid-ready="({ event }) => onGridReady(event)"
                    @selection-changed="({ event }) => onSelectionChanged(event)"
                />
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Actions</h2>
                        <div class="page-demo-actions">
                            <AppButton variant="fill" @click="shuffle">데이터 섞기</AppButton>
                            <AppButton variant="text" @click="clearSelection">선택 해제</AppButton>
                        </div>
                    </section>

                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">현재 값</h2>
                        <pre class="page-demo-output">{{ output }}</pre>
                    </section>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community'

// ----- 타입 -----
type Row = {
    id: number
    name: string
    department: string
    status: 'ACTIVE' | 'PAUSED' | 'BLOCKED'
    score: number
}

// ----- 상수 -----
/** 그리드 고유 ID (엑셀 / 검색 타깃) */
const GRID_ID_1 = '결과_0001'
const GRID_ID_2 = '결과_0002'
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

// ----- 상태 -----
const rows1 = ref<Row[]>([
    { id: 1, name: '홍길동', department: '개발', status: 'ACTIVE', score: 88 },
    { id: 2, name: '김민수', department: '디자인', status: 'PAUSED', score: 73 },
    { id: 3, name: '이서연', department: '기획', status: 'ACTIVE', score: 95 },
    { id: 4, name: '박지훈', department: '운영', status: 'BLOCKED', score: 61 },
    { id: 5, name: '최유진', department: '개발', status: 'ACTIVE', score: 82 },
    { id: 6, name: '정다은', department: '디자인', status: 'PAUSED', score: 79 },
])

const rows2 = ref<Row[]>([
    { id: 101, name: '한소희', department: '마케팅', status: 'ACTIVE', score: 91 },
    { id: 102, name: '윤도현', department: '개발', status: 'PAUSED', score: 67 },
    { id: 103, name: '송지혜', department: '인사', status: 'ACTIVE', score: 84 },
    { id: 104, name: '임재현', department: '재무', status: 'BLOCKED', score: 52 },
    { id: 105, name: '오민지', department: '기획', status: 'ACTIVE', score: 78 },
    { id: 106, name: '강서준', department: '디자인', status: 'PAUSED', score: 88 },
])

const apiMap = ref<Record<string, GridApi<Row>>>({})
const selected = ref<Row[]>([])

// ----- 이벤트 핸들러 -----
function onGridReady(e: GridReadyEvent<Row>) {
    const id = e.api.getGridId()
    apiMap.value[id] = e.api
}

function onSelectionChanged(e: SelectionChangedEvent<Row>) {
    selected.value = e.api.getSelectedRows()
}

function shuffle() {
    for (const rowRef of [rows1, rows2]) {
        const next = [...rowRef.value]
        for (let i = next.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[next[i], next[j]] = [next[j], next[i]]
        }
        rowRef.value = next
    }
}

function clearSelection() {
    Object.values(apiMap.value).forEach((api) => api.deselectAll())
    selected.value = []
}

const output = computed(() =>
    JSON.stringify(
        {
            rowCount1: rows1.value.length,
            rowCount2: rows2.value.length,
            selectedCount: selected.value.length,
            selected: selected.value,
        },
        null,
        2,
    ),
)
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->
