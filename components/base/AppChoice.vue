<template>
    <button
        type="button"
        class="app-choice"
        :class="[
            `app-choice--${variant}`,
            { 'is-selected': modelValue, 'is-disabled': disabled, 'app-choice--icon-only': !hasLabel },
        ]"
        :disabled="disabled"
        @click="onToggle"
    >
        <span v-if="iconPosition === 'left' || iconPosition === 'only'" class="app-choice__icon app-choice__icon--left">
            <slot name="icon" />
        </span>

        <span v-if="hasLabel" class="app-choice__label">
            <slot />
        </span>

        <span v-if="iconPosition === 'right'" class="app-choice__icon app-choice__icon--right">
            <slot name="icon" />
        </span>
    </button>
</template>

<script setup lang="ts">
const slots = useSlots()

type ChoiceVariant = 'chip' | 'fill'
type IconPosition = 'none' | 'left' | 'right' | 'only'

const props = withDefaults(
    defineProps<{
        modelValue: boolean
        variant?: ChoiceVariant
        iconPosition?: IconPosition
        disabled?: boolean
    }>(),
    {
        variant: 'chip',
        iconPosition: 'none',
        disabled: false,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const hasLabel = computed(() => {
    const vnodes = slots.default?.()
    return !!vnodes?.length
})

function onToggle() {
    if (props.disabled) return
    emit('update:modelValue', !props.modelValue)
}
</script>

