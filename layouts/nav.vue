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
import { MENUS } from '~/server/utils/menu-data'
import logoSvg from '~/assets/icons/logo.svg?raw'

type Menu = {
    id: string
    label: string
    to: string
    order: number
    depth: number
    icon?: string
    newTab?: boolean
    children?: readonly Menu[]
}

type MutableMenu = Omit<Menu, 'children'> & {
    children?: MutableMenu[]
}

type NavAction = {
    label: string
    icon: string
}

const headerActions: NavAction[] = [
    { label: '메모 추가', icon: 'mdi:pencil-outline' },
    { label: '메모 폴더 추가', icon: 'mdi:folder-plus-outline' },
    { label: '메모 필터 적용', icon: 'mdi:filter-variant' },
    { label: '현재 열린 메모 표시', icon: 'mdi:target' },
    { label: '메모 검색', icon: 'mdi:magnify' },
]

function buildMenuTree(items: readonly Menu[]): MutableMenu[] {
    const root: MutableMenu[] = []
    const stack: MutableMenu[] = []

    for (const item of items) {
        const node: MutableMenu = {
            ...item,
            children: item.children ? buildMenuTree(item.children) : undefined,
        }

        while (stack.length && stack[stack.length - 1].depth >= node.depth) {
            stack.pop()
        }

        const parent = stack[stack.length - 1]

        if (parent) {
            ; (parent.children ||= []).push(node)
        } else {
            root.push(node)
        }

        stack.push(node)
    }

    return sortMenuTree(root)
}

function sortMenuTree(nodes: MutableMenu[]): MutableMenu[] {
    return [...nodes]
        .sort((a, b) => a.order - b.order)
        .map((node) => ({
            ...node,
            children: node.children ? sortMenuTree(node.children) : undefined,
        }))
}

const menuTree = computed(() => buildMenuTree(MENUS as readonly Menu[]))

function getIconSvg(_icon?: string) {
    return null
}
</script>