<template>
    <div :class="['app-input', `app-input--${size}`, { 'is-disabled': disabled, 'is-error': !!error }]">
        <label v-if="label" class="app-input__label" :for="inputId">{{ label }}</label>

        <div class="app-input__control">
            <input :id="inputId" class="app-input__field" :type="type" :value="modelValue" :placeholder="placeholder"
                :disabled="disabled" :readonly="readonly" :autocomplete="autocomplete" :name="name"
                :inputmode="computedInputMode" :maxlength="maxlength" :minlength="minlength" :min="min" :max="max"
                :step="step" :aria-invalid="!!error" :aria-describedby="describedBy" @input="onInput"
                @change="emit('change', $event)" @focus="emit('focus', $event)" @blur="emit('blur', $event)"
                @keydown="emit('keydown', $event)" />

            <button v-if="clearable && !disabled && !readonly && String(modelValue ?? '').length > 0" type="button"
                class="app-input__clear" aria-label="Clear" @click="onClear">
            </button>
        </div>

        <p v-if="helper && !error" class="app-input__helper" :id="helperId">{{ helper }}</p>
        <p v-if="error" class="app-input__error" :id="errorId">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
type InputSize = 'sm' | 'md' | 'lg'
type InputType =
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'

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

        /** 필요하면 남겨둘 수 있는 "예외 override" (원치 않으면 이것도 삭제 가능) */
        inputModeOverride?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
    }>(),
    {
        type: 'text',
        size: 'md',
        disabled: false,
        readonly: false,
        clearable: false,
        inputModeOverride: undefined,
    }
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

/** type 기반으로 inputmode 자동 매핑 */
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
            // 숫자 입력은 보통 decimal이 UX 좋음 (소수 가능)
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

<style scoped lang="scss">
.app-input {
    display: grid;
    gap: 6px;

    &__label {
        font-size: 0.875rem;
        color: var(--text-primary, #0f172a);
    }

    &__control {
        position: relative;
        display: flex;
        align-items: center;
    }

    &__field {
        width: 100%;
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 14px;
        background: #fff;
        color: var(--text-primary, #0f172a);
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;

        &:focus {
            border-color: var(--color-primary, #3b82f6);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        &::placeholder {
            color: var(--text-secondary, #64748b);
        }
    }

    &__clear {
        position: absolute;
        right: 10px;
        border: 0;
        background: transparent;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        color: var(--text-secondary, #64748b);
        padding: 2px 6px;
    }

    &__helper {
        margin: 0;
        font-size: 12px;
        color: var(--text-secondary, #64748b);
    }

    &__error {
        margin: 0;
        font-size: 12px;
        color: var(--color-error, #ef4444);
    }

    &.is-disabled &__field {
        background: #f1f5f9;
        color: #94a3b8;
        cursor: not-allowed;
    }

    &.is-error &__field {
        border-color: var(--color-error, #ef4444);
    }

    /* sizes */
    &--sm &__field {
        padding: 8px 10px;
        font-size: 13px;
        border-radius: 8px;
    }

    &--md &__field {
        padding: 10px 12px;
        font-size: 14px;
        border-radius: 10px;
    }

    &--lg &__field {
        padding: 12px 14px;
        font-size: 15px;
        border-radius: 12px;
    }
}
</style>