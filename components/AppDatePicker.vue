<template>
    <div :class="rootClasses">

        <!-- label -->
        <label v-if="label" class="form-field__label app-date-picker__label" :for="inputId">
            {{ label }}
        </label>

        <!-- control -->
        <div class="form-field__control app-date-picker__control">

            <!-- input -->
            <input :id="inputId" ref="inputEl" class="app-date-picker__field" type="text" :value="displayValue"
                :placeholder="placeholder" :name="name" :disabled="disabled" :readonly="true"
                :aria-invalid="state === 'error'" :aria-describedby="describedBy" />

            <!-- right icon -->
            <span class="app-date-picker__icon app-date-picker__icon--right" aria-hidden="true">
                <slot name="iconRight">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M8 2V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <path d="M16 2V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <path d="M3 9H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" stroke-width="2" />
                    </svg>
                </slot>
            </span>

        </div>

        <!-- hint -->
        <p v-if="hint" class="form-field__hint app-date-picker__hint" :id="hintId">
            {{ hint }}
        </p>

    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import flatpickr from 'flatpickr'
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance'
import type { Options as FlatpickrOptions } from 'flatpickr/dist/types/options'
import 'flatpickr/dist/flatpickr.css'

export type DateRangeValue = {
    start: string | null
    end: string | null
}

type Mode = 'single' | 'range' | 'multiple'
type DatePickerSize = 'xs' | 'sm' | 'md' | 'lg'
type DatePickerShape = 'square' | 'round' | 'pill' | 'underline'
type DatePickerState = 'error' | 'warning' | 'success' | null

const props = withDefaults(
    defineProps<{
        /** single: string|null (YYYY-MM-DD)
         *  range: { start, end } | null
         *  multiple: string[]
         */
        modelValue: string | null | undefined | DateRangeValue | string[]

        label?: string
        hint?: string

        mode?: Mode
        min?: string
        max?: string
        placeholder?: string

        size?: DatePickerSize
        shape?: DatePickerShape
        state?: DatePickerState

        disabled?: boolean

        id?: string
        name?: string
    }>(),
    {
        mode: 'single',
        placeholder: '날짜 선택',
        size: 'md',
        shape: 'round',
        state: null,
        disabled: false
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null | DateRangeValue | string[]): void
}>()

const fallbackId = useId()
const inputEl = ref<HTMLInputElement | null>(null)

let fp: FlatpickrInstance | null = null

const format = 'Y-m-d'

const inputId = computed(() => props.id ?? `app-date-picker-${fallbackId}`)
const hintId = computed(() => `hint-${inputId.value}`)

const describedBy = computed(() => {
    return props.hint ? hintId.value : undefined
})

const rootClasses = computed(() => [
    'form-field',
    'app-date-picker',
    `app-date-picker--${props.size}`,
    `app-date-picker--shape-${props.shape}`,
    {
        'is-disabled': props.disabled,
        [`is-${props.state}`]: props.state
    }
])

const displayValue = computed(() => {
    if (props.mode === 'single') {
        return (props.modelValue as string | null) ?? ''
    }

    if (props.mode === 'multiple') {
        return Array.isArray(props.modelValue)
            ? (props.modelValue as string[]).join(', ')
            : ''
    }

    const rangeValue = props.modelValue as DateRangeValue | null

    if (!rangeValue) {
        return ''
    }

    return [rangeValue.start, rangeValue.end].filter(Boolean).join(' ~ ')
})

function toRangeValue(dates: Date[]): DateRangeValue | null {
    if (!dates.length) {
        return null
    }

    const toString = (date?: Date) => {
        return date ? fp?.formatDate(date, format) ?? null : null
    }

    const start = toString(dates[0])
    const end = toString(dates[1])

    if (!start && !end) {
        return null
    }

    return { start, end }
}

function normalizeIncomingToDates(): Date[] {
    if (props.mode === 'single') {
        const value = props.modelValue as string | null | undefined
        return value ? [new Date(value)] : []
    }

    if (props.mode === 'multiple') {
        const value = props.modelValue as string[] | undefined
        return Array.isArray(value)
            ? value.filter(Boolean).map((date) => new Date(date))
            : []
    }

    const value = props.modelValue as DateRangeValue | null | undefined
    const result: Date[] = []

    if (value?.start) {
        result.push(new Date(value.start))
    }

    if (value?.end) {
        result.push(new Date(value.end))
    }

    return result
}

function onFlatpickrChange(selectedDates: Date[]) {
    if (props.mode === 'single') {
        const date = selectedDates[0]
        emit('update:modelValue', date ? fp?.formatDate(date, format) ?? '' : null)
        return
    }

    if (props.mode === 'multiple') {
        const values = selectedDates
            .map((date) => fp?.formatDate(date, format) ?? '')
            .filter(Boolean)

        emit('update:modelValue', values)
        return
    }

    emit('update:modelValue', toRangeValue(selectedDates))
}

function buildOptions(): Partial<FlatpickrOptions> {
    return {
        mode: props.mode,
        dateFormat: format,
        allowInput: false,
        clickOpens: !props.disabled,
        disableMobile: true,
        minDate: props.min,
        maxDate: props.max,
        onChange: (selectedDates) => onFlatpickrChange(selectedDates)
    }
}

onMounted(() => {
    if (!inputEl.value) {
        return
    }

    fp = flatpickr(inputEl.value, buildOptions() as FlatpickrOptions)

    const initialDates = normalizeIncomingToDates()

    if (initialDates.length) {
        fp.setDate(initialDates, false)
    }
})

onBeforeUnmount(() => {
    fp?.destroy()
    fp = null
})

watch(
    () => [props.modelValue, props.mode, props.min, props.max, props.disabled] as const,
    () => {
        if (!fp) {
            return
        }

        fp.set('mode', props.mode)
        fp.set('minDate', props.min)
        fp.set('maxDate', props.max)
        fp.set('clickOpens', !props.disabled)

        const nextDates = normalizeIncomingToDates()
        fp.setDate(nextDates, false)
    },
    { deep: true }
)
</script>