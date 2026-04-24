<template>
    <label :class="rootClasses">
        <!-- control -->
        <span v-if="showControl" class="app-choice__control">
            <input :id="inputId" class="app-choice__input" :type="type" :name="name" :value="inputValue"
                :checked="isChecked" :disabled="disabled" :aria-invalid="state === 'error'"
                :aria-describedby="describedBy" @change="onChange" />

            <span class="app-choice__visual" aria-hidden="true">
                <span class="app-choice__inner" />
            </span>
        </span>

        <!-- body -->
        <span v-if="hasBody" class="app-choice__body">
            <span v-if="label" class="app-choice__label">
                {{ label }}
            </span>

            <span v-if="hint" :id="hintId" class="app-choice__hint">
                {{ hint }}
            </span>
        </span>
    </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ChoiceType = 'checkbox' | 'radio'
type ChoiceVariant = 'default' | 'chip' | 'chip-outline' | 'fill' | 'ghost'
type ChoiceState = 'error' | 'warning' | 'success' | null

const props = withDefaults(
    defineProps<{
        type?: ChoiceType
        /** checkbox: boolean / radio: string | number | null */
        modelValue: boolean | string | number | null
        value?: string | number
        name?: string
        label?: string
        hint?: string
        disabled?: boolean
        id?: string
        variant?: ChoiceVariant
        state?: ChoiceState
    }>(),
    {
        type: 'checkbox',
        disabled: false,
        variant: 'default',
        state: null,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean | string | number | null): void
}>()

const fallbackId = useId()

const inputId = computed(() => props.id ?? `app-choice-${fallbackId}`)
const hintId = computed(() => `${inputId.value}-hint`)

const describedBy = computed(() => {
    return props.hint ? hintId.value : undefined
})

const isChipVariant = computed(() => {
    return ['chip', 'chip-outline', 'fill', 'ghost'].includes(props.variant)
})

const showControl = computed(() => !isChipVariant.value)

const hasBody = computed(() => {
    return !!props.label || !!props.hint
})

const inputValue = computed(() => {
    return props.value ?? ''
})

const isChecked = computed(() => {
    if (props.type === 'checkbox') {
        return Boolean(props.modelValue)
    }

    if (props.value === undefined) {
        return false
    }

    return props.modelValue === props.value
})

const rootClasses = computed(() => [
    'app-choice',
    `app-choice--${props.type}`,
    `app-choice--${props.variant}`,
    {
        'is-disabled': props.disabled,
        'is-checked': isChecked.value,
        [`is-${props.state}`]: props.state,
    },
])

function onChange(event: Event) {
    const target = event.target as HTMLInputElement

    if (props.type === 'checkbox') {
        emit('update:modelValue', target.checked)
        return
    }

    emit('update:modelValue', props.value ?? target.value ?? null)
}
</script>