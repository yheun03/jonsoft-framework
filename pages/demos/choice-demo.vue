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
                        type, variant, size, uiType, hint, state, disabled 조합을 실제 활용 패턴 기준으로 확인할 수 있습니다.
                    </p>
                </header>

                <!-- CHECKBOX -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Checkbox
                    </h2>

                    <p class="page-demo-card__desc">
                        약관 동의, 알림 수신, 옵션 선택처럼 boolean 값을 제어하는 기본 패턴입니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppChoice v-model="checkbox.agreeTerms" type="checkbox" label="이용약관에 동의합니다" hint="필수 항목입니다." />

                        <AppChoice v-model="checkbox.receiveEmail" type="checkbox" label="이메일 알림 수신"
                            hint="업데이트 및 공지 메일을 받습니다." />

                        <AppChoice v-model="checkbox.receiveMarketing" type="checkbox" label="마케팅 정보 수신" />
                    </div>
                </section>

                <!-- RADIO GROUP -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Radio Group
                    </h2>

                    <p class="page-demo-card__desc">
                        하나의 값만 선택해야 하는 경우 사용하는 패턴입니다.
                        같은 name과 서로 다른 value를 지정해 그룹으로 사용합니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppChoice v-model="radio.plan" type="radio" name="plan" value="basic" label="Basic"
                            hint="기본 요금제" />

                        <AppChoice v-model="radio.plan" type="radio" name="plan" value="pro" label="Pro"
                            hint="확장 기능 포함" />

                        <AppChoice v-model="radio.plan" type="radio" name="plan" value="enterprise" label="Enterprise"
                            hint="대규모 조직용" />
                    </div>
                </section>

                <!-- DEFAULT UI TYPES -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Default UI Types
                    </h2>

                    <p class="page-demo-card__desc">
                        기본 선택형에서 A / B 타입과 md / sm 크기 조합을 비교합니다.
                    </p>

                    <div class="page-demo-stack">
                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">A Type / MD</h3>
                            <div class="page-demo-stack">
                                <AppChoice v-model="compare.aMdCheckbox" type="checkbox" label="A Type Checkbox"
                                    uiType="a" size="md" />
                                <AppChoice v-model="compare.aMdRadio" type="radio" name="a-md-radio" value="selected"
                                    label="A Type Radio" uiType="a" size="md" />
                            </div>
                        </div>

                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">A Type / SM</h3>
                            <div class="page-demo-stack">
                                <AppChoice v-model="compare.aSmCheckbox" type="checkbox" label="A Type Checkbox"
                                    uiType="a" size="sm" />
                                <AppChoice v-model="compare.aSmRadio" type="radio" name="a-sm-radio" value="selected"
                                    label="A Type Radio" uiType="a" size="sm" />
                            </div>
                        </div>

                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">B Type / MD</h3>
                            <div class="page-demo-stack">
                                <AppChoice v-model="compare.bMdCheckbox" type="checkbox" label="B Type Checkbox"
                                    uiType="b" size="md" />
                                <AppChoice v-model="compare.bMdRadio" type="radio" name="b-md-radio" value="selected"
                                    label="B Type Radio" uiType="b" size="md" />
                            </div>
                        </div>

                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">B Type / SM</h3>
                            <div class="page-demo-stack">
                                <AppChoice v-model="compare.bSmCheckbox" type="checkbox" label="B Type Checkbox"
                                    uiType="b" size="sm" />
                                <AppChoice v-model="compare.bSmRadio" type="radio" name="b-sm-radio" value="selected"
                                    label="B Type Radio" uiType="b" size="sm" />
                            </div>
                        </div>
                    </div>
                </section>

                <!-- STATE -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        State
                    </h2>

                    <p class="page-demo-card__desc">
                        hint와 state를 함께 사용해 상태 메시지를 표시합니다.
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
                        비활성 상태 예시입니다.
                    </p>

                    <div class="page-demo-stack">
                        <AppChoice v-model="disabled.checkbox" type="checkbox" label="Disabled Checkbox" hint="선택 불가"
                            disabled />

                        <AppChoice v-model="disabled.radio" type="radio" name="disabled-plan" value="basic"
                            label="Disabled Radio" hint="선택 불가" disabled />

                        <div class="page-demo-row">
                            <AppChoice v-model="disabledChip.chip" type="checkbox" variant="chip" label="Disabled Chip"
                                disabled />

                            <AppChoice v-model="disabledChip.fill" type="radio" name="disabled-chip-radio"
                                value="option-a" variant="fill" label="Disabled Fill" disabled />
                        </div>
                    </div>
                </section>

                <!-- CHIP FILTER -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Chip Filter
                    </h2>

                    <p class="page-demo-card__desc">
                        다중 선택 가능한 태그/필터 UI 패턴입니다.
                        checkbox + chip variant 조합으로 사용합니다.
                    </p>

                    <div class="page-demo-stack">
                        <div class="page-demo-row">
                            <AppChoice v-model="chipFilter.development" type="checkbox" variant="chip" label="개발" />
                            <AppChoice v-model="chipFilter.design" type="checkbox" variant="chip" label="디자인" />
                            <AppChoice v-model="chipFilter.planning" type="checkbox" variant="chip" label="기획" />
                        </div>

                        <div class="page-demo-row">
                            <AppChoice v-model="chipFilter.outlineA" type="checkbox" variant="chip-outline"
                                label="Outline A" />
                            <AppChoice v-model="chipFilter.outlineB" type="checkbox" variant="chip-outline"
                                label="Outline B" />
                        </div>
                    </div>
                </section>

                <!-- CHIP RADIO GROUP -->
                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Chip Radio Group
                    </h2>

                    <p class="page-demo-card__desc">
                        탭, 세그먼트 버튼, 단일 선택 필터처럼 사용하는 패턴입니다.
                        radio + chip variant 조합으로 사용합니다.
                    </p>

                    <div class="page-demo-stack">
                        <div class="page-demo-row">
                            <AppChoice v-model="chipRadio.category" type="radio" name="chip-category" value="all"
                                variant="fill" label="전체" />
                            <AppChoice v-model="chipRadio.category" type="radio" name="chip-category" value="news"
                                variant="fill" label="뉴스" />
                            <AppChoice v-model="chipRadio.category" type="radio" name="chip-category" value="notice"
                                variant="fill" label="공지" />
                        </div>

                        <div class="page-demo-row">
                            <AppChoice v-model="chipRadio.view" type="radio" name="chip-view" value="card"
                                variant="ghost" label="카드형" />
                            <AppChoice v-model="chipRadio.view" type="radio" name="chip-view" value="list"
                                variant="ghost" label="리스트형" />
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
    agreeTerms: true,
    receiveEmail: false,
    receiveMarketing: false,
})

const radio = reactive({
    plan: 'basic' as string | number | null,
})

const compare = reactive({
    aMdCheckbox: false,
    aMdRadio: 'selected' as string | number | null,
    aSmCheckbox: false,
    aSmRadio: 'selected' as string | number | null,
    bMdCheckbox: true,
    bMdRadio: 'selected' as string | number | null,
    bSmCheckbox: true,
    bSmRadio: 'selected' as string | number | null,
})

const chipFilter = reactive({
    development: true,
    design: false,
    planning: true,
    outlineA: false,
    outlineB: true,
})

const chipRadio = reactive({
    category: 'all' as string | number | null,
    view: 'card' as string | number | null,
})

const state = reactive({
    error: false,
    warning: false,
    success: true,
})

const disabled = reactive({
    checkbox: true,
    radio: 'basic' as string | number | null,
})

const disabledChip = reactive({
    chip: true,
    fill: 'option-a' as string | number | null,
})

const output = computed(() =>
    JSON.stringify(
        {
            checkbox,
            radio,
            compare,
            chipFilter,
            chipRadio,
            state,
            disabled,
            disabledChip,
        },
        null,
        2,
    ),
)
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->