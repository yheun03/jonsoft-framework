<template>
    <div class="app-progress" :class="[`app-progress--${variant}`, `app-progress--${mode}`]">
        <!-- ------------------------------------------------------------------ -->
        <!-- linear -->
        <!-- ------------------------------------------------------------------ -->
        <div class="app-progress__linear">
            <!-- single control -->
            <div v-if="isSingleControl" class="app-progress__control">
                <label v-if="label" class="app-progress__control-label">{{ label }}</label>

                <div ref="singleEl" class="app-progress__noui" role="slider" aria-orientation="horizontal"
                    :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="clampedValue" />

                <div v-if="showLabel" class="app-progress__control-value">{{ clampedValue }}%</div>
            </div>

            <!-- range control -->
            <div v-else-if="isRangeSelectable" ref="sliderEl" class="app-progress__noui" role="group"
                aria-label="프로그레스 범위 선택" />

            <!-- display -->
            <div v-else class="app-progress__track" role="progressbar" :aria-valuenow="displayEnd" aria-valuemin="0"
                aria-valuemax="100">
                <div class="app-progress__bar-range" :style="{
                    '--start': displayStart,
                    '--end': displayEnd,
                }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import noUiSlider from 'nouislider'
import type { API as NoUiSliderApi } from 'nouislider'
import 'nouislider/dist/nouislider.css'

type Variant = 'linear'
type Mode = 'display' | 'control-single' | 'control-range'

const props = withDefaults(
    defineProps<{
        value: number
        range?: { start: number; end: number }
        rangeSelectable?: boolean
        mode?: Mode
        label?: string
        disabled?: boolean
        variant?: Variant
        showLabel?: boolean
    }>(),
    {
        variant: 'linear',
        showLabel: false,
        rangeSelectable: false,
        mode: 'display',
        label: undefined,
        disabled: false,
    },
)

const emit = defineEmits<{
    (e: 'update:range', value: { start: number; end: number }): void
    (e: 'update:value', value: number): void
}>()

/* -------------------------------------------------------------------------- */
/* 지역변수 */
/* -------------------------------------------------------------------------- */
function clamp(value: number) {
    const n = Number(value)
    if (Number.isNaN(n)) return 0
    return Math.min(100, Math.max(0, Math.round(n)))
}

/* -------------------------------------------------------------------------- */
/* common */
/* -------------------------------------------------------------------------- */
const clampedValue = computed(() => clamp(props.value))

const displayStart = computed(() => {
    if (!props.range) return 0
    return clamp(Math.min(props.range.start, props.range.end))
})

const displayEnd = computed(() => {
    if (!props.range) return clampedValue.value
    return clamp(Math.max(props.range.start, props.range.end))
})

const isSingleControl = computed(() => props.variant === 'linear' && props.mode === 'control-single')
const isRangeSelectable = computed(() => {
    return props.variant === 'linear' && !!props.range && (props.mode === 'control-range' || props.rangeSelectable)
})

/* -------------------------------------------------------------------------- */
/* 단일 선택 (control-single) */
/* -------------------------------------------------------------------------- */
const singleEl = ref<HTMLElement | null>(null)
let singleSlider: NoUiSliderApi | null = null

function destroySingleSlider() {
    if (!singleSlider) return
    singleSlider.destroy()
    singleSlider = null
}

function ensureSingleSlider() {
    if (!isSingleControl.value) {
        destroySingleSlider()
        return
    }
    if (!singleEl.value) return

    const nextValue = clampedValue.value

    if (!singleSlider) {
        singleSlider = noUiSlider.create(singleEl.value, {
            start: [nextValue],
            connect: [true, false],
            range: { min: 0, max: 100 },
            step: 1,
            behaviour: 'tap-drag',
            animate: false,
            animationDuration: 0,
        })

        const handleSingle = (values: (number | string)[]) => {
            const next = clamp(Number(values[0]))
            emit('update:value', next)
        }

        singleSlider.on('slide', handleSingle)
        singleSlider.on('set', handleSingle)
    } else {
        const raw = singleSlider.get()
        const current = Number(Array.isArray(raw) ? raw[0] : raw)

        if (!Number.isNaN(current) && clamp(current) !== nextValue) {
            singleSlider.set([nextValue])
        }
    }

    if (props.disabled) singleSlider.disable()
    else singleSlider.enable()
}

/* -------------------------------------------------------------------------- */
/* 다중 선택 (control-range) */
/* -------------------------------------------------------------------------- */
const sliderEl = ref<HTMLElement | null>(null)
let rangeSlider: NoUiSliderApi | null = null
let lastRange: { start: number; end: number } | null = null

function destroyRangeSlider() {
    if (!rangeSlider) return
    rangeSlider.destroy()
    rangeSlider = null
    lastRange = null
}

function ensureRangeSlider() {
    if (!isRangeSelectable.value) {
        destroyRangeSlider()
        return
    }
    if (!sliderEl.value) return

    const start = displayStart.value
    const end = displayEnd.value

    if (!rangeSlider) {
        rangeSlider = noUiSlider.create(sliderEl.value, {
            start: [start, end],
            connect: true,
            range: { min: 0, max: 100 },
            step: 1,
            behaviour: 'tap-drag',
            animate: false,
            animationDuration: 0,
        })

        const handleRange = (values: (number | string)[]) => {
            const s = clamp(Number(values[0]))
            const e = clamp(Number(values[1]))
            const next = { start: Math.min(s, e), end: Math.max(s, e) }
            if (lastRange && lastRange.start === next.start && lastRange.end === next.end) return
            lastRange = next
            emit('update:range', next)
        }

        rangeSlider.on('slide', handleRange)
        rangeSlider.on('set', handleRange)
    } else {
        const raw = rangeSlider.get()
        const current = Array.isArray(raw)
            ? { start: clamp(Number(raw[0])), end: clamp(Number(raw[1])) }
            : { start, end }

        if (current.start !== start || current.end !== end) {
            rangeSlider.set([start, end])
        }
    }
}

onMounted(() => {
    ensureSingleSlider()
    ensureRangeSlider()
})

onBeforeUnmount(() => {
    destroySingleSlider()
    destroyRangeSlider()
})

watch([isSingleControl, clampedValue, () => props.disabled], () => {
    ensureSingleSlider()
})

watch([isRangeSelectable, displayStart, displayEnd], () => {
    ensureRangeSlider()
})
</script>