<template>
    <div class="app-date-picker" :class="{ 'is-disabled': disabled, 'is-error': !!error }">
        <label v-if="label" class="app-date-picker__label" :for="inputId">{{ label }}</label>

        <input
            :id="inputId"
            class="app-date-picker__field"
            type="date"
            :value="modelValue ?? ''"
            :min="min"
            :max="max"
            :disabled="disabled"
            :aria-invalid="!!error"
            :aria-describedby="describedBy"
            @input="onInput"
        />

        <p v-if="helper && !error" class="app-date-picker__helper" :id="helperId">{{ helper }}</p>
        <p v-if="error" class="app-date-picker__error" :id="errorId">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        modelValue: string | null | undefined
        label?: string
        helper?: string
        error?: string
        min?: string
        max?: string
        disabled?: boolean
        id?: string
    }>(),
    { disabled: false },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void
}>()

const fallbackId = useId()
const inputId = computed(() => props.id ?? `app-date-${fallbackId}`)
const helperId = computed(() => `${inputId.value}-helper`)
const errorId = computed(() => `${inputId.value}-error`)

const describedBy = computed(() => {
    if (props.error) return errorId.value
    if (props.helper) return helperId.value
    return undefined
})

function onInput(e: Event) {
    const el = e.target as HTMLInputElement
    emit('update:modelValue', el.value === '' ? null : el.value)
}
</script>

<style scoped lang="scss">
.app-date-picker {
    display: grid;
    gap: 6px;
}

.app-date-picker__label {
    font-size: 0.875rem;
    color: var(--text-primary, #0f172a);
}

.app-date-picker__field {
    width: 100%;
    border: 1px solid var(--border, #e2e8f0);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 14px;
    background: #fff;
    color: var(--text-primary, #0f172a);
    outline: none;
}

.app-date-picker__helper {
    margin: 0;
    font-size: 12px;
    color: var(--text-secondary, #64748b);
}

.app-date-picker__error {
    margin: 0;
    font-size: 12px;
    color: var(--color-error, #ef4444);
}

.is-disabled .app-date-picker__field {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
}

.is-error .app-date-picker__field {
    border-color: var(--color-error, #ef4444);
}
</style>

