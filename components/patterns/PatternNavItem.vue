<template>
    <li class="nav-item" role="none" :class="[
        `nav-depth-${item.depth}`,
        { 'nav-has-children': hasChildren }
    ]">
        <div class="nav-row">
            <!-- 링크(이동) -->
            <component :is="item.newTab ? 'a' : NuxtLinkComp" v-bind="linkProps(item)" class="nav-link" role="menuitem"
                :aria-haspopup="hasChildren ? 'true' : undefined"
                :aria-expanded="hasChildren ? String(open) : undefined">
                <span v-if="getIconSvg(item.icon)" class="nav-icon" aria-hidden="true" v-html="getIconSvg(item.icon)" />
                <span class="nav-label">{{ item.label }}</span>
            </component>

            <!-- 토글(펼침/닫힘) -->
            <button v-if="hasChildren" type="button" class="nav-toggle" @click.stop="open = !open"
                :aria-expanded="String(open)" :aria-controls="submenuId">
                ▾
            </button>
        </div>

        <!-- 서브 메뉴 -->
        <ul v-if="hasChildren" :id="submenuId" class="nav-sublist" role="menu" v-show="open"
            :aria-label="`${item.label} submenu`">
            <PatternNavItem v-for="child in item.children" :key="child.id" :item="child" :getIconSvg="getIconSvg" />
        </ul>
    </li>
</template>

<script setup lang="ts">
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