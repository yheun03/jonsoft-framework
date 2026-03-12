<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">Choice Demo</h1>
                    <p class="page-demo__desc">체크박스, 라디오, 칩/면/아이콘 선택 컴포넌트를 확인합니다.</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Checkbox</h2>
                    <div class="page-demo-stack">
                        <AppCheckbox v-model="checkA" label="알림 수신" helper="이메일로 알림을 받습니다." />
                        <AppCheckbox v-model="checkB" label="마케팅 동의" />
                        <AppCheckbox v-model="checkDisabled" label="비활성" :disabled="true" helper="선택 불가" />
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Radio</h2>
                    <div class="page-demo-stack">
                        <AppRadio v-model="radioValue" name="plan" value="basic" label="Basic" helper="기본 요금제" />
                        <AppRadio v-model="radioValue" name="plan" value="pro" label="Pro" helper="확장 요금제" />
                        <AppRadio v-model="radioValue" name="plan" value="enterprise" label="Enterprise" helper="엔터프라이즈" />
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Chip (칩 선택)</h2>
                    <div class="page-demo-chips">
                        <AppChoice v-model="chipDev" variant="chip">개발</AppChoice>
                        <AppChoice v-model="chipDesign" variant="chip">디자인</AppChoice>
                        <AppChoice v-model="chipPlan" variant="chip">기획</AppChoice>
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Fill (면 선택 + 아이콘)</h2>
                    <div class="page-demo-chips">
                        <AppChoice v-model="fillLeft" variant="fill" icon-position="left">
                            <template #icon>★</template>
                            왼쪽 아이콘
                        </AppChoice>
                        <AppChoice v-model="fillRight" variant="fill" icon-position="right">
                            오른쪽 아이콘
                            <template #icon>★</template>
                        </AppChoice>
                        <AppChoice v-model="fillOnly" variant="fill" icon-position="only" :disabled="false">
                            <template #icon>★</template>
                        </AppChoice>
                    </div>
                </section>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Actions</h2>
                        <div class="page-demo-actions">
                            <AppButton variant="fill" @click="reset">초기화</AppButton>
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

const fillLeft = ref(false)
const fillRight = ref(false)
const fillOnly = ref(false)

function reset() {
    checkA.value = false
    checkB.value = false
    checkDisabled.value = false
    radioValue.value = 'basic'
    chipDev.value = false
    chipDesign.value = false
    chipPlan.value = false
    fillLeft.value = false
    fillRight.value = false
    fillOnly.value = false
}

const output = computed(() =>
    JSON.stringify(
        {
            checkbox: { checkA: checkA.value, checkB: checkB.value, checkDisabled: checkDisabled.value },
            radio: radioValue.value,
            chips: { dev: chipDev.value, design: chipDesign.value, plan: chipPlan.value },
            fill: { left: fillLeft.value, right: fillRight.value, only: fillOnly.value },
        },
        null,
        2,
    ),
)
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->

