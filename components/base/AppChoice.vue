<template>
    <label class="app-choice" :class="choiceClasses">
        <span class="app-choice__control">
            <input
                class="app-choice__input"
                :type="type"
                :id="inputId"
                :name="name"
                :value="value"
                :checked="isChecked"
                :disabled="disabled"
                :aria-invalid="!!error"
                :aria-describedby="describedBy"
                @change="onChange"
            />
            <span class="app-choice__visual" aria-hidden="true">
                <span class="app-choice__inner" />
            </span>
        </span>

        <span class="app-choice__body">
            <span v-if="label" class="app-choice__label">{{ label }}</span>
            <span v-if="helper && !error" class="app-choice__helper" :id="helperId">{{ helper }}</span>
            <span v-if="error" class="app-choice__error" :id="errorId">{{ error }}</span>
        </span>
    </label>
</template>

<script setup lang="ts">
type ChoiceType = 'checkbox' | 'radio'

const props = withDefaults(
    defineProps<{
        type?: ChoiceType
        /** checkbox: boolean, radio: string | number | null */
        modelValue: boolean | string | number | null
        value?: string | number
        name?: string
        label?: string
        helper?: string
        error?: string
        disabled?: boolean
        id?: string
    }>(),
    {
        type: 'checkbox',
        disabled: false,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean | string | number | null): void
}>()

const fallbackId = useId()
const inputId = computed(() => props.id ?? `app-choice-${fallbackId}`)
const helperId = computed(() => `${inputId.value}-helper`)
const errorId = computed(() => `${inputId.value}-error`)

const describedBy = computed(() => {
    if (props.error) return errorId.value
    if (props.helper) return helperId.value
    return undefined
})

const isChecked = computed(() => {
    if (props.type === 'checkbox') {
        return !!props.modelValue
    }
    // radio
    if (props.value === undefined) return false
    return props.modelValue === props.value
})

const choiceClasses = computed(() => ({
    'app-choice--checkbox': props.type === 'checkbox',
    'app-choice--radio': props.type === 'radio',
    'is-disabled': props.disabled,
    'is-error': !!props.error,
}))

function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    if (props.type === 'checkbox') {
        emit('update:modelValue', el.checked)
    } else {
        emit('update:modelValue', el.value ?? props.value ?? null)
    }
}
</script>

