<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">Progress Demo</h1>
                    <p class="page-demo__desc">선형/원형 프로그레스와 값 변경을 확인합니다.</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Controls</h2>
                    <AppProgress
                        v-model:value="value"
                        variant="linear"
                        mode="control-single"
                        label="단일 값"
                        :show-label="true"
                    />
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Linear (단일 값)</h2>
                    <AppProgress :value="value" variant="linear" />
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Linear (범위)</h2>
                    <AppProgress
                        :value="range.end"
                        variant="linear"
                        :range="range"
                        :range-selectable="true"
                        @update:range="(v) => {
                            range.start = v.start
                            range.end = v.end
                        }"
                    />
                    <div class="page-demo-hint">
                        드래그로 범위 선택: {{ Math.min(range.start, range.end) }}% ~ {{ Math.max(range.start, range.end) }}%
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Circular</h2>
                    <AppProgress :value="value" variant="circular" :show-label="true" />
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Half Circular</h2>
                    <AppProgress :value="value" variant="circular" circular-type="half" :show-label="true" />
                </section>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Actions</h2>
                        <div class="page-demo-actions">
                            <AppButton variant="fill" @click="randomize">랜덤</AppButton>
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
const value = ref(35)
let range = reactive({ start: 20, end: 70 })

function randomize() {
    value.value = Math.round(Math.random() * 100)
    const a = Math.round(Math.random() * 100)
    const b = Math.round(Math.random() * 100)
    range.start = Math.min(a, b)
    range.end = Math.max(a, b)
}

function reset() {
    value.value = 35
    range.start = 20
    range.end = 70
}

const output = computed(() =>
    JSON.stringify(
        {
            value: value.value,
            range: { start: range.start, end: range.end },
        },
        null,
        2,
    ),
)
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->

