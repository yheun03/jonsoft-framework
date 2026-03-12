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

