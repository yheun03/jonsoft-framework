<template>
    <div class="app-progress" :class="[`app-progress--${variant}`, `app-progress--${mode}`]">
        <div v-if="variant === 'linear'" class="app-progress__linear">
            <!-- control: single (단일 레인지 슬라이더) -->
            <div v-if="isSingleControl" class="app-progress__control">
                <label v-if="label" class="app-progress__control-label">{{ label }}</label>
                <div
                    ref="singleEl"
                    class="app-progress__noui"
                    role="slider"
                    aria-orientation="horizontal"
                    :aria-valuemin="0"
                    :aria-valuemax="100"
                    :aria-valuenow="clampedValue"
                />
                <div v-if="showLabel" class="app-progress__control-value">{{ clampedValue }}%</div>
            </div>

            <!-- control: range (복합 레인지 - noUiSlider 2핸들) -->
            <div
                v-else-if="isRangeSelectable"
                ref="sliderEl"
                class="app-progress__noui"
                role="group"
                aria-label="프로그레스 범위 선택"
            />

            <!-- display (표시 전용: 단일/범위 표시) -->
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
                        // CSS에서 `calc(var(--start) * 1%)` 형태로 계산하므로 숫자(0~100)로 전달
                        '--start': clampedStart,
                        '--end': clampedEnd,
                    }"
                />
            </div>
        </div>

        <div
            v-else
            class="app-progress__circle"
            :class="{ 'app-progress__circle--half': circularType === 'half' }"
            role="progressbar"
            :aria-valuenow="clamped"
            aria-valuemin="0"
            aria-valuemax="100"
        >
            <svg
                viewBox="0 0 44 44"
                class="app-progress__svg"
                :class="{ 'app-progress__svg--half': circularType === 'half' }"
                aria-hidden="true"
            >
                <circle
                    class="app-progress__ring"
                    cx="22"
                    cy="22"
                    r="18"
                    :stroke-dasharray="ringDashArray"
                    :stroke-dashoffset="ringDashOffset"
                />
                <circle
                    class="app-progress__value"
                    cx="22"
                    cy="22"
                    r="18"
                    :stroke-dasharray="dashArray"
                    :stroke-dashoffset="dashOffset"
                />
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
type Mode = 'display' | 'control-single' | 'control-range'
type CircularType = 'full' | 'half'

const props = withDefaults(
    defineProps<{
        /** 단일 값(0~100) */
        value: number

        /** 범위 값(0~100) - 지정 시 linear에서 start~end 구간만 색상 표시 */
        range?: {
            start: number
            end: number
        }

        /** linear 범위에 thumb 2개로 직접 선택 (레거시) */
        rangeSelectable?: boolean

        /** 표시/컨트롤 모드 (권장) */
        mode?: Mode

        /** control-single 라벨 */
        label?: string

        /** control-single 비활성 */
        disabled?: boolean

        variant?: Variant
        showLabel?: boolean
        /** circular 모양 (full | half) */
        circularType?: CircularType
    }>(),
    {
        variant: 'linear',
        showLabel: false,
        rangeSelectable: false,
        mode: 'display',
        label: undefined,
        disabled: false,
        circularType: 'full',
    },
)

const emit = defineEmits<{
    (e: 'update:range', value: { start: number; end: number }): void
    (e: 'update:value', value: number): void
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

const isSingleControl = computed(() => props.variant === 'linear' && props.mode === 'control-single')
const isRangeSelectable = computed(() => props.variant === 'linear' && !!props.range && (props.mode === 'control-range' || props.rangeSelectable))

const singleEl = ref<HTMLElement | null>(null)
let singleSlider: NoUiSliderApi | null = null

const sliderEl = ref<HTMLElement | null>(null)
let slider: NoUiSliderApi | null = null
let lastEmitted: { start: number; end: number } | null = null

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

    const v = clampedValue.value

    if (!singleSlider) {
        singleSlider = noUiSlider.create(singleEl.value, {
            start: [v],
            connect: [true, false],
            range: { min: 0, max: 100 },
            step: 1,
            behaviour: 'tap-drag',
            animate: false,
            animationDuration: 0,
        })

        const handler = (values: (number | string)[]) => {
            const next = clamp(Number(values[0]))
            emit('update:value', next)
        }
        singleSlider.on('slide', handler)
        singleSlider.on('set', handler)
    } else {
        // 외부에서 value가 바뀐 경우 slider 동기화
        const current = Number((singleSlider.get() as string | string[])[0])
        if (!Number.isNaN(current) && clamp(current) !== v) {
            singleSlider.set([v])
        }
    }

    if (props.disabled) singleSlider.disable()
    else singleSlider.enable()
}

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

