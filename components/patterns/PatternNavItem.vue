<template>
    <li
        class="layout-nav__item"
        role="none"
        :class="[
            `layout-nav__item--depth-${item.depth}`,
            { 'layout-nav__item--has-children': hasChildren }
        ]"
        :style="{ '--indent': `${(item.depth - 1) * 20}px` }"
    >
        <div class="layout-nav__row">

            <!-- 토글(펼침/닫힘) -->
            <AppButton
                v-if="hasChildren"
                class="layout-nav__toggle"
                variant="text"
                size="custom"
                :custom-size="{
                    width: 20,
                    height: 20,
                }"
                ariaLabel="메뉴 펼치기/접기"
                :aria-expanded="open"
                :aria-controls="submenuId"
                @click.stop="open = !open"
            >
                <template #iconLeft>
                    <i
                        class="icon layout-nav__toggle-icon"
                        :class="{ 'is-open': open }"
                        aria-hidden="true"
                        v-html="ChevronRightSvg"
                    />
                </template>
            </AppButton>
            <!-- 링크(이동) / 그룹(토글) -->
            <component
                :is="hasTo ? (item.newTab ? 'a' : NuxtLinkComp) : 'button'"
                v-bind="hasTo ? linkProps(item) : { type: 'button' }"
                class="layout-nav__link"
                role="menuitem"
                :aria-haspopup="hasChildren ? true : undefined"
                :aria-expanded="hasChildren ? open : undefined"
                @click="onClickRow"
            >
                <span
                    v-if="getIconSvg(item.icon)"
                    class="app-icon"
                    aria-hidden="true"
                    v-html="getIconSvg(item.icon)"
                />
                <span class="layout-nav__label">{{ item.label }}</span>
            </component>
        </div>

        <!-- 서브 메뉴 -->
        <ul
            v-if="hasChildren"
            :id="submenuId"
            class="layout-nav__sublist"
            role="menu"
            v-show="open"
            :aria-label="`${item.label} submenu`"
        >
            <PatternNavItem
                v-for="child in item.children"
                :key="child.id"
                :item="child"
                :get-icon-svg="getIconSvg"
            />
        </ul>
    </li>
</template>

<script setup lang="ts">
import ChevronRightSvg from '@/assets/icons/16/ic-chevron-right.svg?raw'

type Menu = {
    id: string
    label: string
    to?: string
    order: number
    depth: number
    icon?: string
    newTab?: boolean
    children?: Menu[]
}

const props = defineProps<{
    item: Menu
    getIconSvg: (icon?: string) => string | null
}>()

const NuxtLinkComp = resolveComponent('NuxtLink')
const open = ref(false)

const hasChildren = computed(() => !!props.item.children?.length)
const submenuId = computed(() => `submenu-${props.item.id}`)
const hasTo = computed(() => !!props.item.to?.trim())

function linkProps(item: Menu) {
    if (!item.to?.trim()) return {}
    if (item.newTab) {
        return { href: item.to, target: '_blank', rel: 'noopener noreferrer' }
    }
    return { to: item.to }
}

function onClickRow(e: MouseEvent) {
    // to가 없으면 "그룹 항목"이므로 클릭 시 토글
    if (!hasTo.value && hasChildren.value) {
        e.preventDefault()
        open.value = !open.value
    }
}
</script>