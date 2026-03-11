<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">Chart Demo (Chart.js)</h1>
                    <p class="demo__desc">라인/스텝/다중, 바/도넛/반도넛/원형 차트를 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">Line Variants</h2>
                    <div class="grid">
                        <AppChart class="chart-box" type="line" :data="lineData" :options="lineOptions" />
                        <AppChart class="chart-box" type="line" :data="steppedLineData" :options="steppedLineOptions" />
                        <AppChart class="chart-box" type="line" :data="multiLineData" :options="multiLineOptions" />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">Bar / Doughnut / Pie</h2>
                    <div class="grid">
                        <AppChart class="chart-box" type="bar" :data="barData" :options="barOptions" />
                        <AppChart class="chart-box" type="doughnut" :data="doughnutData" :options="doughnutOptions" :height="220" />
                        <AppChart class="chart-box" type="doughnut" :data="halfDoughnutData" :options="doughnutOptions" :height="220" />
                        <AppChart class="chart-box" type="pie" :data="pieData" :options="pieOptions" :height="220" />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">Controls</h2>
                    <div class="controls">
                        <div class="control">
                            <label class="control__label">포인트 수 (Line)</label>
                            <input class="control__range" type="range" min="5" max="20" :value="points" @input="onPoints" />
                            <div class="control__value">{{ points }}</div>
                        </div>
                    </div>
                </section>
            </main>

            <aside class="demo-aside" aria-label="현재 값 패널">
                <div class="demo-aside__sticky">
                    <section class="card">
                        <h2 class="card__title">Actions</h2>
                        <div class="actions">
                            <AppButton variant="fill" @click="randomize">랜덤 데이터</AppButton>
                            <AppButton variant="text" @click="reset">초기화</AppButton>
                        </div>
                    </section>
                    <section class="card">
                        <h2 class="card__title">현재 값</h2>
                        <pre class="output">{{ output }}</pre>
                    </section>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'

const points = ref(12)

const seed = ref<number[]>([])

function makeSeed(n: number) {
    return Array.from({ length: n }, () => Math.round(20 + Math.random() * 80))
}

function makeLabels(n: number) {
    return Array.from({ length: n }, (_, i) => `D${i + 1}`)
}

function randomize() {
    seed.value = makeSeed(points.value)
}

function reset() {
    points.value = 12
    seed.value = makeSeed(12)
}

function onPoints(e: Event) {
    const v = Number((e.target as HTMLInputElement).value)
    points.value = v
    seed.value = makeSeed(v)
}

reset()

// Line 기본
const lineData = computed<ChartData<'line'>>(() => {
    const labels = makeLabels(points.value)
    return {
        labels,
        datasets: [
            {
                label: 'Line',
                data: seed.value,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                fill: true,
                tension: 0.35,
                pointRadius: 3,
            },
        ],
    }
})

const lineOptions = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
    },
    scales: {
        y: { beginAtZero: true, suggestedMax: 100 },
    },
}))

// 뚝뚝 끊기는 스텝 라인
const steppedLineData = computed<ChartData<'line'>>(() => {
    const base = lineData.value
    return {
        ...base,
        datasets: base.datasets.map((ds) => ({
            ...ds,
            label: 'Stepped',
            tension: 0,
            stepped: true as const,
        })),
    }
})

const steppedLineOptions = computed<ChartOptions<'line'>>(() => lineOptions.value)

// 다중 라인
const multiLineData = computed<ChartData<'line'>>(() => {
    const labels = makeLabels(points.value)
    const base = seed.value
    const second = base.map((v) => Math.max(0, Math.min(100, v + (Math.random() * 30 - 15))))
    return {
        labels,
        datasets: [
            {
                label: 'Series A',
                data: base,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                fill: true,
                tension: 0.35,
                pointRadius: 3,
            },
            {
                label: 'Series B',
                data: second,
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.15)',
                fill: true,
                tension: 0.35,
                pointRadius: 3,
            },
        ],
    }
})

const multiLineOptions = computed<ChartOptions<'line'>>(() => lineOptions.value)

// Bar
const barData = computed<ChartData<'bar'>>(() => {
    const labels = makeLabels(points.value)
    return {
        labels,
        datasets: [
            {
                label: 'Bar',
                data: seed.value,
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
            },
        ],
    }
})

const barOptions = computed<ChartOptions<'bar'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
    },
    scales: {
        y: { beginAtZero: true, suggestedMax: 100 },
    },
}))

// 도넛 / 반도넛 / 원형
const pieLabels = ['A', 'B', 'C', 'D']
const pieBaseData = computed(() => makeSeed(pieLabels.length))

const doughnutData = computed<ChartData<'doughnut'>>(() => ({
    labels: pieLabels,
    datasets: [
        {
            label: 'Doughnut',
            data: pieBaseData.value,
            backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#e11d48'],
        },
    ],
}))

// 반 도넛(위가 평평한 반원)
const halfDoughnutData = computed<ChartData<'doughnut'>>(() => ({
    labels: pieLabels,
    datasets: [
        {
            label: 'Half Doughnut',
            data: pieBaseData.value,
            backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#e11d48'],
            circumference: Math.PI,
            rotation: -0.5 * Math.PI,
        },
    ],
}))

const doughnutOptions = computed<ChartOptions<'doughnut'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' },
    },
}))

const pieData = computed<ChartData<'pie'>>(() => ({
    labels: pieLabels,
    datasets: [
        {
            label: 'Pie',
            data: pieBaseData.value,
            backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#e11d48'],
        },
    ],
}))

const pieOptions = computed<ChartOptions<'pie'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' },
    },
}))

const output = computed(() =>
    JSON.stringify(
        {
            points: points.value,
            seed: seed.value,
        },
        null,
        2,
    ),
)
</script>

<style scoped lang="scss">
.demo {
    padding: 16px;
    max-width: 1120px;
}

.demo-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 16px;
    align-items: start;
}

.demo-main {
    display: grid;
    gap: 16px;
    min-width: 0;
}

.demo-aside {
    min-width: 0;
}

.demo-aside__sticky {
    position: sticky;
    top: 16px;
    display: grid;
    gap: 16px;
}

.demo__header {
    display: grid;
    gap: 6px;
}

.demo__title {
    font-size: 18px;
    margin: 0;
}

.demo__desc {
    margin: 0;
    color: rgba(15, 23, 42, 0.7);
    font-size: 13px;
}

.card {
    border: 1px solid rgba(226, 232, 240, 1);
    border-radius: 14px;
    padding: 14px;
    background: #fff;
    display: grid;
    gap: 12px;
}

.card__title {
    margin: 0;
    font-size: 14px;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
}

.control {
    display: grid;
    gap: 6px;
}

.control__label {
    font-size: 0.875rem;
    color: var(--text-primary, #0f172a);
}

.control__range {
    width: 100%;
}

.control__value {
    font-size: 12px;
    color: rgba(15, 23, 42, 0.7);
}

.output {
    margin: 0;
    padding: 12px;
    background: rgba(15, 23, 42, 0.04);
    border-radius: 12px;
    overflow: auto;
    font-size: 12px;
    // max-height: calc(100dvh - 220px);
}

.grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}

.chart-box {
    border-radius: 12px;
    border: 1px solid rgba(226, 232, 240, 1);
    background: #fff;
    padding: 8px;
}

@media (max-width: 900px) {
    .demo-layout {
        grid-template-columns: 1fr;
    }
    .demo-aside__sticky {
        position: static;
        top: auto;
    }
    .controls {
        grid-template-columns: 1fr;
    }
}
</style>

