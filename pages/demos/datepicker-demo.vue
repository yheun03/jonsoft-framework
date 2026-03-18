<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">DatePicker Demo</h1>
                    <p class="page-demo__desc">Flatpickr 기반 데이트피커(단일/범위/다중, min/max, 검증)를 확인합니다.</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">기본</h2>
                    <div class="page-demo-grid">
                        <AppDatePicker v-model="single" label="단일 날짜" helper="flatpickr-input (single)" />
                        <AppDatePicker v-model="range" mode="range" label="범위 날짜" helper="range" />
                        <AppDatePicker v-model="multiple" mode="multiple" label="다중 날짜" helper="multiple" />
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">제약/검증</h2>
                    <div class="page-demo-grid">
                        <AppDatePicker v-model="singleMinMax" label="min/max" :min="min" :max="max" helper="min/max 적용" />
                        <AppDatePicker v-model="requiredSingle" label="필수(단일)" :error="requiredError" helper="비어있으면 에러" />
                        <AppDatePicker v-model="requiredRange" mode="range" label="필수(범위)" :error="requiredRangeError" helper="start/end 필요" />
                    </div>
                </section>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Actions</h2>
                        <div class="page-demo-actions">
                            <AppButton variant="primary" @click="submit">검증</AppButton>
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

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->

