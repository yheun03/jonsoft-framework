<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">Chart Demo (Chart.js)</h1>
                    <p class="demo__desc">라인/바 전환, 데이터 랜덤 변경을 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">Chart</h2>
                    <AppChart :type="chartType" :data="chartData" :options="chartOptions" />
                </section>

                <section class="card">
                    <h2 class="card__title">Controls</h2>
                    <div class="controls">
                        <AppSelect
                            v-model="chartType"
                            label="차트 타입"
                            :options="[
                                { value: 'line', label: 'Line' },
                                { value: 'bar', label: 'Bar' },
                            ]"
                        />
                        <div class="control">
                            <label class="control__label">포인트 수</label>
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

type ChartType = 'line' | 'bar'

const chartType = ref<ChartType>('line')
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
    chartType.value = 'line'
}

function onPoints(e: Event) {
    const v = Number((e.target as HTMLInputElement).value)
    points.value = v
    seed.value = makeSeed(v)
}

reset()

const chartData = computed<ChartData<'line'> | ChartData<'bar'>>(() => {
    const labels = makeLabels(points.value)
    return {
        labels,
        datasets: [
            {
                label: 'Score',
                data: seed.value,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.25)',
                fill: true,
                tension: 0.35,
            },
        ],
    } as ChartData<'line'> | ChartData<'bar'>
})

const chartOptions = computed<ChartOptions<'line'> | ChartOptions<'bar'>>(() => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
        },
        scales: {
            y: { beginAtZero: true, suggestedMax: 100 },
        },
    } as ChartOptions<'line'> | ChartOptions<'bar'>
})

const output = computed(() => JSON.stringify({ chartType: chartType.value, points: points.value, data: seed.value }, null, 2))
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
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    align-items: end;
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

