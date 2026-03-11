<template>
    <div class="app-select" :class="{ 'is-disabled': disabled, 'is-error': !!error }">
        <label v-if="label" class="app-select__label" :for="selectId">{{ label }}</label>

        <div v-if="searchable" class="app-select__search">
            <input
                class="app-select__search-input"
                type="search"
                :placeholder="searchPlaceholder"
                :disabled="disabled"
                v-model="query"
            />
        </div>

        <select
            :id="selectId"
            class="app-select__field"
            :value="modelValue ?? ''"
            :disabled="disabled"
            :aria-invalid="!!error"
            :aria-describedby="describedBy"
            @change="onChange"
        >
            <option v-if="placeholder" value="" :disabled="required">{{ placeholder }}</option>
            <option v-for="opt in filteredOptions" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
                {{ opt.label }}
            </option>
        </select>

        <p v-if="helper && !error" class="app-select__helper" :id="helperId">{{ helper }}</p>
        <p v-if="error" class="app-select__error" :id="errorId">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
export type AppSelectOption = { value: string; label: string; disabled?: boolean }

const props = withDefaults(
    defineProps<{
        modelValue: string | null | undefined
        options: AppSelectOption[]

        label?: string
        helper?: string
        error?: string

        placeholder?: string
        required?: boolean

        disabled?: boolean
        id?: string

        searchable?: boolean
        searchPlaceholder?: string
    }>(),
    {
        label: undefined,
        helper: undefined,
        error: undefined,
        placeholder: '선택하세요',
        required: false,
        disabled: false,
        id: undefined,
        searchable: false,
        searchPlaceholder: '검색...',
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void
    (e: 'change', ev: Event): void
}>()

const fallbackId = useId()
const selectId = computed(() => props.id ?? `app-select-${fallbackId}`)
const helperId = computed(() => `${selectId.value}-helper`)
const errorId = computed(() => `${selectId.value}-error`)

const describedBy = computed(() => {
    if (props.error) return errorId.value
    if (props.helper) return helperId.value
    return undefined
})

const query = ref('')

const filteredOptions = computed(() => {
    if (!props.searchable) return props.options
    const q = query.value.trim().toLowerCase()
    if (!q) return props.options
    return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

function onChange(e: Event) {
    const el = e.target as HTMLSelectElement
    const v = el.value
    const next = v === '' ? null : v
    emit('update:modelValue', next)
    emit('change', e)
}
</script>

<style scoped lang="scss">
.app-select {
    display: grid;
    gap: 6px;
}

.app-select__label {
    font-size: 0.875rem;
    color: var(--text-primary, #0f172a);
}

.app-select__search-input {
    width: 100%;
    border: 1px solid var(--border, #e2e8f0);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 14px;
    outline: none;
}

.app-select__field {
    width: 100%;
    border: 1px solid var(--border, #e2e8f0);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 14px;
    background: #fff;
    color: var(--text-primary, #0f172a);
    outline: none;
}

.app-select__helper {
    margin: 0;
    font-size: 12px;
    color: var(--text-secondary, #64748b);
}

.app-select__error {
    margin: 0;
    font-size: 12px;
    color: var(--color-error, #ef4444);
}

.is-disabled .app-select__field,
.is-disabled .app-select__search-input {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
}

.is-error .app-select__field {
    border-color: var(--color-error, #ef4444);
}
</style>

