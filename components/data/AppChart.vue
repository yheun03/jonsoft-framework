<template>
    <ClientOnly>
        <div class="app-chart" :class="wrapperClass" :style="{ height: `${height}px` }">
            <Line
                v-if="type === 'line'"
                :key="renderKey"
                class="app-chart__canvas"
                :data="lineData"
                :options="lineOptions"
                :height="height"
            />
            <Bar
                v-else
                :key="renderKey"
                class="app-chart__canvas"
                :data="barData"
                :options="barOptions"
                :height="height"
            />
        </div>
        <template #fallback>
            <div class="app-chart__fallback" :style="{ height: `${height}px` }">차트 로딩 중...</div>
        </template>
    </ClientOnly>
</template>

<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ChartData,
    type ChartOptions,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

type ChartType = 'line' | 'bar'

const props = withDefaults(
    defineProps<{
        type: ChartType
        data: ChartData<'line'> | ChartData<'bar'>
        options?: ChartOptions<'line'> | ChartOptions<'bar'>
        height?: number
    }>(),
    { height: 260 },
)

const attrs = useAttrs()

const renderKey = computed(() => {
    const labelsLen = Array.isArray((props.data as any)?.labels) ? ((props.data as any).labels as unknown[]).length : 0
    return `${props.type}-${labelsLen}`
})

const height = computed(() => Math.max(120, Math.floor(Number(props.height) || 260)))

const wrapperClass = computed(() => (attrs.class as any) ?? undefined)

// 고정 높이/레이아웃 폭주 방지 기본 옵션
const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
} as const

const lineData = computed(() => props.data as ChartData<'line'>)
const barData = computed(() => props.data as ChartData<'bar'>)
const lineOptions = computed(() => ({ ...baseOptions, ...((props.options as ChartOptions<'line'> | undefined) ?? {}) }))
const barOptions = computed(() => ({ ...baseOptions, ...((props.options as ChartOptions<'bar'> | undefined) ?? {}) }))
</script>

<style scoped lang="scss">
.app-chart {
    width: 100%;
    overflow: hidden;
    position: relative;
}

.app-chart__fallback {
    display: grid;
    place-items: center;
    border-radius: 14px;
    border: 1px solid rgba(226, 232, 240, 1);
    background: #fff;
    color: rgba(15, 23, 42, 0.7);
    font-size: 13px;
}

.app-chart__canvas {
    width: 100%;
    height: 100%;
}
</style>

