<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">Checkbox & Radio Demo</h1>
                    <p class="page-demo__desc">체크박스와 라디오 입력 컴포넌트를 확인합니다.</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Checkbox</h2>
                    <div class="page-demo-stack">
                        <AppChoice type="checkbox" v-model="checkA" label="알림 수신" helper="이메일로 알림을 받습니다." />
                        <AppChoice type="checkbox" v-model="checkB" label="마케팅 동의" />
                        <AppChoice type="checkbox" v-model="checkDisabled" label="비활성" :disabled="true" helper="선택 불가" />
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Radio</h2>
                    <div class="page-demo-stack">
                        <AppChoice type="radio" v-model="radioValue" name="plan" value="basic" label="Basic" helper="기본 요금제" />
                        <AppChoice type="radio" v-model="radioValue" name="plan" value="pro" label="Pro" helper="확장 요금제" />
                        <AppChoice type="radio" v-model="radioValue" name="plan" value="enterprise" label="Enterprise" helper="엔터프라이즈" />
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

function reset() {
    checkA.value = false
    checkB.value = false
    checkDisabled.value = false
    radioValue.value = 'basic'
}

const output = computed(() =>
    JSON.stringify(
        {
            checkbox: { checkA: checkA.value, checkB: checkB.value, checkDisabled: checkDisabled.value },
            radio: radioValue.value,
        },
        null,
        2,
    ),
)
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->

