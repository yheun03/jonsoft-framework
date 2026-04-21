<template>
    <div :class="[
        'form-field',
        'app-select',
        `app-select--${size}`,
        `app-select--shape-${shape}`,
        {
            'is-disabled': disabled,
            [`is-${state}`]: state
        }
    ]">

        <!-- label -->
        <label v-if="label" class="form-field__label app-select__label" :for="selectId">
            {{ label }}
        </label>

        <!-- control -->
        <div class="form-field__control app-select__control">

            <select :id="selectId" class="app-select__field" :value="modelValue ?? ''" :name="name" :disabled="disabled"
                :required="required" :aria-invalid="state === 'error'" :aria-describedby="describedBy"
                @change="onChange">
                <option v-if="placeholder" value="" :disabled="required" hidden>
                    {{ placeholder }}
                </option>

                <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
                    {{ opt.label }}
                </option>
            </select>

            <span class="app-select__icon app-select__icon--right" aria-hidden="true">
                <slot name="iconRight">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </slot>
            </span>

        </div>

        <!-- hint -->
        <p v-if="hint" class="form-field__hint app-select__hint" :id="hintId">
            {{ hint }}
        </p>

    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type AppSelectOption = {
    value: string
    label: string
    disabled?: boolean
}

type SelectSize = 'xs' | 'sm' | 'md' | 'lg'
type SelectShape = 'square' | 'round' | 'pill' | 'underline'
type SelectState = 'error' | 'warning' | 'success' | null

const props = withDefaults(
    defineProps<{
        modelValue: string | null

        options: AppSelectOption[]

        label?: string
        hint?: string

        placeholder?: string
        required?: boolean

        size?: SelectSize
        shape?: SelectShape
        state?: SelectState

        disabled?: boolean

        id?: string
        name?: string
    }>(),
    {
        size: 'md',
        shape: 'round',
        state: null,
        placeholder: '선택하세요',
        required: false,
        disabled: false
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void
    (e: 'change', ev: Event): void
}>()

const fallbackId = useId()

const selectId = computed(() => props.id ?? `app-select-${fallbackId}`)
const hintId = computed(() => `hint-${selectId.value}`)
const describedBy = computed(() => props.hint ? hintId.value : undefined)

function onChange(e: Event) {
    const target = e.target as HTMLSelectElement
    const value = target.value

    emit('update:modelValue', value === '' ? null : value)
    emit('change', e)
}
</script>