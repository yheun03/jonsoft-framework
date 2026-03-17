<template>
    <div class="login-page">
        <div class="login-page__card">
            <h1 class="login-page__title">Login</h1>
            <p class="login-page__desc">기본 레이아웃 없이 단독으로 노출되는 페이지입니다.</p>

            <div class="login-page__actions">
                <NuxtLink to="/">홈으로</NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false,
})
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
}
.login-page__card {
    width: min(420px, 100%);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 20px;
}
.login-page__title {
    margin: 0 0 8px;
    font-size: 22px;
}
.login-page__desc {
    margin: 0 0 16px;
    opacity: 0.8;
}
.login-page__actions a {
    text-decoration: underline;
}
</style>
