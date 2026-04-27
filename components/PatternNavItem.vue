<template>
    <li class="layout-nav__item" role="none" :class="itemClasses" :style="itemStyle">
        <div class="layout-nav__row">
            <AppButton v-if="hasChildren" class="layout-nav__toggle" variant="text" size="custom"
                :custom-size="{ width: 20, height: 20 }" ariaLabel="메뉴 펼치기/접기" :aria-expanded="open"
                :aria-controls="submenuId" @click.stop="toggleOpen">
                <template #iconLeft>
                    <Icon class="layout-nav__toggle-icon" :class="{ 'is-open': open }" icon="mdi:chevron-right"
                        aria-hidden="true" />
                </template>
            </AppButton>

            <component :is="linkTag" v-bind="linkAttrs" class="layout-nav__link" role="menuitem"
                :aria-haspopup="hasChildren ? 'true' : undefined"
                :aria-expanded="hasChildren ? String(open) : undefined" @click="onClickRow">
                <span v-if="iconSvg" class="app-icon" aria-hidden="true" v-html="iconSvg" />

                <span class="layout-nav__label">
                    {{ item.label }}
                </span>
            </component>
        </div>

        <ul v-if="hasChildren" v-show="open" :id="submenuId" class="layout-nav__sublist" role="menu"
            :aria-label="`${item.label} submenu`">
            <PatternNavItem v-for="child in item.children" :key="child.id" :item="child" :get-icon-svg="getIconSvg" />
        </ul>
    </li>
</template>

<script setup lang="ts">
type Menu = {
    id: string
    label: string
    to?: string
    order: number
    depth: number
    icon?: string
    newTab?: boolean
    children?: readonly Menu[]

}

const props = defineProps<{
    item: Menu
    getIconSvg: (icon?: string) => string | null
}>()

const NuxtLinkComp = resolveComponent('NuxtLink')

const hasChildren = computed(() => Boolean(props.item.children?.length))
const hasLink = computed(() => Boolean(props.item.to?.trim()))
const isExternalLink = computed(() => Boolean(props.item.newTab && hasLink.value))

const submenuId = computed(() => `submenu-${props.item.id}`)
const iconSvg = computed(() => props.getIconSvg(props.item.icon))

const itemClasses = computed(() => [
    `layout-nav__item--depth-${props.item.depth}`,
    {
        'layout-nav__item--has-children': hasChildren.value,
    },
])

const itemStyle = computed(() => ({
    '--indent': `${(props.item.depth - 1) * 20}px`,
}))

const linkTag = computed(() => {
    if (!hasLink.value && hasChildren.value) {
        return 'button'
    }

    if (isExternalLink.value) {
        return 'a'
    }

    return NuxtLinkComp
})

const linkAttrs = computed(() => {
    if (!hasLink.value && hasChildren.value) {
        return { type: 'button' }
    }

    if (isExternalLink.value) {
        return {
            href: props.item.to,
            target: '_blank',
            rel: 'noopener noreferrer',
        }
    }

    return {
        to: props.item.to,
    }
})

const open = ref(props.item.depth === 1 && hasChildren.value)

function toggleOpen() {
    open.value = !open.value
}

function onClickRow(event: MouseEvent) {
    if (!hasLink.value && hasChildren.value) {
        event.preventDefault()
        toggleOpen()
    }
}
</script>