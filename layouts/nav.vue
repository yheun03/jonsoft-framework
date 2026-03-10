<template>
    <nav class="layout-nav" aria-label="Sidebar navigation">
        <div class="layout-nav-header">
            <div class="nav-logo" aria-hidden="true">
                <i class="app-icon" v-html="logoSvg" />
            </div>
            <div class="nav-actions" aria-label="메모 툴바">
                <AppButton
                    class="nav-action"
                    variant="text"
                    size="custom"
                    :custom-size="{ width: 28 }"
                    ariaLabel="메모 추가"
                >
                    <template #iconLeft>
                        <span class="nav-action-icon" aria-hidden="true" v-html="EditIconSvg" />
                    </template>
                </AppButton>

                <AppButton
                    class="nav-action"
                    variant="text"
                    size="custom"
                    :custom-size="{ width: 28 }"
                    ariaLabel="메모 폴더 추가"
                >
                    <template #iconLeft>
                        <span class="nav-action-icon" aria-hidden="true" v-html="FolderPlusIconSvg" />
                    </template>
                </AppButton>

                <AppButton
                    class="nav-action"
                    variant="text"
                    size="custom"
                    :custom-size="{ width: 28 }"
                    ariaLabel="메모 필터 적용"
                >
                    <template #iconLeft>
                        <span class="nav-action-icon" aria-hidden="true" v-html="FilterIconSvg" />
                    </template>
                </AppButton>

                <AppButton
                    class="nav-action"
                    variant="text"
                    size="custom"
                    :custom-size="{ width: 28 }"
                    ariaLabel="현재 열린 메모 표시"
                >
                    <template #iconLeft>
                        <span class="nav-action-icon" aria-hidden="true" v-html="TargetIconSvg" />
                    </template>
                </AppButton>

                <AppButton
                    class="nav-action"
                    variant="text"
                    size="custom"
                    :custom-size="{ width: 28 }"
                    ariaLabel="메모 검색"
                >
                    <template #iconLeft>
                        <span class="nav-action-icon" aria-hidden="true" v-html="SearchIconSvg" />
                    </template>
                </AppButton>
            </div>
        </div>

        <div class="layout-nav-body">
            <ul class="nav-list" role="menubar" aria-label="Main navigation">
                <PatternNavItem
                    v-for="menu in menuTree"
                    :key="menu.id"
                    :item="menu"
                    :get-icon-svg="getIconSvg"
                />
            </ul>
        </div>
    </nav>
</template>

<script setup lang="ts">
import PatternNavItem from '@/components/patterns/PatternNavItem.vue'
import { MENUS } from '~/server/utils/menu-data'
import TempIconSvg from '@/assets/icons/temp.svg?raw'
import LogoIconSvg from '@/assets/icons/logo.svg?raw'
import EditIconSvg from '@/assets/icons/20/ic-edit.svg?raw'
import FolderPlusIconSvg from '@/assets/icons/20/ic-folder-plus.svg?raw'
import FilterIconSvg from '@/assets/icons/20/ic-filter.svg?raw'
import TargetIconSvg from '@/assets/icons/20/ic-target.svg?raw'
import SearchIconSvg from '@/assets/icons/20/ic-search.svg?raw'

type Menu = {
    id: string
    label: string
    to: string
    order: number
    depth: number
    icon?: string
    newTab?: boolean
    children?: Menu[]
}

/**
 * Flat(depth 기반) MENUS -> Tree 변환 + 형제(children) 단위 order 정렬
 * - items는 "부모 다음에 자식" 순으로 정렬되어 있다는 전제(일반적인 메뉴 테이블 export 형태)
 * - order는 "형제 내 유일" 전제
 */
function buildMenuTreeAndSort(items: readonly Menu[]): Menu[] {
    const root: Menu[] = []
    const stack: Menu[] = []

    for (const item of items) {
        const node: Menu = { ...item }

        // depth 기준으로 스택 정리
        while (stack.length && stack[stack.length - 1].depth >= node.depth) {
            stack.pop()
        }

        // 부모가 있으면 children에 push, 없으면 root
        const parent = stack[stack.length - 1]
        if (parent) {
            ; (parent.children ||= []).push(node)
        } else {
            root.push(node)
        }

        stack.push(node)
    }

    // 같은 부모의 children(형제) 내부에서만 order 정렬
    const sortSiblings = (nodes: Menu[]) => {
        nodes.sort((a, b) => a.order - b.order)
        for (const n of nodes) {
            if (n.children?.length) sortSiblings(n.children)
        }
    }

    sortSiblings(root)
    return root
}

const menuTree = computed(() => buildMenuTreeAndSort(MENUS as unknown as Menu[]))

const ICON_SVGS: Record<string, string> = {
    temp: TempIconSvg,
    logo: LogoIconSvg,
}

const logoSvg = ICON_SVGS.logo

function getIconSvg(icon?: string): string | null {
    if (!icon) return null
    return ICON_SVGS[icon] ?? null
}
</script>