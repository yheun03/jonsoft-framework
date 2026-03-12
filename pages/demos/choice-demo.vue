<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">Choice Demo</h1>
                    <p class="demo__desc">체크박스, 라디오, 칩/면/아이콘 선택 컴포넌트를 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">Checkbox</h2>
                    <div class="stack">
                        <AppCheckbox v-model="checkA" label="알림 수신" helper="이메일로 알림을 받습니다." />
                        <AppCheckbox v-model="checkB" label="마케팅 동의" />
                        <AppCheckbox v-model="checkDisabled" label="비활성" :disabled="true" helper="선택 불가" />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">Radio</h2>
                    <div class="stack">
                        <AppRadio v-model="radioValue" name="plan" value="basic" label="Basic" helper="기본 요금제" />
                        <AppRadio v-model="radioValue" name="plan" value="pro" label="Pro" helper="확장 요금제" />
                        <AppRadio v-model="radioValue" name="plan" value="enterprise" label="Enterprise" helper="엔터프라이즈" />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">Chip (칩 선택)</h2>
                    <div class="chips">
                        <AppChoice v-model="chipDev" variant="chip">개발</AppChoice>
                        <AppChoice v-model="chipDesign" variant="chip">디자인</AppChoice>
                        <AppChoice v-model="chipPlan" variant="chip">기획</AppChoice>
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">Fill (면 선택 + 아이콘)</h2>
                    <div class="chips">
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

            <aside class="demo-aside" aria-label="현재 값 패널">
                <div class="demo-aside__sticky">
                    <section class="card">
                        <h2 class="card__title">Actions</h2>
                        <div class="actions">
                            <AppButton variant="fill" @click="reset">초기화</AppButton>
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

.stack {
    display: grid;
    gap: 8px;
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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
}

@media (max-width: 900px) {
    .demo-layout {
        grid-template-columns: 1fr;
    }
    .demo-aside__sticky {
        position: static;
        top: auto;
    }
}
</style>

