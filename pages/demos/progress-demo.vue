<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">

                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">
                        AppProgress
                    </h1>

                    <p class="page-demo__desc">
                        선형 Progress 컴포넌트입니다.
                        display / control-single / control-range 모드와 value, range, label, disabled 속성을 지원합니다.
                    </p>
                </header>

                <!-- BASIC DISPLAY -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Basic
                    </h2>

                    <p class="page-demo-card__desc">
                        가장 기본적인 display 모드 예시입니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppProgress :value="basicValue" variant="linear" />
                    </div>
                </section>

                <!-- VALUE -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Value
                    </h2>

                    <p class="page-demo-card__desc">
                        단일 value 값을 기준으로 진행률을 표시합니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppProgress :value="10" variant="linear" />
                        <AppProgress :value="35" variant="linear" />
                        <AppProgress :value="65" variant="linear" />
                        <AppProgress :value="90" variant="linear" />
                    </div>
                </section>

                <!-- RANGE DISPLAY -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Range Display
                    </h2>

                    <p class="page-demo-card__desc">
                        range 값을 기준으로 구간 진행률을 표시합니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppProgress :value="rangeDisplay.end" :range="rangeDisplay" variant="linear" />

                        <div class="page-demo-hint">
                            {{ rangeDisplay.start }}% ~ {{ rangeDisplay.end }}%
                        </div>
                    </div>
                </section>

                <!-- CONTROL SINGLE -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Control Single
                    </h2>

                    <p class="page-demo-card__desc">
                        mode="control-single"에서 단일 값을 직접 조정할 수 있습니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppProgress v-model:value="controlValue" variant="linear" mode="control-single" label="단일 값"
                            :show-label="true" />
                    </div>
                </section>

                <!-- CONTROL RANGE -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Control Range
                    </h2>

                    <p class="page-demo-card__desc">
                        mode="control-range"에서 범위를 직접 조정할 수 있습니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppProgress :value="controlRange.end" :range="controlRange" variant="linear"
                            mode="control-range" @update:range="onUpdateRange" />

                        <div class="page-demo-hint">
                            {{ controlRange.start }}% ~ {{ controlRange.end }}%
                        </div>
                    </div>
                </section>

                <!-- LABEL / SHOW LABEL -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Label
                    </h2>

                    <p class="page-demo-card__desc">
                        label과 showLabel 속성을 확인합니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppProgress v-model:value="labeledValue" variant="linear" mode="control-single" label="진행률"
                            :show-label="true" />

                        <AppProgress v-model:value="plainLabeledValue" variant="linear" mode="control-single"
                            label="라벨만 표시" />
                    </div>
                </section>

                <!-- DISABLED -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Disabled
                    </h2>

                    <p class="page-demo-card__desc">
                        비활성 상태를 확인합니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppProgress :value="disabledValue" variant="linear" mode="control-single" label="Disabled"
                            :show-label="true" disabled />

                        <AppProgress :value="disabledRange.end" :range="disabledRange" variant="linear"
                            mode="control-range" disabled />
                    </div>
                </section>

            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">
                            Current Value
                        </h2>

                        <pre class="page-demo-output">{{ output }}</pre>
                    </section>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
const basicValue = 35

const rangeDisplay = reactive({
    start: 20,
    end: 70,
})

const controlValue = ref(35)

const controlRange = reactive({
    start: 25,
    end: 75,
})

const labeledValue = ref(48)
const plainLabeledValue = ref(62)

const disabledValue = 40

const disabledRange = reactive({
    start: 30,
    end: 60,
})

function onUpdateRange(value: { start: number; end: number }) {
    controlRange.start = value.start
    controlRange.end = value.end
}

const output = computed(() =>
    JSON.stringify(
        {
            basicValue,
            rangeDisplay: {
                start: rangeDisplay.start,
                end: rangeDisplay.end,
            },
            controlValue: controlValue.value,
            controlRange: {
                start: controlRange.start,
                end: controlRange.end,
            },
            labeledValue: labeledValue.value,
            plainLabeledValue: plainLabeledValue.value,
            disabledValue,
            disabledRange: {
                start: disabledRange.start,
                end: disabledRange.end,
            },
        },
        null,
        2,
    ),
)
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->