<template>
    <li class="nav-item" role="none" :class="[
        `nav-depth-${item.depth}`,
        { 'nav-has-children': hasChildren }
    ]" :style="{ '--pos': `${(item.depth - 1) * -20}px` }">
        <div class="nav-row">

            <!-- 토글(펼침/닫힘) -->
            <AppButton
                v-if="hasChildren"
                class="nav-toggle"
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
                        class="icon nav-toggle-icon"
                        :class="{ 'is-open': open }"
                        aria-hidden="true"
                        v-html="ChevronRightSvg"
                    />
                </template>
            </AppButton>
            <!-- 링크(이동) -->
            <component
                :is="item.newTab ? 'a' : NuxtLinkComp"
                v-bind="linkProps(item)"
                class="nav-link"
                role="menuitem"
                :aria-haspopup="hasChildren ? true : undefined"
                :aria-expanded="hasChildren ? open : undefined"
            >
                <span
                    v-if="getIconSvg(item.icon)"
                    class="app-icon"
                    aria-hidden="true"
                    v-html="getIconSvg(item.icon)"
                />
                <span class="nav-label">{{ item.label }}</span>
            </component>
        </div>

        <!-- 서브 메뉴 -->
        <ul
            v-if="hasChildren"
            :id="submenuId"
            class="nav-sublist"
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
    to: string
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

function linkProps(item: Menu) {
    if (item.newTab) {
        return { href: item.to, target: '_blank', rel: 'noopener noreferrer' }
    }
    return { to: item.to }
}
</script>