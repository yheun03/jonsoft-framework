<template>
    <div :class="['app-input', `app-input--${size}`, { 'is-disabled': disabled, 'is-error': !!error }]">
        <label v-if="label" class="app-input__label" :for="inputId">{{ label }}</label>

        <div class="app-input__control">
            <input
                :id="inputId"
                class="app-input__field"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :autocomplete="autocomplete"
                :name="name"
                :inputmode="computedInputMode"
                :maxlength="maxlength"
                :minlength="minlength"
                :min="min"
                :max="max"
                :step="step"
                :aria-invalid="!!error"
                :aria-describedby="describedBy"
                @input="onInput"
                @change="emit('change', $event)"
                @focus="emit('focus', $event)"
                @blur="emit('blur', $event)"
                @keydown="emit('keydown', $event)"
            />

            <button
                v-if="clearable && !disabled && !readonly && String(modelValue ?? '').length > 0"
                type="button"
                class="app-input__clear"
                aria-label="Clear"
                @click="onClear"
            >
                ×
            </button>
        </div>

        <p v-if="helper && !error" class="app-input__helper" :id="helperId">{{ helper }}</p>
        <p v-if="error" class="app-input__error" :id="errorId">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
type InputSize = 'sm' | 'md' | 'lg'
type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time'

const props = withDefaults(
    defineProps<{
        modelValue: string | number | null | undefined

        label?: string
        placeholder?: string
        type?: InputType
        size?: InputSize

        helper?: string
        error?: string

        disabled?: boolean
        readonly?: boolean
        clearable?: boolean

        id?: string
        name?: string
        autocomplete?: string

        maxlength?: number
        minlength?: number
        min?: number | string
        max?: number | string
        step?: number | string

        inputModeOverride?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
    }>(),
    {
        type: 'text',
        size: 'md',
        disabled: false,
        readonly: false,
        clearable: false,
        inputModeOverride: undefined,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'change', ev: Event): void
    (e: 'focus', ev: FocusEvent): void
    (e: 'blur', ev: FocusEvent): void
    (e: 'keydown', ev: KeyboardEvent): void
}>()

const fallbackId = useId()
const inputId = computed(() => props.id ?? `app-input-${fallbackId}`)
const helperId = computed(() => `${inputId.value}-helper`)
const errorId = computed(() => `${inputId.value}-error`)

const describedBy = computed(() => {
    if (props.error) return errorId.value
    if (props.helper) return helperId.value
    return undefined
})

const computedInputMode = computed(() => {
    if (props.inputModeOverride) return props.inputModeOverride

    switch (props.type) {
        case 'email':
            return 'email'
        case 'tel':
            return 'tel'
        case 'url':
            return 'url'
        case 'search':
            return 'search'
        case 'number':
            return 'decimal'
        default:
            return 'text'
    }
})

function onInput(e: Event) {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', target.value)
}

function onClear() {
    emit('update:modelValue', '')
}
</script>