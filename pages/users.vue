<template>
    <div class="users-page">
        <h1>유저 목록</h1>
        <p class="desc">API를 통해 불러온 유저 정보를 AG Grid로 표시합니다.</p>
        <AppUserTable />
        <div class="actions">
            <AppButton to="/" variant="outline" size="sm">홈으로</AppButton>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use "abstract/variables" as *;

.users-page {
    padding: $spacing-lg;
    max-width: 1200px;
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
        margin-top: $spacing-xl;
    }
}
</style>
