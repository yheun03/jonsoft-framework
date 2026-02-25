<template>
  <div class="layout-default">
    <header class="layout-header">
      <NuxtLink to="/">Jonsoft Framework</NuxtLink>
    </header>
    <main class="layout-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .layout-header {
    padding: 1rem 2rem;
    background: var(--color-primary, #333);
    color: white;

    a {
      color: inherit;
      text-decoration: none;
      font-weight: 600;
    }
  }

  .layout-main {
    flex: 1;
    padding: 2rem;
  }
}
</style>
