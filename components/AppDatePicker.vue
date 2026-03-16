<template>
    <div class="app-date-picker" :class="{ 'is-disabled': disabled, 'is-error': !!error }">
        <label v-if="label" class="app-date-picker__label" :for="inputId">{{ label }}</label>

        <input
            :id="inputId"
            class="app-date-picker__field"
            type="text"
            :value="displayValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :aria-invalid="!!error"
            :aria-describedby="describedBy"
            readonly
            ref="inputEl"
        />

        <p v-if="helper && !error" class="app-date-picker__helper" :id="helperId">{{ helper }}</p>
        <p v-if="error" class="app-date-picker__error" :id="errorId">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import flatpickr from 'flatpickr'
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance'
import type { Options as FlatpickrOptions } from 'flatpickr/dist/types/options'
import 'flatpickr/dist/flatpickr.css'

export type DateRangeValue = { start: string | null; end: string | null }
type Mode = 'single' | 'range' | 'multiple'

const props = withDefaults(
    defineProps<{
        /** single: string|null (YYYY-MM-DD)
         *  range: {start,end}|null
         *  multiple: string[] */
        modelValue: string | null | undefined | DateRangeValue | string[]
        label?: string
        mode?: Mode
        helper?: string
        error?: string
        min?: string
        max?: string
        placeholder?: string
        disabled?: boolean
        id?: string
    }>(),
    { disabled: false, mode: 'single', placeholder: '날짜 선택' },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null | DateRangeValue | string[]): void
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

const inputEl = ref<HTMLInputElement | null>(null)
let fp: FlatpickrInstance | null = null

const format = 'Y-m-d'

function toRangeValue(dates: Date[]): DateRangeValue | null {
    if (!dates?.length) return null
    const toStr = (d?: Date) => (d ? fp?.formatDate(d, format) ?? null : null)
    const start = toStr(dates[0])
    const end = toStr(dates[1])
    if (!start && !end) return null
    return { start, end }
}

function normalizeIncomingToDates(): Date[] {
    if (props.mode === 'single') {
        const v = props.modelValue as string | null | undefined
        return v ? [new Date(v)] : []
    }
    if (props.mode === 'multiple') {
        const v = props.modelValue as string[] | undefined
        return Array.isArray(v) ? v.filter(Boolean).map((s) => new Date(s)) : []
    }
    // range
    const v = props.modelValue as DateRangeValue | null | undefined
    const out: Date[] = []
    if (v?.start) out.push(new Date(v.start))
    if (v?.end) out.push(new Date(v.end))
    return out
}

const displayValue = computed(() => {
    if (props.mode === 'single') return (props.modelValue as string | null) ?? ''
    if (props.mode === 'multiple') return Array.isArray(props.modelValue) ? (props.modelValue as string[]).join(', ') : ''
    const r = props.modelValue as DateRangeValue | null
    if (!r) return ''
    return [r.start, r.end].filter(Boolean).join(' ~ ')
})

function onFlatpickrChange(selectedDates: Date[]) {
    if (props.mode === 'single') {
        const d = selectedDates[0]
        emit('update:modelValue', d ? fp?.formatDate(d, format) ?? '' : null)
        return
    }
    if (props.mode === 'multiple') {
        const arr = selectedDates.map((d) => fp?.formatDate(d, format) ?? '').filter(Boolean)
        emit('update:modelValue', arr)
        return
    }
    emit('update:modelValue', toRangeValue(selectedDates))
}

function buildOptions(): Partial<FlatpickrOptions> {
    return {
        mode: props.mode,
        dateFormat: format,
        allowInput: false,
        disableMobile: true,
        minDate: props.min,
        maxDate: props.max,
        onChange: (selectedDates) => onFlatpickrChange(selectedDates),
    }
}

onMounted(() => {
    if (!inputEl.value) return
    fp = flatpickr(inputEl.value, buildOptions() as FlatpickrOptions)
    const initDates = normalizeIncomingToDates()
    if (initDates.length) fp.setDate(initDates, false)
})

onBeforeUnmount(() => {
    fp?.destroy()
    fp = null
})

watch(
    () => [props.modelValue, props.mode, props.min, props.max, props.disabled] as const,
    () => {
        if (!fp) return
        fp.set('mode', props.mode)
        fp.set('minDate', props.min)
        fp.set('maxDate', props.max)
        fp.set('disable', props.disabled ? [() => true] : [])
        const nextDates = normalizeIncomingToDates()
        fp.setDate(nextDates, false)
    },
    { deep: true },
)
</script>

