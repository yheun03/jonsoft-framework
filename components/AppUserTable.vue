<template>
    <ClientOnly>
        <div class="app-user-table">
            <div v-if="loading" class="loading">로딩 중...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <AppAgGrid
                v-else
                :row-data="users"
                :column-defs="columnDefs"
                :default-col-def="defaultColDef"
                style="height: 400px; width: 100%"
                row-selection="multiple"
                animate-rows
            />
        </div>
        <template #fallback>
            <div class="loading">테이블 로딩 중...</div>
        </template>
    </ClientOnly>
</template>

<script setup lang="ts">

const { $axios } = useNuxtApp()

const users = ref<Record<string, unknown>[]>([])
const loading = ref(true)
const error = ref('')

const columnDefs = [
    { field: 'id', headerName: 'ID', width: 80, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'name', headerName: '이름', filter: true, sortable: true },
    { field: 'email', headerName: '이메일', filter: true },
    { field: 'role', headerName: '역할', filter: true },
    { field: 'department', headerName: '부서', filter: true },
    { field: 'status', headerName: '상태', filter: true },
    { field: 'createdAt', headerName: '가입일', filter: true, sortable: true },
]

const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
}

onMounted(async () => {
    try {
        const { data } = await $axios.get('/users')
        users.value = data.users ?? []
    } catch (e) {
        error.value = '유저 데이터를 불러오는데 실패했습니다.'
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped lang="scss">
@use "abstract/variables" as *;

.app-user-table {
    padding: $spacing-md;

    .loading,
    .error {
        padding: $spacing-xl;
        text-align: center;
        color: var(--text-secondary);
    }

    .error {
        color: var(--color-error, #ef4444);
    }
}
</style>
