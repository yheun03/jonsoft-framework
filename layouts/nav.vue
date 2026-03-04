<template>
    <nav class="layout-nav" aria-label="Sidebar navigation">
        <div class="layout-nav-header">
            <h1>Jonsoft Framework</h1>
        </div>

        <div class="layout-nav-body">
            <ul class="nav-list" role="menubar" aria-label="Main navigation">
                <PatternNavItem v-for="menu in menuTree" :key="menu.id" :item="menu" :getIconSvg="getIconSvg" />
            </ul>
        </div>
    </nav>
</template>

<script setup lang="ts">
import PatternNavItem from '@/components/patterns/PatternNavItem.vue'
import { MENUS } from '~/server/utils/menu-data'

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

/**
 * 아이콘 렌더: 네 프로젝트 기존 함수로 교체하면 됨.
 * - 현재는 icon이 'temp'면 샘플 SVG 반환 같은 식으로 구현 가능
 */
function getIconSvg(icon?: string): string | null {
    if (!icon) return null

    // TODO: 실제 아이콘 매핑 로직 연결
    // 예) return ICON_MAP[icon] ?? null
    return null
}
</script>