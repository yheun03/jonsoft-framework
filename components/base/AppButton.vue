<template>
    <component
        :is="componentTag"
        v-bind="{ ...attrs, ...componentAttrs }"
        :style="customSizeStyle"
        :class="[
            'app-button',
            size == 'custom' ? 'app-button--custom' : '',
            `app-button--${variant}`,
            `app-button--${size}`,
            { 'app-button--icon-only': isIconOnly, 'is-disabled': isActuallyDisabled, 'is-loading': loading, 'is-block': block },
        ]"
        :aria-label="computedAriaLabel"
        :aria-disabled="isLinkLike ? (isActuallyDisabled ? 'true' : undefined) : undefined"
        :tabindex="isLinkLike && isActuallyDisabled ? -1 : undefined"
        @click="onClick"
    >
        <i v-if="hasIconLeft" class="app-icon app-button__icon--left" aria-hidden="true">
            <slot name="iconLeft" />
        </i>

        <span v-if="hasLabel" class="app-button__label">
            <slot />
        </span>

        <i v-if="hasIconRight" class="app-icon app-button__icon--right" aria-hidden="true">
            <slot name="iconRight" />
        </i>
    </component>
</template>

<script setup lang="ts">
const attrs = useAttrs()

type ButtonVariant = 'fill' | 'text' | 'underline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'custom'
type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
    defineProps<{
        /** 버튼 동작. 링크로 쓰려면 `to` 또는 `href` 사용 */
        type?: ButtonType

        /** Nuxt 내부 라우팅 */
        to?: string
        /** 외부/일반 링크 */
        href?: string
        /** 링크 새 탭 */
        newTab?: boolean

        /** fill(면) | text(글자) | underline(밑줄) */
        variant?: ButtonVariant
        /** sm | md | lg */
        size?: ButtonSize
        /** 커스텀 크기 */
        customSize?: {
            width: number
            height?: number
        }

        /** 비활성화 */
        disabled?: boolean
        /** 로딩 상태 (클릭 막음 + 스타일만) */
        loading?: boolean
        /** 가로 100% */
        block?: boolean

        /** 아이콘만 렌더링 시 접근성 라벨(권장) */
        ariaLabel?: string
    }>(),
    {
        type: 'button',
        to: undefined,
        href: undefined,
        newTab: false,
        variant: 'fill',
        size: 'md',
        disabled: false,
        loading: false,
        block: false,
        ariaLabel: undefined,
    },
)

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const customSizeStyle = computed(() => {
    const s = props.customSize
    if (!s) return undefined
    return {
        width: `${s.width}px`,
        height: `${(s.height ?? s.width)}px`,
    }
})

const NuxtLinkComp = resolveComponent('NuxtLink')
const slots = useSlots()

const hasLabel = computed(() => {
    const vnodes = slots.default?.()
    return !!vnodes?.length
})

const hasIconLeft = computed(() => !!slots.iconLeft?.().length)
const hasIconRight = computed(() => !!slots.iconRight?.().length)

const isIconOnly = computed(() => !hasLabel.value && (hasIconLeft.value || hasIconRight.value))

const isLinkLike = computed(() => !!props.to || !!props.href)
const isActuallyDisabled = computed(() => props.disabled || props.loading)

const componentTag = computed(() => {
    if (props.to) return NuxtLinkComp
    if (props.href) return 'a'
    return 'button'
})

const componentAttrs = computed(() => {
    if (props.to) {
        return { to: props.to }
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

function onClick(e: MouseEvent) {
    if (isActuallyDisabled.value) {
        e.preventDefault()
        e.stopPropagation()
        return
    }
    emit('click', e)
}
</script>

<style scoped lang="scss"></style>
