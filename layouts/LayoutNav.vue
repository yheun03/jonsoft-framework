<template>
    <nav class="layout-nav" aria-label="Sidebar navigation">
        <div class="layout-nav__header">
            <div class="layout-nav__logo nav-logo" aria-hidden="true">
                <span class="nav-logo__mark" v-html="logoSvg" />
            </div>

            <div class="layout-nav__actions" aria-label="메모 툴바">
                <AppButton v-for="action in headerActions" :key="action.label" class="nav-action" variant="text"
                    size="custom" :custom-size="{ width: 28 }" :ariaLabel="action.label">
                    <template #iconLeft>
                        <Icon :icon="action.icon" aria-hidden="true" />
                    </template>
                </AppButton>
            </div>
        </div>

        <div class="layout-nav__body">
            <div class="layout-nav__list-wrap">
                <ul class="layout-nav__list" role="menubar" aria-label="Main navigation">
                    <PatternNavItem v-for="menu in menuTree" :key="menu.id" :item="menu" :get-icon-svg="getIconSvg" />
                </ul>
            </div>
        </div>

        <div class="layout-nav__footer">
            <AppButton class="nav-action" variant="text" size="custom" :custom-size="{ width: 28 }" ariaLabel="테마 변경">
                <template #iconLeft>
                    <Icon icon="mdi:weather-night" aria-hidden="true" />
                </template>
            </AppButton>
        </div>
    </nav>
</template>

<script setup lang="ts">
import PatternNavItem from '@/components/PatternNavItem.vue'
import logoSvg from '~/assets/icons/logo.svg?raw'
import { useNavigation } from '~/core/composables/useNavigation'

const { headerActions, menuTree, getIconSvg } = useNavigation()
</script>