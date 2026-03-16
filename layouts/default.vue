<template>
    <div class="layout">
        <LayoutNav class="layout__nav" />
        <main class="layout__main">
            <RouteTabsBar class="layout__tabs" />
            <div class="layout__content">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import LayoutNav from '~/layouts/nav.vue';
import RouteTabsBar from '~/components/RouteTabsBar.vue'
</script>