<template>
    <div class="purchases-page">
        <h1>유저별 구매이력</h1>
        <p class="desc">김철수, 박민수 등 각 유저가 구매한 상품 목록을 확인할 수 있습니다.</p>
        <AppUserPurchasesTable />
        <div class="actions">
            <AppButton to="/" variant="outline" size="sm">홈으로</AppButton>
            <AppButton to="/users" variant="secondary" size="sm">유저 목록</AppButton>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use "abstract/variables" as *;

.purchases-page {
    padding: $spacing-lg;
    max-width: 1000px;
    margin: 0 auto;

    h1 {
        font-size: 2rem;
        margin-bottom: $spacing-sm;
    }

    .desc {
        color: var(--text-secondary);
        margin-bottom: $spacing-xl;
    }

    .actions {
        display: flex;
        gap: $spacing-sm;
        margin-top: $spacing-xl;
    }
}
</style>
