<template>
    <label class="app-checkbox" :class="{ 'is-disabled': disabled, 'is-error': !!error }">
        <span class="app-checkbox__control">
            <input
                class="app-checkbox__input"
                type="checkbox"
                :id="inputId"
                :checked="modelValue"
                :disabled="disabled"
                :aria-invalid="!!error"
                :aria-describedby="describedBy"
                @change="onChange"
            />
            <span class="app-checkbox__box" aria-hidden="true">
                <span class="app-checkbox__check" />
            </span>
        </span>
        <span class="app-checkbox__body">
            <span v-if="label" class="app-checkbox__label">{{ label }}</span>
            <span v-if="helper && !error" class="app-checkbox__helper" :id="helperId">{{ helper }}</span>
            <span v-if="error" class="app-checkbox__error" :id="errorId">{{ error }}</span>
        </span>
    </label>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        modelValue: boolean
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
    (e: 'update:modelValue', value: boolean): void
}>()

const fallbackId = useId()
const inputId = computed(() => props.id ?? `app-checkbox-${fallbackId}`)
const helperId = computed(() => `${inputId.value}-helper`)
const errorId = computed(() => `${inputId.value}-error`)

const describedBy = computed(() => {
    if (props.error) return errorId.value
    if (props.helper) return helperId.value
    return undefined
})

function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    emit('update:modelValue', el.checked)
}
</script>

<style scoped lang="scss">
.app-checkbox {
    display: inline-flex;
    gap: 8px;
    align-items: flex-start;
    font-size: 14px;
    cursor: pointer;
}

.app-checkbox__control {
    position: relative;
    flex: 0 0 auto;
}

.app-checkbox__input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: inherit;
}

.app-checkbox__box {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid var(--border, #cbd5e1);
    background: #fff;
    display: grid;
    place-items: center;
    transition: background-color 0.12s ease, border-color 0.12s ease;
}

.app-checkbox__check {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: transparent;
    transition: background-color 0.12s ease;
}

.app-checkbox__input:checked + .app-checkbox__box {
    border-color: var(--color-primary, #3b82f6);
    background: var(--color-primary, #3b82f6);
}

.app-checkbox__input:checked + .app-checkbox__box .app-checkbox__check {
    background: #fff;
}

.app-checkbox__body {
    display: grid;
    gap: 2px;
}

.app-checkbox__label {
    color: var(--text-primary, #0f172a);
}

.app-checkbox__helper {
    font-size: 12px;
    color: var(--text-secondary, #64748b);
}

.app-checkbox__error {
    font-size: 12px;
    color: var(--color-error, #ef4444);
}

.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.is-error .app-checkbox__box {
    border-color: var(--color-error, #ef4444);
}
</style>

