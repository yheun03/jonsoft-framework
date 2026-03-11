<template>
    <div>
        <NuxtLayout>
            <!-- 라우트 전환 시 전체 페이지를 안전하게 리마운트 -->
            <NuxtPage :key="route.fullPath" />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
