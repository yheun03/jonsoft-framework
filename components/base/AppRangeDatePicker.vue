<template>
    <div class="app-range-date" :class="{ 'is-disabled': disabled, 'is-error': !!error }">
        <label v-if="label" class="app-range-date__label">{{ label }}</label>

        <div class="app-range-date__row">
            <input
                :id="startId"
                class="app-range-date__field"
                type="date"
                :value="modelValue?.start ?? ''"
                :min="min"
                :max="max"
                :disabled="disabled"
                :aria-invalid="!!error"
                :aria-describedby="describedBy"
                @input="onStart"
            />
            <span class="app-range-date__sep" aria-hidden="true">~</span>
            <input
                :id="endId"
                class="app-range-date__field"
                type="date"
                :value="modelValue?.end ?? ''"
                :min="min"
                :max="max"
                :disabled="disabled"
                :aria-invalid="!!error"
                :aria-describedby="describedBy"
                @input="onEnd"
            />
        </div>

        <p v-if="helper && !error" class="app-range-date__helper" :id="helperId">{{ helper }}</p>
        <p v-if="error" class="app-range-date__error" :id="errorId">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
export type DateRangeValue = { start: string | null; end: string | null }

const props = withDefaults(
    defineProps<{
        modelValue: DateRangeValue | null | undefined
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
    (e: 'update:modelValue', value: DateRangeValue | null): void
}>()

const fallbackId = useId()
const baseId = computed(() => props.id ?? `app-range-date-${fallbackId}`)
const startId = computed(() => `${baseId.value}-start`)
const endId = computed(() => `${baseId.value}-end`)
const helperId = computed(() => `${baseId.value}-helper`)
const errorId = computed(() => `${baseId.value}-error`)

const describedBy = computed(() => {
    if (props.error) return errorId.value
    if (props.helper) return helperId.value
    return undefined
})

function normalize(v: string): string | null {
    return v === '' ? null : v
}

function nextValue(patch: Partial<DateRangeValue>) {
    const current: DateRangeValue = props.modelValue ?? { start: null, end: null }
    const next: DateRangeValue = { ...current, ...patch }
    if (!next.start && !next.end) return null
    return next
}

function onStart(e: Event) {
    const el = e.target as HTMLInputElement
    emit('update:modelValue', nextValue({ start: normalize(el.value) }))
}

function onEnd(e: Event) {
    const el = e.target as HTMLInputElement
    emit('update:modelValue', nextValue({ end: normalize(el.value) }))
}
</script>

<style scoped lang="scss">
.app-range-date {
    display: grid;
    gap: 6px;
}

.app-range-date__label {
    font-size: 0.875rem;
    color: var(--text-primary, #0f172a);
}

.app-range-date__row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;
    align-items: center;
}

.app-range-date__field {
    width: 100%;
    border: 1px solid var(--border, #e2e8f0);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 14px;
    background: #fff;
    color: var(--text-primary, #0f172a);
    outline: none;
}

.app-range-date__sep {
    color: rgba(15, 23, 42, 0.5);
    font-size: 12px;
}

.app-range-date__helper {
    margin: 0;
    font-size: 12px;
    color: var(--text-secondary, #64748b);
}

.app-range-date__error {
    margin: 0;
    font-size: 12px;
    color: var(--color-error, #ef4444);
}

.is-disabled .app-range-date__field {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
}

.is-error .app-range-date__field {
    border-color: var(--color-error, #ef4444);
}
</style>

