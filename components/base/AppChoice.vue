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

<style scoped lang="scss">
.app-choice {
    border-radius: 999px;
    border: 1px solid transparent;
    padding: 6px 12px;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: var(--text-primary, #0f172a);
    cursor: pointer;
    outline: none;
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}

.app-choice--chip {
    border-color: rgba(148, 163, 184, 0.5);
    background: #fff;
}

.app-choice--chip.is-selected {
    border-color: var(--color-primary, #3b82f6);
    background: rgba(59, 130, 246, 0.05);
    color: var(--color-primary, #3b82f6);
}

.app-choice--fill {
    border-color: transparent;
    background: rgba(15, 23, 42, 0.06);
}

.app-choice--fill.is-selected {
    background: var(--color-primary, #3b82f6);
    color: #fff;
}

.app-choice__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.app-choice--icon-only {
    padding: 6px;
}

.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>

