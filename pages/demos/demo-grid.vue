<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header> <!-- GRID 1 -->
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
                            :default-col-def="defaultColDef" :get-row-height="getRowHeight" row-selection="multiple"
                            animate-rows :style="{ height: '320px', width: '100%' }" />
                    </ClientOnly>
                </section> <!-- GRID 2 -->
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
                            :default-col-def="defaultColDef" :get-row-height="getRowHeight" row-selection="multiple"
                            animate-rows :style="{ height: '320px', width: '100%' }" />
                    </ClientOnly>
                </section> <!-- GRID 3 -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">상품 조회 (단순 그리드)</h2>
                    <AppGridToolbar target="grid3">
                        <AppGridSearch>
                            <AppInput v-model="search3.product" name="product" placeholder="상품 검색" />
                        </AppGridSearch>
                        <AppGridDownload />
                    </AppGridToolbar>
                    <ClientOnly>
                        <AppGrid grid-id="grid3" class="page-demo-grid" :row-data="rows3" :column-defs="columns3"
                            :default-col-def="defaultColDef" :get-row-height="getRowHeight" animate-rows
                            :style="{ height: '320px', width: '100%' }" />
                    </ClientOnly>
                </section>
            </main>
        </div>
    </div>

    <LayoutBottomFixed>
        <template #right>
            <AppButton>test</AppButton>
        </template>
    </LayoutBottomFixed>

</template>



<script setup lang="ts">
import type { ColDef } from 'ag-grid-community'

import AppGridCellSelect from '~/components/AppGrid/Cell/Select.vue'
import AppGridCellInput from '~/components/AppGrid/Cell/Input.vue'
import AppGridCellChoice from '~/components/AppGrid/Cell/Choice.vue'
import AppGridCellImage from '~/components/AppGrid/Cell/Image.vue'

const { title, description } = useDemoI18n('grid')


/* 행 높이 동적 처리 */

const getRowHeight = (params: any) => {

    if (Array.isArray(params.data?.productGallery) && params.data.productGallery.length) {
        return 240
    }

    if (params.data?.productImage) {
        return 100
    }

    return 42
}


/* 검색 상태 */

const search1 = reactive({
    name: '',
    department: ''
})

const search2 = reactive({
    product: '',
    status: '' as string
})

const search3 = reactive({
    product: ''
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


/* GRID 3 column */

const columns3: ColDef[] = [

    {
        field: 'productId',
        headerName: '상품코드',
        width: 120
    },

    {
        field: 'productImage',
        headerName: '대표이미지',
        width: 220,
        cellRenderer: AppGridCellImage,
        cellRendererParams: {
            triggerText: '대표 이미지 업로드',
            hint: '단일 이미지',
            multiple: false
        }
    },

    {
        field: 'productGallery',
        headerName: '상세이미지',
        width: 260,
        cellRenderer: AppGridCellImage,
        cellRendererParams: {
            triggerText: '상세 이미지 업로드',
            hint: '최대 4개',
            multiple: true,
            maxCount: 4
        }
    },

    {
        field: 'product',
        headerName: '상품명'
    },

    {
        field: 'category',
        headerName: '카테고리',
        cellRenderer: AppGridCellSelect,
        cellRendererParams: {
            options: [
                { label: '전자기기', value: '전자기기' },
                { label: '주변기기', value: '주변기기' }
            ]
        }
    },

    {
        field: 'price',
        headerName: '가격'
    },

    {
        field: 'stock',
        headerName: '재고',
        cellRenderer: AppGridCellInput,
        cellRendererParams: {
            type: 'number',
            min: 0,
            max: 100
        }
    },

    {
        field: 'state',
        headerName: '상태',
        cellRenderer: AppGridCellChoice,
        suppressHeaderMenuButton: true,
        sortable: false,
        filter: false,
        cellRendererParams: {
            type: 'radio',
            options: [
                { label: '판매중', value: '판매중' },
                { label: '품절', value: '품절' }
            ]
        }
    }

]


/* GRID 1 data */

const rows1 = [

    { id: 1, name: '홍길동', department: '개발', email: 'hong@test.com', score: 88 },
    { id: 2, name: '김민수', department: '디자인', email: 'kim@test.com', score: 72 },
    { id: 3, name: '이서연', department: '기획', email: 'lee@test.com', score: 95 },
    { id: 4, name: '박지훈', department: '운영', email: 'park@test.com', score: 61 },
    { id: 5, name: '최유진', department: '개발', email: 'choi@test.com', score: 84 }

]


/* GRID 2 data */

const rows2 = [

    { orderId: 'ORD-001', product: '노트북', price: 1200000, status: 'READY', date: '2026-03-01' },
    { orderId: 'ORD-002', product: '키보드', price: 120000, status: 'DELIVERY', date: '2026-03-02' },
    { orderId: 'ORD-003', product: '마우스', price: 35000, status: 'DONE', date: '2026-03-03' },
    { orderId: 'ORD-004', product: '모니터', price: 420000, status: 'DELIVERY', date: '2026-03-04' },
    { orderId: 'ORD-005', product: '태블릿', price: 780000, status: 'READY', date: '2026-03-05' }

]


/* GRID 3 data */

const rows3 = [

    {
        productId: 'P-001',
        productImage: 'https://picsum.photos/80?random=101',
        productGallery: [
            'https://picsum.photos/80?random=111',
            'https://picsum.photos/80?random=112'
        ],
        product: '노트북',
        category: '전자기기',
        price: 1200000,
        stock: 12,
        state: '품절'
    },

    {
        productId: 'P-002',
        productImage: 'https://picsum.photos/80?random=102',
        productGallery: [
            'https://picsum.photos/80?random=121',
            'https://picsum.photos/80?random=122',
            'https://picsum.photos/80?random=123'
        ],
        product: '키보드',
        category: '주변기기',
        price: 120000,
        stock: 34,
        state: '품절'
    },

    {
        productId: 'P-003',
        productImage: 'https://picsum.photos/80?random=103',
        productGallery: [
            'https://picsum.photos/80?random=131'
        ],
        product: '마우스',
        category: '주변기기',
        price: 35000,
        stock: 50,
        state: '판매중'
    },

    {
        productId: 'P-004',
        productImage: 'https://picsum.photos/80?random=104',
        productGallery: [
            'https://picsum.photos/80?random=141',
            'https://picsum.photos/80?random=142',
            'https://picsum.photos/80?random=143',
            'https://picsum.photos/80?random=144'
        ],
        product: '모니터',
        category: '전자기기',
        price: 420000,
        stock: 7,
        state: '품절'
    },

    {
        productId: 'P-005',
        productImage: 'https://picsum.photos/80?random=105',
        productGallery: [],
        product: '태블릿',
        category: '전자기기',
        price: 780000,
        stock: 9,
        state: '판매중'
    }

]

</script>