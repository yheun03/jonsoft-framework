<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">Chart Demo (Chart.js)</h1>
                    <p class="page-demo__desc">라인/스텝/다중, 바/도넛/반도넛/원형 차트를 확인합니다.</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Line Variants</h2>
                    <div class="page-demo-grid">
                        <client-only>
                            <AppChart class="page-demo-chart-box" type="line" :data="lineData" :options="lineOptions" />
                        </client-only>
                        <client-only>
                            <AppChart class="page-demo-chart-box" type="line" :data="steppedLineData" :options="steppedLineOptions" />
                        </client-only>
                        <client-only>
                            <AppChart class="page-demo-chart-box" type="line" :data="multiLineData" :options="multiLineOptions" />
                        </client-only>
                        <client-only>
                            <AppChart class="page-demo-chart-box" type="line" :data="multiLineData" :options="multiLineOptions" />
                        </client-only>
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Bar / Doughnut / Pie</h2>
                    <div class="page-demo-grid">
                        <client-only>
                            <AppChart class="page-demo-chart-box" type="bar" :data="barData" :options="barOptions" />
                        </client-only>
                        <client-only>
                            <AppChart class="page-demo-chart-box" type="doughnut" :data="doughnutData" :options="doughnutOptions" :height="220" />
                        </client-only>
                        <client-only>
                            <AppChart class="page-demo-chart-box" type="doughnut" :data="halfDoughnutData" :options="doughnutOptions" :height="220" />
                        </client-only>
                        <client-only>
                            <AppChart class="page-demo-chart-box" type="pie" :data="pieData" :options="pieOptions" :height="220" />
                        </client-only>
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Controls</h2>
                    <div class="page-demo-controls">
                        <div class="page-demo-control">
                            <label class="page-demo-control__label">포인트 수 (Line)</label>
                            <input class="page-demo-control__range" type="range" min="5" max="20" :value="points" @input="onPoints" />
                            <div class="page-demo-control__value">{{ points }}</div>
                        </div>
                    </div>
                </section>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Actions</h2>
                        <div class="page-demo-actions">
                            <AppButton variant="primary" @click="randomize">랜덤 데이터</AppButton>
                            <AppButton variant="text" @click="reset">초기화</AppButton>
                        </div>
                    </section>
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">현재 값</h2>
                        <pre class="page-demo-output">{{ output }}</pre>
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

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->

