<template>
    <div class="button-demo">
        <h1>AppButton 데모</h1>
        <p class="desc">개발자가 지정한 주소로 이동하는 버튼 컴포넌트</p>

        <section class="section">
            <h2>직접 지정</h2>
            <div class="button-group">
                <AppButton to="/" variant="primary">홈으로</AppButton>
                <AppButton to="/button-demo" variant="secondary">이 페이지</AppButton>
                <AppButton to="https://nuxt.com" variant="outline" :new-tab="true">
                    Nuxt 문서 (새 탭)
                </AppButton>
            </div>
        </section>

        <section class="section">
            <h2>API에서 불러온 링크</h2>
            <div v-if="loading" class="loading">로딩 중...</div>
            <div v-else class="button-group">
                <AppButton v-for="link in links" :key="link.id" :to="link.to" :new-tab="link.newTab" variant="ghost"
                    size="sm">
                    {{ link.label }}
                </AppButton>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
const { $axios } = useNuxtApp()

const links = ref<Array<{ id: string; label: string; to: string; newTab?: boolean }>>([])
const loading = ref(true)

onMounted(async () => {
    try {
        const { data } = await $axios.get('/links') // baseURL(/api) + /links = /api/links
        links.value = data.links
    } catch (e) {
        console.error('API 호출 실패:', e)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped lang="scss">
@use "abstract/variables" as *;

.button-demo {
    padding: $spacing-lg;
    max-width: 600px;
    margin: 0 auto;

    h1 {
        font-size: 2rem;
        margin-bottom: $spacing-sm;
    }

    .desc {
        color: var(--text-secondary);
        margin-bottom: $spacing-xl;
    }

    .section {
        margin-bottom: $spacing-xl;

        h2 {
            font-size: 1.25rem;
            margin-bottom: $spacing-md;
            color: var(--text-secondary);
        }
    }

    .button-group {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-md;
    }

    .loading {
        color: var(--text-secondary);
    }
}
</style>
