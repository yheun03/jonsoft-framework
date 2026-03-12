<template>
    <label class="app-radio" :class="{ 'is-disabled': disabled, 'is-error': !!error }">
        <span class="app-radio__control">
            <input
                class="app-radio__input"
                type="radio"
                :id="inputId"
                :name="name"
                :value="value"
                :checked="modelValue === value"
                :disabled="disabled"
                :aria-invalid="!!error"
                :aria-describedby="describedBy"
                @change="onChange"
            />
            <span class="app-radio__outer" aria-hidden="true">
                <span class="app-radio__inner" />
            </span>
        </span>
        <span class="app-radio__body">
            <span v-if="label" class="app-radio__label">{{ label }}</span>
            <span v-if="helper && !error" class="app-radio__helper" :id="helperId">{{ helper }}</span>
            <span v-if="error" class="app-radio__error" :id="errorId">{{ error }}</span>
        </span>
    </label>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        modelValue: string | number | null
        value: string | number
        name: string
        label?: string
        helper?: string
        error?: string
        disabled?: boolean
        id?: string
    }>(),
    {
        disabled: false,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>()

const fallbackId = useId()
const inputId = computed(() => props.id ?? `app-radio-${fallbackId}`)
const helperId = computed(() => `${inputId.value}-helper`)
const errorId = computed(() => `${inputId.value}-error`)

const describedBy = computed(() => {
    if (props.error) return errorId.value
    if (props.helper) return helperId.value
    return undefined
})

function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    emit('update:modelValue', el.value || props.value)
}
</script>

<style scoped lang="scss">
.app-radio {
    display: inline-flex;
    gap: 8px;
    align-items: flex-start;
    font-size: 14px;
    cursor: pointer;
}

.app-radio__control {
    position: relative;
    flex: 0 0 auto;
}

.app-radio__input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: inherit;
}

.app-radio__outer {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    border: 1px solid var(--border, #cbd5e1);
    background: #fff;
    display: grid;
    place-items: center;
    transition: border-color 0.12s ease;
}

.app-radio__inner {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: transparent;
    transition: background-color 0.12s ease;
}

.app-radio__input:checked + .app-radio__outer {
    border-color: var(--color-primary, #3b82f6);
}

.app-radio__input:checked + .app-radio__outer .app-radio__inner {
    background: var(--color-primary, #3b82f6);
}

.app-radio__body {
    display: grid;
    gap: 2px;
}

.app-radio__label {
    color: var(--text-primary, #0f172a);
}

.app-radio__helper {
    font-size: 12px;
    color: var(--text-secondary, #64748b);
}

.app-radio__error {
    font-size: 12px;
    color: var(--color-error, #ef4444);
}

.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.is-error .app-radio__outer {
    border-color: var(--color-error, #ef4444);
}
</style>

