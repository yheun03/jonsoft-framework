<template>
    <ClientOnly>
        <div class="app-user-purchases">
            <div v-if="loading" class="loading">로딩 중...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else class="user-list">
                <section v-for="user in usersWithPurchases" :key="user.id" class="user-section">
                    <h2 class="user-name">{{ user.name }}의 구매이력</h2>
                    <p class="user-meta">{{ user.email }} · {{ user.department }}</p>
                    <div v-if="user.purchases.length === 0" class="empty">구매 이력이 없습니다.</div>
                    <AppAgGrid
                        v-else
                        class="purchase-grid"
                        :row-data="user.purchases"
                        :column-defs="purchaseColumnDefs"
                        :default-col-def="defaultColDef"
                        :dom-layout="'autoHeight'"
                        style="width: 100%"
                        animate-rows
                    />
                </section>
            </div>
        </div>
        <template #fallback>
            <div class="loading">로딩 중...</div>
        </template>
    </ClientOnly>
</template>

<script setup lang="ts">
const { $axios } = useNuxtApp()

interface Purchase {
    id: string
    productName: string
    quantity: number
    amount: number
    status: string
    purchasedAt: string
}

interface UserWithPurchases {
    id: string
    name: string
    email: string
    department: string
    purchases: Purchase[]
}

const usersWithPurchases = ref<UserWithPurchases[]>([])
const loading = ref(true)
const error = ref('')

const purchaseColumnDefs = [
    { field: 'productName', headerName: '상품명', filter: true, sortable: true },
    { field: 'quantity', headerName: '수량', width: 90 },
    { field: 'amount', headerName: '금액', width: 120, valueFormatter: (params: { value?: unknown }) => params.value != null ? Number(params.value).toLocaleString() + '원' : '' },
    { field: 'status', headerName: '상태', width: 100, filter: true },
    { field: 'purchasedAt', headerName: '구매일', width: 120 },
]

const defaultColDef = {
    flex: 1,
    minWidth: 80,
    resizable: true,
}

onMounted(async () => {
    try {
        const { data } = await $axios.get('/users-with-purchases')
        usersWithPurchases.value = data.data ?? []
    } catch (e) {
        error.value = '데이터를 불러오는데 실패했습니다.'
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>
