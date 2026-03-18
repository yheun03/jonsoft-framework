<template>
    <component :is="componentTag" v-bind="{ ...attrs, ...componentAttrs }" :class="classes" :style="customSizeStyle"
        :aria-label="computedAriaLabel" :aria-disabled="ariaDisabled" :tabindex="tabIndex" @click="onClick">
        <i v-if="hasIconLeft" class="app-button__icon app-button__icon--left" aria-hidden="true">
            <slot name="iconLeft" />
        </i>

        <span v-if="hasLabel" class="app-button__label">
            <slot />
        </span>

        <i v-if="hasIconRight" class="app-button__icon app-button__icon--right" aria-hidden="true">
            <slot name="iconRight" />
        </i>
    </component>
</template>

<script setup lang="ts">
const attrs = useAttrs()
const slots = useSlots()

type ButtonVariant = 'fill' | 'outline' | 'text' | 'underline'
type ButtonShape = 'square' | 'round' | 'pill'
type ButtonTone = 'primary' | 'secondary' | 'gray' | 'danger' | 'warning' | 'success' | 'info'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
    defineProps<{
        type?: ButtonType
        to?: string
        href?: string
        newTab?: boolean

        variant?: ButtonVariant
        shape?: ButtonShape
        tone?: ButtonTone
        size?: ButtonSize

        customSize?: {
            width: number
            height?: number
        }

        disabled?: boolean
        loading?: boolean
        block?: boolean
        iconOnly?: boolean
        ariaLabel?: string
    }>(),
    {
        type: 'button',
        to: undefined,
        href: undefined,
        newTab: false,

        variant: 'outline',
        shape: 'round',
        tone: 'gray',
        size: 'md',

        customSize: undefined,

        disabled: false,
        loading: false,
        block: false,
        iconOnly: false,
        ariaLabel: undefined,
    },
)

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const NuxtLinkComp = resolveComponent('NuxtLink')

const hasLabel = computed(() => !!slots.default?.()?.length)
const hasIconLeft = computed(() => !!slots.iconLeft?.()?.length)
const hasIconRight = computed(() => !!slots.iconRight?.()?.length)

const isIconOnly = computed(() => {
    return props.iconOnly || (!hasLabel.value && (hasIconLeft.value || hasIconRight.value))
})

const isLinkLike = computed(() => !!props.to || !!props.href)
const isActuallyDisabled = computed(() => props.disabled || props.loading)

const componentTag = computed(() => {
    if (props.to) return NuxtLinkComp
    if (props.href) return 'a'
    return 'button'
})

const componentAttrs = computed(() => {
    if (props.to) {
        return {
            to: props.to,
        }
    }

    if (props.href) {
        return {
            href: props.href,
            target: props.newTab ? '_blank' : undefined,
            rel: props.newTab ? 'noopener noreferrer' : undefined,
        }
    }

    return {
        type: props.type,
        disabled: isActuallyDisabled.value,
    }
})

const computedAriaLabel = computed(() => {
    if (!isIconOnly.value) return undefined
    return props.ariaLabel
})

const ariaDisabled = computed(() => {
    if (!isLinkLike.value) return undefined
    return isActuallyDisabled.value ? 'true' : undefined
})

const tabIndex = computed(() => {
    if (isLinkLike.value && isActuallyDisabled.value) return -1
    return undefined
})

const customSizeStyle = computed(() => {
    if (!props.customSize) return undefined

    return {
        width: `${props.customSize.width}px`,
        height: `${props.customSize.height ?? props.customSize.width}px`,
    }
})

const classes = computed(() => [
    'app-button',
    `app-button--variant-${props.variant}`,
    `app-button--shape-${props.shape}`,
    `app-button--size-${props.size}`,
    `app-button--tone-${props.tone}`,
    {
        'app-button--icon-only': isIconOnly.value,
        'app-button--disabled': isActuallyDisabled.value,
        'app-button--loading': props.loading,
        'app-button--block': props.block,
        'app-button--custom': !!props.customSize,
    },
])

function onClick(e: MouseEvent) {
    if (isActuallyDisabled.value) {
        e.preventDefault()
        e.stopPropagation()
        return
    }

    emit('click', e)
}
</script>