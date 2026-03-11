<template>
    <div class="app-progress" :class="`app-progress--${variant}`">
        <div v-if="variant === 'linear'" class="app-progress__linear">
            <!-- 범위 선택: noUiSlider(2 핸들) -->
            <div
                v-if="isRangeSelectable"
                ref="sliderEl"
                class="app-progress__noui"
                role="group"
                aria-label="프로그레스 범위 선택"
            />

            <!-- 표시 전용 -->
            <div
                v-else
                class="app-progress__track"
                role="progressbar"
                :aria-valuenow="clampedEnd"
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <div
                    class="app-progress__bar-range"
                    :style="{
                        '--start': `${clampedStart}%`,
                        '--end': `${clampedEnd}%`,
                    }"
                />
            </div>
        </div>

        <div
            v-else
            class="app-progress__circle"
            role="progressbar"
            :aria-valuenow="clamped"
            aria-valuemin="0"
            aria-valuemax="100"
        >
            <svg viewBox="0 0 44 44" class="app-progress__svg" aria-hidden="true">
                <circle class="app-progress__ring" cx="22" cy="22" r="18" />
                <circle class="app-progress__value" cx="22" cy="22" r="18" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" />
            </svg>
            <span v-if="showLabel" class="app-progress__label">{{ clamped }}%</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import noUiSlider from 'nouislider'
import type { API as NoUiSliderApi } from 'nouislider'
import 'nouislider/dist/nouislider.css'

type Variant = 'linear' | 'circular'

const props = withDefaults(
    defineProps<{
        /** 단일 값(0~100) */
        value: number

        /** 범위 값(0~100) - 지정 시 linear에서 start~end 구간만 색상 표시 */
        range?: {
            start: number
            end: number
        }

        /** linear 범위에 thumb 2개로 직접 선택 */
        rangeSelectable?: boolean

        variant?: Variant
        showLabel?: boolean
    }>(),
    { variant: 'linear', showLabel: false, rangeSelectable: false },
)

const emit = defineEmits<{
    (e: 'update:range', value: { start: number; end: number }): void
}>()

const clamp = (v: number) => {
    const n = Number(v)
    if (Number.isNaN(n)) return 0
    return Math.min(100, Math.max(0, Math.round(n)))
}

const clampedValue = computed(() => clamp(props.value))
const clamped = computed(() => clampedValue.value)

const clampedStart = computed(() => {
    if (!props.range) return 0
    return clamp(Math.min(props.range.start, props.range.end))
})

const clampedEnd = computed(() => {
    if (!props.range) return clampedValue.value
    return clamp(Math.max(props.range.start, props.range.end))
})

const isRangeSelectable = computed(() => props.variant === 'linear' && !!props.range && props.rangeSelectable)

const sliderEl = ref<HTMLElement | null>(null)
let slider: NoUiSliderApi | null = null
let lastEmitted: { start: number; end: number } | null = null

function destroySlider() {
    if (!slider) return
    slider.destroy()
    slider = null
}

function ensureSlider() {
    if (!isRangeSelectable.value) {
        destroySlider()
        return
    }
    if (!sliderEl.value) return

    const start = clampedStart.value
    const end = clampedEnd.value

    if (!slider) {
        slider = noUiSlider.create(sliderEl.value, {
            start: [start, end],
            connect: true,
            range: { min: 0, max: 100 },
            step: 1,
            behaviour: 'tap-drag',
            animate: false,
            animationDuration: 0,
        })

        // 드래그 중 실시간 반영은 slide, 드래그 종료 시 점검은 set 에서도 동일 로직 사용
        const handler = (values: (number | string)[]) => {
            const s = clamp(Number(values[0]))
            const e = clamp(Number(values[1]))
            const next = { start: s, end: e }
            if (lastEmitted && lastEmitted.start === next.start && lastEmitted.end === next.end) return
            lastEmitted = next
            emit('update:range', next)
        }

        slider.on('slide', handler)
        slider.on('set', handler)
    } else {
        const next = { start, end }
        if (!lastEmitted || lastEmitted.start !== next.start || lastEmitted.end !== next.end) {
            slider.set([start, end])
        }
    }
}

onMounted(() => ensureSlider())
onBeforeUnmount(() => destroySlider())

watch([isRangeSelectable, clampedStart, clampedEnd], () => ensureSlider())

// circular
const r = 18
const c = 2 * Math.PI * r
const dashArray = computed(() => `${c} ${c}`)
const dashOffset = computed(() => c - (clampedValue.value / 100) * c)
</script>

<style scoped lang="scss">
.app-progress__linear {
    display: grid;
    gap: 0;
}

.app-progress__track {
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    overflow: hidden;
    position: relative;
}

.app-progress__bar-range {
    position: absolute;
    left: calc(var(--start) * 1%);
    width: calc((var(--end) - var(--start)) * 1%);
    height: 100%;
    background: var(--color-primary, #3b82f6);
    border-radius: 999px;
    transition: none;
}

.app-progress__noui {
    width: 100%;
}

/* noUiSlider 스타일을 기존 트랙 룩앤필에 맞춤 */
:deep(.noUi-target) {
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    border: 0;
    box-shadow: none;
}

:deep(.noUi-origin),
:deep(.noUi-connect),
:deep(.noUi-handle) {
    transition: none !important;
}

:deep(.noUi-connect) {
    background: var(--color-primary, #3b82f6);
}

:deep(.noUi-handle) {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    border: 2px solid #fff;
    background: var(--color-primary, #3b82f6);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
    right: -9px;
    top: -4px;
}

:deep(.noUi-handle::before),
:deep(.noUi-handle::after) {
    display: none;
}

.app-progress__circle {
    position: relative;
    width: 80px;
    height: 80px;
    display: grid;
    place-items: center;
}

.app-progress__svg {
    width: 80px;
    height: 80px;
    transform: rotate(-90deg);
}

.app-progress__ring {
    fill: none;
    stroke: rgba(15, 23, 42, 0.08);
    stroke-width: 6;
}

.app-progress__value {
    fill: none;
    stroke: var(--color-primary, #3b82f6);
    stroke-width: 6;
    stroke-linecap: round;
    transition: none;
}

.app-progress__label {
    position: absolute;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.8);
}
</style>

