<template>
    <ClientOnly>
        <component
            :is="chartComponent"
            :key="renderKey"
            :data="data"
            :options="options"
            :class="['app-chart', attrs.class]"
        />
        <template #fallback>
            <div class="app-chart__fallback">차트 로딩 중...</div>
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

const props = defineProps<{
    type: ChartType
    data: ChartData<'line'> | ChartData<'bar'>
    options?: ChartOptions<'line'> | ChartOptions<'bar'>
}>()

const attrs = useAttrs()

const chartComponent = computed(() => {
    return props.type === 'bar' ? Bar : Line
})

const renderKey = computed(() => {
    const labelsLen = Array.isArray((props.data as any)?.labels) ? ((props.data as any).labels as unknown[]).length : 0
    return `${props.type}-${labelsLen}`
})
</script>

<style scoped lang="scss">
.app-chart {
    width: 100%;
    height: 260px;
}

.app-chart__fallback {
    height: 260px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    border: 1px solid rgba(226, 232, 240, 1);
    background: #fff;
    color: rgba(15, 23, 42, 0.7);
    font-size: 13px;
}
</style>