onMounted(() => {
    ensureSlider()
    ensureSingleSlider()
})
onBeforeUnmount(() => {
    destroySlider()
    destroySingleSlider()
})

watch([isRangeSelectable, clampedStart, clampedEnd], () => ensureSlider())
watch([isSingleControl, clampedValue, () => props.disabled], () => ensureSingleSlider())

// circular
const r = 18
const c = 2 * Math.PI * r
const circleLen = computed(() => (props.circularType === 'half' ? c / 2 : c))
const ringDashArray = computed(() => `${circleLen.value} ${c}`)
const ringDashOffset = computed(() => 0)
const dashArray = computed(() => `${circleLen.value} ${c}`)
const dashOffset = computed(() => circleLen.value - (clampedValue.value / 100) * circleLen.value)
</script>

<style scoped lang="scss">
@use "@/assets/scss/abstract/index" as *;

.app-progress {
    /* linear 컨트롤/표시 공통 토큰 */
    --app-progress-track-h: 8px;
    --app-progress-thumb: 18px;
    --app-progress-radius: 999px;
}

.app-progress__control {
    display: grid;
    gap: 8px;
}

.app-progress__control-label {
    font-size: 0.875rem;
    color: $gray-800;
}

.app-progress__control-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: var(--app-progress-track-h);
    border-radius: var(--app-progress-radius);
    background: $gray-200;
    outline: none;
    cursor: pointer;
}

.app-progress__control-range:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.app-progress__control-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--app-progress-thumb);
    height: var(--app-progress-thumb);
    border-radius: var(--app-progress-radius);
    background: $primary;
    border: 2px solid $gray-0;
    box-shadow: 0 0 0 1px rgba($primary, 0.25);
    cursor: pointer;
    /* track 높이와 thumb 크기 차이를 자동 보정 */
    margin-top: calc((var(--app-progress-track-h) - var(--app-progress-thumb)) / 2);
}

.app-progress__control-range::-moz-range-thumb {
    width: var(--app-progress-thumb);
    height: var(--app-progress-thumb);
    border-radius: var(--app-progress-radius);
    background: $primary;
    border: 2px solid $gray-0;
    box-shadow: 0 0 0 1px rgba($primary, 0.25);
    cursor: pointer;
}

.app-progress__control-range::-moz-range-track {
    height: var(--app-progress-track-h);
    border-radius: var(--app-progress-radius);
    background: $gray-200;
}

.app-progress__control-value {
    font-size: 0.75rem;
    color: $gray-600;
    text-align: right;
}
.app-progress__linear {
    display: grid;
    gap: 0;
}

.app-progress__track {
    height: var(--app-progress-track-h);
    border-radius: var(--app-progress-radius);
    background: $gray-200;
    overflow: hidden;
    position: relative;
}

.app-progress__bar-range {
    position: absolute;
    left: calc(var(--start) * 1%);
    width: calc((var(--end) - var(--start)) * 1%);
    height: 100%;
    background: $primary;
    border-radius: var(--app-progress-radius);
    transition: none;
}

.app-progress__noui {
    width: 100%;
}

/* noUiSlider 스타일을 기존 트랙 룩앤필에 맞춤 */
:deep(.noUi-target) {
    height: var(--app-progress-track-h);
    border-radius: var(--app-progress-radius);
    background: $gray-200;
    border: 0;
    box-shadow: none;
}

:deep(.noUi-origin),
:deep(.noUi-connect),
:deep(.noUi-handle) {
    transition: none !important;
}

:deep(.noUi-connect) {
    background: $primary;
}

:deep(.noUi-handle) {
    width: var(--app-progress-thumb);
    height: var(--app-progress-thumb);
    border-radius: var(--app-progress-radius);
    border: 2px solid $gray-0;
    background: $primary;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.18);
    right: -9px;
    top: calc((var(--app-progress-track-h) - var(--app-progress-thumb)) / 2);
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

.app-progress__circle--half {
    height: 44px;
    align-items: end;
}

.app-progress__svg--half {
    height: 44px;
    transform: rotate(180deg);
}

.app-progress__ring {
    fill: none;
    stroke: $gray-200;
    stroke-width: 6;
}

.app-progress__value {
    fill: none;
    stroke: $primary;
    stroke-width: 6;
    stroke-linecap: round;
    transition: none;
}

.app-progress__label {
    position: absolute;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.8);
}

.app-progress__circle--half .app-progress__label {
    bottom: 2px;
}
</style>

