<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">

                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">
                        AppChoice
                    </h1>

                    <p class="page-demo__desc">
                        checkbox / radio / chip 계열 선택 컴포넌트입니다.
                        type / variant / hint / state / disabled 속성을 지원합니다.
                    </p>
                </header>

                <!-- BASIC CHECKBOX -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Basic Checkbox
                    </h2>

                    <p class="page-demo-card__desc">
                        가장 기본적인 checkbox 예시입니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppChoice v-model="checkbox.basic" type="checkbox" label="알림 수신" hint="이메일로 알림을 받습니다." />

                        <AppChoice v-model="checkbox.marketing" type="checkbox" label="마케팅 동의" />
                    </div>
                </section>

                <!-- BASIC RADIO -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Basic Radio
                    </h2>

                    <p class="page-demo-card__desc">
                        가장 기본적인 radio 예시입니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppChoice v-model="radio.plan" type="radio" name="plan" value="basic" label="Basic"
                            hint="기본 요금제" />

                        <AppChoice v-model="radio.plan" type="radio" name="plan" value="pro" label="Pro"
                            hint="확장 요금제" />

                        <AppChoice v-model="radio.plan" type="radio" name="plan" value="enterprise" label="Enterprise"
                            hint="엔터프라이즈" />
                    </div>
                </section>

                <!-- STATE -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        State
                    </h2>

                    <p class="page-demo-card__desc">
                        hint와 state 속성을 함께 확인합니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppChoice v-model="state.error" type="checkbox" label="Error" hint="에러 메시지" state="error" />

                        <AppChoice v-model="state.warning" type="checkbox" label="Warning" hint="경고 메시지"
                            state="warning" />

                        <AppChoice v-model="state.success" type="checkbox" label="Success" hint="선택 가능"
                            state="success" />
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
                        <AppChoice v-model="disabled.checkbox" type="checkbox" label="Disabled Checkbox" hint="선택 불가"
                            disabled />

                        <AppChoice v-model="disabled.radio" type="radio" name="disabled-plan" value="disabled-option"
                            label="Disabled Radio" hint="선택 불가" disabled />
                    </div>
                </section>

                <!-- CHIP VARIANTS -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Chip Variants
                    </h2>

                    <p class="page-demo-card__desc">
                        chip / chip-outline / fill / ghost variant를 확인합니다.
                    </p>

                    <div class="page-demo-stack">
                        <div class="page-demo-row">
                            <AppChoice v-model="chip.chipA" type="checkbox" variant="chip" label="Chip A" />
                            <AppChoice v-model="chip.chipB" type="checkbox" variant="chip" label="Chip B" />
                        </div>

                        <div class="page-demo-row">
                            <AppChoice v-model="chip.outlineA" type="checkbox" variant="chip-outline"
                                label="Outline A" />
                            <AppChoice v-model="chip.outlineB" type="checkbox" variant="chip-outline"
                                label="Outline B" />
                        </div>

                        <div class="page-demo-row">
                            <AppChoice v-model="chip.fillA" type="checkbox" variant="fill" label="Fill A" />
                            <AppChoice v-model="chip.fillB" type="checkbox" variant="fill" label="Fill B" />
                        </div>

                        <div class="page-demo-row">
                            <AppChoice v-model="chip.ghostA" type="checkbox" variant="ghost" label="Ghost A" />
                            <AppChoice v-model="chip.ghostB" type="checkbox" variant="ghost" label="Ghost B" />
                        </div>
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
const checkbox = reactive({
    basic: true,
    marketing: false,
})

const radio = reactive({
    plan: 'basic',
})

const state = reactive({
    error: false,
    warning: false,
    success: true,
})

const disabled = reactive({
    checkbox: false,
    radio: 'disabled-option' as string | number | null,
})

const chip = reactive({
    chipA: false,
    chipB: true,
    outlineA: false,
    outlineB: true,
    fillA: false,
    fillB: true,
    ghostA: false,
    ghostB: true,
})

const output = computed(() =>
    JSON.stringify(
        {
            checkbox,
            radio,
            state,
            disabled,
            chip,
        },
        null,
        2,
    ),
)
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->