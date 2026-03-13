<template>
    <ClientOnly>
        <div class="app-chart" :class="wrapperClass" :style="{ height: `${height}px` }">
            <Line
                v-if="type === 'line'"
                :key="`line-${renderKey}`"
                class="app-chart__canvas"
                :data="chartData"
                :options="mergedOptions"
                :height="height"
            />
            <Bar
                v-else-if="type === 'bar'"
                :key="`bar-${renderKey}`"
                class="app-chart__canvas"
                :data="chartData"
                :options="mergedOptions"
                :height="height"
            />
            <Doughnut
                v-else-if="type === 'doughnut'"
                :key="`doughnut-${renderKey}`"
                class="app-chart__canvas"
                :data="chartData"
                :options="mergedOptions"
                :height="height"
            />
            <Pie
                v-else
                :key="`pie-${renderKey}`"
                class="app-chart__canvas"
                :data="chartData"
                :options="mergedOptions"
                :height="height"
            />
        </div>
        <template #fallback>
            <div class="app-chart__fallback" :style="{ height: `${height}px` }">차트 로딩 중...</div>
        </template>
    </ClientOnly>
</template>

<script setup lang="ts">
import { Bar, Line, Doughnut, Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ChartData,
    type ChartOptions,
    type ChartType as JsChartType,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

type ChartType = 'line' | 'bar' | 'doughnut' | 'pie'

const props = withDefaults(
    defineProps<{
        type: ChartType
        data: ChartData<JsChartType>
        options?: ChartOptions<JsChartType>
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

const chartData = computed<any>(() => props.data)
const mergedOptions = computed<any>(() => ({ ...baseOptions, ...(props.options ?? {}) }))
</script>

