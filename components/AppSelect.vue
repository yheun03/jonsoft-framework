<template>
    <div ref="rootEl" :class="rootClasses">
        <!-- label -->
        <label v-if="label" class="form-field__label app-select__label" :for="triggerId">
            {{ label }}
        </label>

        <!-- control -->
        <div class="form-field__control app-select__control">
            <button :id="triggerId" ref="triggerEl" type="button" class="app-select__trigger" :name="name"
                :disabled="disabled" :aria-invalid="state === 'error'" :aria-describedby="describedBy"
                :aria-expanded="isOpen" :aria-controls="menuId" aria-haspopup="listbox" @click="toggle"
                @keydown="onTriggerKeydown">
                <span class="app-select__value" :class="{ 'app-select__value--placeholder': !selectedOption }">
                    <span v-if="selectedOption" v-html="selectedOption.label" />
                    <span v-else>{{ placeholder }}</span>
                </span>

                <span class="app-select__icon app-select__icon--right" aria-hidden="true">
                    <slot name="iconRight">
                        <Icon icon="mdi:chevron-down" />
                    </slot>
                </span>
            </button>

            <ul v-if="isOpen" :id="menuId" class="app-select__menu" role="listbox" :aria-labelledby="triggerId">
                <li v-if="placeholder && !required" :id="getOptionId('__placeholder__')" class="app-select__option"
                    :class="{ 'is-selected': modelValue === null }" role="option" :aria-selected="modelValue === null"
                    @click="selectNull">
                    {{ placeholder }}
                </li>

                <li v-for="opt in options" :id="getOptionId(opt.value)" :key="opt.value" class="app-select__option"
                    :class="{
                        'is-selected': modelValue === opt.value,
                        'is-disabled': !!opt.disabled
                    }" role="option" :aria-selected="modelValue === opt.value" :aria-disabled="!!opt.disabled"
                    @click="selectOption(opt)">
                    <span v-html="opt.label" />
                </li>
            </ul>
        </div>

        <!-- hint -->
        <p v-if="hint" :id="hintId" class="form-field__hint app-select__hint">
            {{ hint }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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
    (e: 'change', value: string | null): void
}>()

const fallbackId = useId()

const rootEl = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLButtonElement | null>(null)
const isOpen = ref(false)

const triggerId = computed(() => props.id ?? `app-select-${fallbackId}`)
const menuId = computed(() => `${triggerId.value}-menu`)
const hintId = computed(() => `${triggerId.value}-hint`)

const describedBy = computed(() => {
    return props.hint ? hintId.value : undefined
})

const selectedOption = computed(() => {
    return props.options.find((opt) => opt.value === props.modelValue) ?? null
})

const rootClasses = computed(() => [
    'form-field',
    'app-select',
    `app-select--${props.size}`,
    `app-select--shape-${props.shape}`,
    {
        'app-select--open': isOpen.value,
        'is-disabled': props.disabled,
        [`is-${props.state}`]: props.state
    }
])

function getOptionId(value: string) {
    return `${triggerId.value}-option-${value}`
}

function open() {
    if (props.disabled) return
    isOpen.value = true
}

function close() {
    isOpen.value = false
}

function toggle() {
    if (props.disabled) return
    isOpen.value = !isOpen.value
}

function updateValue(value: string | null) {
    emit('update:modelValue', value)
    emit('change', value)
    close()
}

function selectNull() {
    if (props.required) return
    updateValue(null)
}

function selectOption(option: AppSelectOption) {
    if (option.disabled) return
    updateValue(option.value)
}

function focusNextEnabledOption(direction: 'next' | 'prev') {
    const enabledOptions = props.options.filter((opt) => !opt.disabled)

    if (!enabledOptions.length) return

    const currentIndex = enabledOptions.findIndex((opt) => opt.value === props.modelValue)

    if (direction === 'next') {
        const nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0
        updateValue(enabledOptions[nextIndex].value)
        return
    }

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1
    updateValue(enabledOptions[prevIndex].value)
}

function onTriggerKeydown(e: KeyboardEvent) {
    if (props.disabled) return

    switch (e.key) {
        case 'Enter':
        case ' ':
            e.preventDefault()
            toggle()
            break

        case 'Escape':
            close()
            break

        case 'ArrowDown':
            e.preventDefault()

            if (!isOpen.value) {
                open()
                return
            }

            focusNextEnabledOption('next')
            break

        case 'ArrowUp':
            e.preventDefault()

            if (!isOpen.value) {
                open()
                return
            }

            focusNextEnabledOption('prev')
            break
    }
}

function onDocumentClick(e: MouseEvent) {
    if (!isOpen.value) return
    if (!rootEl.value?.contains(e.target as Node)) {
        close()
    }
}

function onDocumentKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        close()
        triggerEl.value?.focus()
    }
}

onMounted(() => {
    document.addEventListener('mousedown', onDocumentClick)
    document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onDocumentClick)
    document.removeEventListener('keydown', onDocumentKeydown)
})
</script>