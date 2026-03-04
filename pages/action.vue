<template>
    <!-- 리다이렉트 중 깜빡임 방지용 -->
    <div class="action">
        이동 중...
    </div>
</template>

<script setup lang="ts">
const A_PATH = '/input-demo'
const B_PATH = './'

const router = useRouter()

onMounted(() => {
    // SSR에서는 sessionStorage 접근 불가 -> 클라이언트에서만 실행
    const userId = sessionStorage.getItem('demo_userId')?.trim() ?? ''

    router.replace(userId ? B_PATH : A_PATH)
})
</script>

<style scoped>
.action {
    padding: 24px;
    text-align: center;
}
</style>