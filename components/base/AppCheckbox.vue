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

