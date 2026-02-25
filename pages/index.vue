<template>
  <div class="home">
    <h1>Jonsoft Framework</h1>
    <p>Vite + SCSS + Axios + Pinia + Nuxt 기반 프레임워크</p>
    <AppButton to="/button-demo" variant="primary" size="lg">
      AppButton 데모 보기
    </AppButton>
  </div>
</template>

<script setup lang="ts">
// 페이지 진입점
</script>

<style scoped lang="scss">
.home {
  padding: 2rem;
  text-align: center;

  .app-button {
    margin-top: 1.5rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-secondary);
  }
}
</style>
