<template>
    <div class="layout-container">
        <LayoutNav class="layout-nav"/>
        <main class="layout-main">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import LayoutNav from '~/layouts/nav.vue';
</script>