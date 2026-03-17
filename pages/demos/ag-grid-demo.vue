<template>
    <div class="page-demo">

        <div class="page-demo-layout">

            <main class="page-demo-main">

                <header class="page-demo__header">
                    <h1 class="page-demo__title">AG Grid Demo</h1>
                    <p class="page-demo__desc">
                        grid-id 기반 검색 / 엑셀 다운로드 구조
                    </p>
                </header>


                <!-- GRID 1 -->
                <section class="page-demo-card">

                    <h2 class="page-demo-card__title">
                        {{ GRID_ID_1 }}
                    </h2>

                    <!-- 검색 -->
                    <AppGridSearch :target="GRID_ID_1">

                        <AppInput v-model="search1.name" name="name" placeholder="이름 검색" />

                        <AppInput v-model="search1.department" name="department" placeholder="부서 검색" />

                    </AppGridSearch>


                    <!-- 다운로드 -->
                    <AppGridDownload :target="GRID_ID_1" />


                    <ClientOnly>

                        <AppGrid :grid-id="GRID_ID_1" class="page-demo-grid" :row-data="rows1" :column-defs="columnDefs"
                            :default-col-def="defaultColDef" row-selection="multiple" animate-rows
                            :style="{ height: '320px', width: '100%' }" />

                    </ClientOnly>

                </section>


                <!-- GRID 2 -->
                <section class="page-demo-card">

                    <h2 class="page-demo-card__title">
                        {{ GRID_ID_2 }}
                    </h2>


                    <!-- 검색 -->
                    <AppGridSearch :target="GRID_ID_2">

                        <AppInput v-model="search2.name" name="name" placeholder="이름 검색" />

                        <AppChoice v-model="search2.status" type="radio" name="status" value="ACTIVE" label="ACTIVE" />

                        <AppChoice v-model="search2.status" type="radio" name="status" value="PAUSED" label="PAUSED" />

                        <AppChoice v-model="search2.status" type="radio" name="status" value="BLOCKED"
                            label="BLOCKED" />

                    </AppGridSearch>


                    <!-- 다운로드 -->
                    <AppGridDownload :target="GRID_ID_2" />


                    <ClientOnly>

                        <AppGrid :grid-id="GRID_ID_2" class="page-demo-grid" :row-data="rows2" :column-defs="columnDefs"
                            :default-col-def="defaultColDef" row-selection="multiple" animate-rows
                            :style="{ height: '320px', width: '320px' }" />

                    </ClientOnly>

                </section>

            </main>



            <!-- 사이드 패널 -->
            <aside class="page-demo-aside">

                <div class="page-demo-aside__sticky">

                    <section class="page-demo-card">

                        <h2 class="page-demo-card__title">
                            Actions
                        </h2>

                        <div class="page-demo-actions">

                            <AppButton variant="fill" @click="shuffle">
                                데이터 섞기
                            </AppButton>

                        </div>

                    </section>


                    <section class="page-demo-card">

                        <h2 class="page-demo-card__title">
                            현재 데이터
                        </h2>

                        <pre class="page-demo-output">
  {{ output }}
              </pre>

                    </section>

                </div>

            </aside>

        </div>

    </div>
</template>


<script setup lang="ts">
import type { ColDef } from 'ag-grid-community'

type Row = {
    id: number
    name: string
    department: string
    status: 'ACTIVE' | 'PAUSED' | 'BLOCKED'
    score: number
}

/* grid id */

const GRID_ID_1 = '결과_0001'
const GRID_ID_2 = '결과_0002'


/* 검색 상태 (grid 별로 분리) */

const search1 = reactive({
    name: '',
    department: ''
})

const search2 = reactive({
    name: '',
    status: ''
})


/* column */

const columnDefs: ColDef<Row>[] = [
    { field: 'id', headerName: 'ID', width: 90, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'name', headerName: '이름', filter: true, sortable: true },
    { field: 'department', headerName: '부서', filter: true, sortable: true },
    { field: 'status', headerName: '상태', filter: true, sortable: true },
    { field: 'score', headerName: '점수', filter: 'agNumberColumnFilter', sortable: true },
]


const defaultColDef: ColDef<Row> = {
    flex: 1,
    minWidth: 120,
    resizable: true
}


/* 데이터 */

const rows1 = ref<Row[]>([
    { id: 1, name: '홍길동', department: '개발', status: 'ACTIVE', score: 88 },
    { id: 2, name: '김민수', department: '디자인', status: 'PAUSED', score: 73 },
    { id: 3, name: '이서연', department: '기획', status: 'ACTIVE', score: 95 },
    { id: 4, name: '박지훈', department: '운영', status: 'BLOCKED', score: 61 },
    { id: 5, name: '최유진', department: '개발', status: 'ACTIVE', score: 82 },
])


const rows2 = ref<Row[]>([
    { id: 101, name: '한소희', department: '마케팅', status: 'ACTIVE', score: 91 },
    { id: 102, name: '윤도현', department: '개발', status: 'PAUSED', score: 67 },
    { id: 103, name: '송지혜', department: '인사', status: 'ACTIVE', score: 84 },
    { id: 104, name: '임재현', department: '재무', status: 'BLOCKED', score: 52 },
])


/* shuffle */

function shuffle() {

    const shuffleArray = (arr: Row[]) => {

        const next = [...arr]

        for (let i = next.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1))

                ;[next[i], next[j]] = [next[j], next[i]]

        }

        return next

    }

    rows1.value = shuffleArray(rows1.value)
    rows2.value = shuffleArray(rows2.value)

}


/* output */

const output = computed(() =>
    JSON.stringify(
        {
            rows1: rows1.value.length,
            rows2: rows2.value.length
        },
        null,
        2
    )
)
</script>