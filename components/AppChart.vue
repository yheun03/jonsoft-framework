<template>
    <ClientOnly>
        <div class="app-chart" :class="wrapperClasses" :style="{ height: `${resolvedHeight}px` }">
            <Line v-if="resolvedType === 'line'" :key="renderKey" class="app-chart__canvas" :data="lineData"
                :options="lineOptions" />

            <Bar v-else-if="resolvedType === 'bar'" :key="renderKey" class="app-chart__canvas" :data="barData"
                :options="barOptions" />

            <Doughnut v-else-if="resolvedType === 'doughnut'" :key="renderKey" class="app-chart__canvas"
                :data="doughnutData" :options="doughnutOptions" />

            <Pie v-else :key="renderKey" class="app-chart__canvas" :data="pieData" :options="pieOptions" />
        </div>

        <template #fallback>
            <div class="app-chart__fallback" :style="{ height: `${resolvedHeight}px` }">
                차트 로딩 중...
            </div>
        </template>
    </ClientOnly>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
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
} from 'chart.js'

ChartJS.register(
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
)

type ChartType = 'line' | 'bar' | 'doughnut' | 'pie'
type ChartVariant = 'default' | 'semi-doughnut'

const props = withDefaults(
    defineProps<{
        type: ChartType
        data: ChartData<ChartType>
        options?: ChartOptions<ChartType>
        height?: number
        variant?: ChartVariant
        cutout?: string | number
    }>(),
    {
        height: 260,
        variant: 'default',
        cutout: '68%',
    },
)

const attrs = useAttrs()

function isObject(value: unknown): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepMerge<T extends Record<string, any>>(...sources: T[]): T {
    const result: Record<string, any> = {}

    for (const source of sources) {
        if (!isObject(source)) continue

        for (const key of Object.keys(source)) {
            const prev = result[key]
            const next = source[key]

            if (Array.isArray(next)) {
                result[key] = next.slice()
                continue
            }

            if (isObject(prev) && isObject(next)) {
                result[key] = deepMerge(prev, next)
                continue
            }

            result[key] = next
        }
    }

    return result as T
}

const resolvedType = computed<ChartType>(() => {
    return props.variant === 'semi-doughnut' ? 'doughnut' : props.type
})

const resolvedHeight = computed(() => {
    if (props.variant === 'semi-doughnut') {
        return Math.max(220, Math.floor(Number(props.height) || 260))
    }

    return Math.max(120, Math.floor(Number(props.height) || 260))
})

const wrapperClasses = computed(() => [
    attrs.class,
    {
        'app-chart--semi-doughnut': props.variant === 'semi-doughnut',
    },
])

const baseOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
}

const semiDoughnutOptions: ChartOptions<'doughnut'> = {
    rotation: -90,
    circumference: 180,
    cutout: props.cutout,
    layout: {
        padding: {
            top: 16,
            right: 16,
            bottom: 0,
            left: 16,
        },
    },
    plugins: {
        legend: {
            position: 'bottom',
            align: 'center',
            labels: {
                boxWidth: 14,
                boxHeight: 14,
                padding: 12,
                usePointStyle: false,
            },
        },
    },
}

const mergedOptions = computed(() => {
    if (props.variant === 'semi-doughnut') {
        return deepMerge(
            baseOptions as Record<string, any>,
            semiDoughnutOptions as Record<string, any>,
            (props.options ?? {}) as Record<string, any>,
        )
    }

    return deepMerge(
        baseOptions as Record<string, any>,
        (props.options ?? {}) as Record<string, any>,
    )
})

const chartData = computed(() => {
    if (props.variant !== 'semi-doughnut') {
        return props.data
    }

    return {
        ...props.data,
        datasets: (props.data.datasets ?? []).map((dataset: any) => ({
            ...dataset,
            borderWidth: dataset.borderWidth ?? 0,
            cutout: dataset.cutout ?? props.cutout,
        })),
    } as ChartData<'doughnut'>
})

const lineData = computed(() => props.data as ChartData<'line'>)
const barData = computed(() => props.data as ChartData<'bar'>)
const doughnutData = computed(() => chartData.value as ChartData<'doughnut'>)
const pieData = computed(() => props.data as ChartData<'pie'>)

const lineOptions = computed(() => mergedOptions.value as ChartOptions<'line'>)
const barOptions = computed(() => mergedOptions.value as ChartOptions<'bar'>)
const doughnutOptions = computed(() => mergedOptions.value as ChartOptions<'doughnut'>)
const pieOptions = computed(() => mergedOptions.value as ChartOptions<'pie'>)

const renderKey = computed(() => {
    return JSON.stringify({
        type: resolvedType.value,
        variant: props.variant,
        height: resolvedHeight.value,
        labels: props.data?.labels ?? [],
        datasets: props.data?.datasets?.map((dataset: any) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
            borderColor: dataset.borderColor,
        })),
    })
})
</script>