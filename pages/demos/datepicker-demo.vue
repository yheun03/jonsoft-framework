<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">DatePicker Demo</h1>
                    <p class="demo__desc">Flatpickr 기반 데이트피커(단일/범위/다중, min/max, 검증)를 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">기본</h2>
                    <div class="grid">
                        <AppDatePicker v-model="single" label="단일 날짜" helper="flatpickr-input (single)" />
                        <AppDatePicker v-model="range" mode="range" label="범위 날짜" helper="range" />
                        <AppDatePicker v-model="multiple" mode="multiple" label="다중 날짜" helper="multiple" />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">제약/검증</h2>
                    <div class="grid">
                        <AppDatePicker v-model="singleMinMax" label="min/max" :min="min" :max="max" helper="min/max 적용" />
                        <AppDatePicker v-model="requiredSingle" label="필수(단일)" :error="requiredError" helper="비어있으면 에러" />
                        <AppDatePicker v-model="requiredRange" mode="range" label="필수(범위)" :error="requiredRangeError" helper="start/end 필요" />
                    </div>
                </section>
            </main>

            <aside class="demo-aside" aria-label="현재 값 패널">
                <div class="demo-aside__sticky">
                    <section class="card">
                        <h2 class="card__title">Actions</h2>
                        <div class="actions">
                            <AppButton variant="fill" @click="submit">검증</AppButton>
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
import type { DateRangeValue } from '~/components/base/AppDatePicker.vue'

const single = ref<string | null>(null)
const range = ref<DateRangeValue | null>(null)
const multiple = ref<string[]>([])

const singleMinMax = ref<string | null>(null)
const requiredSingle = ref<string | null>(null)
const requiredRange = ref<DateRangeValue | null>(null)
const submitted = ref(false)

const min = '2026-01-01'
const max = '2026-12-31'

const requiredError = computed(() => {
    if (!submitted.value) return undefined
    return requiredSingle.value ? undefined : '필수 입력입니다.'
})

const requiredRangeError = computed(() => {
    if (!submitted.value) return undefined
    return requiredRange.value?.start && requiredRange.value?.end ? undefined : '시작/종료 날짜 모두 입력해주세요.'
})

function submit() {
    submitted.value = true
}

function reset() {
    single.value = null
    range.value = null
    multiple.value = []
    singleMinMax.value = null
    requiredSingle.value = null
    requiredRange.value = null
    submitted.value = false
}

const output = computed(() =>
    JSON.stringify(
        {
            single: single.value,
            range: range.value,
            multiple: multiple.value,
            singleMinMax: singleMinMax.value,
            requiredSingle: requiredSingle.value,
            requiredRange: requiredRange.value,
            submitted: submitted.value,
            min,
            max,
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

.grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.output {
    margin: 0;
    padding: 12px;
    background: rgba(15, 23, 42, 0.04);
    border-radius: 12px;
    overflow: auto;
    font-size: 12px;
    max-height: calc(100dvh - 220px);
}

@media (max-width: 900px) {
    .demo-layout {
        grid-template-columns: 1fr;
    }
    .demo-aside__sticky {
        position: static;
        top: auto;
    }
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>

