<template>

    <div class="page-demo">
        <div class="page-demo-layout">

            <main class="page-demo-main">

                <header class="page-demo__header">
                    <h1 class="page-demo__title">AG Grid Demo</h1>
                    <p class="page-demo__desc">AppGridToolbar 기반 Grid UI 패턴</p>
                </header>

                <!-- GRID 1 -->
                <section class="page-demo-card">

                    <h2 class="page-demo-card__title">사용자 목록</h2>

                    <AppGridToolbar target="grid1">

                        <AppGridSearch>

                            <AppInput v-model="search1.name" name="name" placeholder="이름 검색" />

                            <AppInput v-model="search1.department" name="department" placeholder="부서 검색" />

                        </AppGridSearch>
                        <AppGridDownload />

                    </AppGridToolbar>

                    <ClientOnly>

                        <AppGrid grid-id="grid1" class="page-demo-grid" :row-data="rows1" :column-defs="columns1"
                            :default-col-def="defaultColDef" row-selection="multiple" animate-rows
                            :style="{ height: '320px', width: '100%' }" />

                    </ClientOnly>

                </section>



                <!-- GRID 2 -->
                <section class="page-demo-card">

                    <h2 class="page-demo-card__title">주문 목록</h2>

                    <AppGridToolbar target="grid2">

                        <AppGridSearch>

                            <AppInput v-model="search2.product" name="product" placeholder="상품 검색" />

                            <AppChoice v-model="search2.status" type="radio" name="status" value="READY"
                                label="READY" />

                            <AppChoice v-model="search2.status" type="radio" name="status" value="DELIVERY"
                                label="DELIVERY" />

                            <AppChoice v-model="search2.status" type="radio" name="status" value="DONE" label="DONE" />

                        </AppGridSearch>
                        <AppGridDownload />

                    </AppGridToolbar>

                    <ClientOnly>

                        <AppGrid grid-id="grid2" class="page-demo-grid" :row-data="rows2" :column-defs="columns2"
                            :default-col-def="defaultColDef" row-selection="multiple" animate-rows
                            :style="{ height: '320px', width: '100%' }" />

                    </ClientOnly>

                </section>

            </main>
        </div>
    </div>

</template>



<script setup lang="ts">
import type { ColDef } from 'ag-grid-community'



/* 검색 상태 */

const search1 = reactive({
    name: '',
    department: ''
})

const search2 = reactive({
    product: '',
    status: null as string | null
})



/* 기본 column 옵션 */

const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    sortable: true,
    filter: true,
    resizable: true
}



/* GRID 1 column */

const columns1: ColDef[] = [

    {
        field: 'id',
        headerName: 'ID',
        width: 80,
        checkboxSelection: true,
        headerCheckboxSelection: true
    },

    {
        field: 'name',
        headerName: '이름'
    },

    {
        field: 'department',
        headerName: '부서'
    },

    {
        field: 'email',
        headerName: '이메일'
    },

    {
        field: 'score',
        headerName: '점수',
        filter: 'agNumberColumnFilter'
    }

]



/* GRID 2 column */

const columns2: ColDef[] = [

    {
        field: 'orderId',
        headerName: '주문번호',
        width: 120,
        checkboxSelection: true,
        headerCheckboxSelection: true
    },

    {
        field: 'product',
        headerName: '상품'
    },

    {
        field: 'price',
        headerName: '가격',
        filter: 'agNumberColumnFilter'
    },

    {
        field: 'status',
        headerName: '상태'
    },

    {
        field: 'date',
        headerName: '주문일'
    }

]



/* GRID 1 data */

const rows1 = [

    {
        id: 1,
        name: '홍길동',
        department: '개발',
        email: 'hong@test.com',
        score: 88
    },

    {
        id: 2,
        name: '김민수',
        department: '디자인',
        email: 'kim@test.com',
        score: 72
    },

    {
        id: 3,
        name: '이서연',
        department: '기획',
        email: 'lee@test.com',
        score: 95
    },

    {
        id: 4,
        name: '박지훈',
        department: '운영',
        email: 'park@test.com',
        score: 61
    },

    {
        id: 5,
        name: '최유진',
        department: '개발',
        email: 'choi@test.com',
        score: 84
    }

]



/* GRID 2 data */

const rows2 = [

    {
        orderId: 'ORD-001',
        product: '노트북',
        price: 1200000,
        status: 'READY',
        date: '2026-03-01'
    },

    {
        orderId: 'ORD-002',
        product: '키보드',
        price: 120000,
        status: 'DELIVERY',
        date: '2026-03-02'
    },

    {
        orderId: 'ORD-003',
        product: '마우스',
        price: 35000,
        status: 'DONE',
        date: '2026-03-03'
    },

    {
        orderId: 'ORD-004',
        product: '모니터',
        price: 420000,
        status: 'DELIVERY',
        date: '2026-03-04'
    },

    {
        orderId: 'ORD-005',
        product: '태블릿',
        price: 780000,
        status: 'READY',
        date: '2026-03-05'
    }

]

</script>