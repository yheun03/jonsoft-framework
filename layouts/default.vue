<template>
    <div class="layout">
        <LayoutNav class="layout__nav" />
        <main class="layout__main">
            <TabsPage class="layout__tabs" />
            <div class="layout__content">
                <slot />
            </div>
            <div id="layout__page-bottom-fixed" class="layout__page-bottom-fixed" />
        </main>
    </div>
</template>

<script setup lang="ts">
import LayoutNav from '~/layouts/LayoutNav.vue'
</script>