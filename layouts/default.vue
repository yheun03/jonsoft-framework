<template>
    <div class="layout-container">
        <LayoutNav class="layout-nav"/>
        <main class="layout-main">
            <RouteTabsBar class="layout-route-tabs" />
            <div class="layout-main-content">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import LayoutNav from '~/layouts/nav.vue';
import RouteTabsBar from '~/components/modules/route-tabs/RouteTabsBar.vue'
</script>