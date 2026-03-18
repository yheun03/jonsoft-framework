<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">Checkbox & Radio Demo</h1>
                    <p class="page-demo__desc">체크박스와 라디오 입력 컴포넌트를 확인합니다.</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Checkbox (기본)</h2>
                    <div class="page-demo-stack">
                        <AppChoice type="checkbox" v-model="checkA" label="알림 수신" helper="이메일로 알림을 받습니다." />
                        <AppChoice type="checkbox" v-model="checkB" label="마케팅 동의" />
                        <AppChoice type="checkbox" v-model="checkDisabled" label="비활성" :disabled="true" helper="선택 불가" />
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Radio (기본)</h2>
                    <div class="page-demo-stack">
                        <AppChoice type="radio" v-model="radioValue" name="plan" value="basic" label="Basic" helper="기본 요금제" />
                        <AppChoice type="radio" v-model="radioValue" name="plan" value="pro" label="Pro" helper="확장 요금제" />
                        <AppChoice type="radio" v-model="radioValue" name="plan" value="enterprise" label="Enterprise" helper="엔터프라이즈" />
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Chip Variants</h2>
                    <div class="page-demo-stack">
                        <div class="page-demo-row">
                            <AppChoice type="checkbox" variant="chip" v-model="chipDev" label="개발" />
                            <AppChoice type="checkbox" variant="chip" v-model="chipDesign" label="디자인" />
                            <AppChoice type="checkbox" variant="chip" v-model="chipPlan" label="기획" />
                        </div>
                        <div class="page-demo-row">
                            <AppChoice type="checkbox" variant="chip-outline" v-model="chipOutlineA" label="Chip Outline A" />
                            <AppChoice type="checkbox" variant="chip-outline" v-model="chipOutlineB" label="Chip Outline B" />
                        </div>
                        <div class="page-demo-row">
                            <AppChoice type="checkbox" variant="fill" v-model="chipFillA" label="Fill A" />
                            <AppChoice type="checkbox" variant="fill" v-model="chipFillB" label="Fill B" />
                        </div>
                        <div class="page-demo-row">
                            <AppChoice type="checkbox" variant="ghost" v-model="chipGhostA" label="Ghost A" />
                            <AppChoice type="checkbox" variant="ghost" v-model="chipGhostB" label="Ghost B" />
                        </div>
                    </div>
                </section>

            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Actions</h2>
                        <div class="page-demo-actions">
                            <AppButton variant="primary" @click="reset">초기화</AppButton>
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
const checkA = ref(false)
const checkB = ref(false)
const checkDisabled = ref(false)

const radioValue = ref<string | null>('basic')

const chipDev = ref(false)
const chipDesign = ref(false)
const chipPlan = ref(false)

const chipOutlineA = ref(false)
const chipOutlineB = ref(false)

const chipFillA = ref(false)
const chipFillB = ref(false)

const chipGhostA = ref(false)
const chipGhostB = ref(false)

function reset() {
    checkA.value = false
    checkB.value = false
    checkDisabled.value = false
    radioValue.value = 'basic'
    chipDev.value = false
    chipDesign.value = false
    chipPlan.value = false
    chipOutlineA.value = false
    chipOutlineB.value = false
    chipFillA.value = false
    chipFillB.value = false
    chipGhostA.value = false
    chipGhostB.value = false
}

const output = computed(() =>
    JSON.stringify(
        {
            checkbox: { checkA: checkA.value, checkB: checkB.value, checkDisabled: checkDisabled.value },
            radio: radioValue.value,
            chips: {
                dev: chipDev.value,
                design: chipDesign.value,
                plan: chipPlan.value,
                outlineA: chipOutlineA.value,
                outlineB: chipOutlineB.value,
                fillA: chipFillA.value,
                fillB: chipFillB.value,
                ghostA: chipGhostA.value,
                ghostB: chipGhostB.value,
            },
        },
        null,
        2,
    ),
)
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->

