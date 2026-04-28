<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">기본</h2>
                    <div class="page-demo-actions">
                        <AppButton variant="fill" @click="openAlert">Alert 열기</AppButton>
                        <AppButton variant="outline" @click="openConfirm">Confirm 열기</AppButton>
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">중첩(스택) 테스트</h2>
                    <p class="page-demo-card__desc">
                        Confirm 안에서 Alert를 추가로 열어보세요. 마지막에 열린 모달이 더 위(z-index)이며,
                        ESC/배경/X는 최상단 모달만 닫힙니다.
                    </p>
                    <div class="page-demo-actions">
                        <AppButton variant="fill" @click="openConfirmNested">Confirm(중첩 유도) 열기</AppButton>
                    </div>
                </section>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">현재 상태</h2>
                        <pre class="page-demo-output">{{ output }}</pre>
                    </section>
                </div>
            </aside>
        </div>
    </div>

    <AppModalAlert v-model="alertOpen" title="안내" :message="alertMessage" @ok="lastAction = 'alert:ok'" />

    <AppModalConfirm v-model="confirmOpen" title="확인" message="정말 진행할까요?" @confirm="onConfirm"
        @cancel="lastAction = 'confirm:cancel'" />

    <AppModalConfirm v-model="confirmNestedOpen" title="중첩 테스트" message="이 Confirm 위에 Alert를 하나 더 열어보세요."
        :auto-close="false" @confirm="openAlertFromConfirm" @cancel="lastAction = 'nested:cancel'" />

    <AppModalAlert v-model="nestedAlertOpen" title="최상단 Alert" message="이 모달이 최상단입니다. ESC/배경/X는 이 모달만 닫혀야 합니다."
        @ok="lastAction = 'nestedAlert:ok'" />
</template>

<script setup lang="ts">
const { title, description } = useDemoI18n('modal')

const alertOpen = ref(false)
const confirmOpen = ref(false)
const confirmNestedOpen = ref(false)
const nestedAlertOpen = ref(false)

const lastAction = ref<string>('-')
const alertMessage = ref('간단한 안내 메시지입니다.')

function openAlert() {
    alertMessage.value = '간단한 안내 메시지입니다.'
    alertOpen.value = true
}

function openConfirm() {
    confirmOpen.value = true
}

function openConfirmNested() {
    confirmNestedOpen.value = true
}

async function openAlertFromConfirm() {
    lastAction.value = 'nested:confirm'
    // "중첩(스택)" 테스트 목적상 Confirm은 닫지 않고,
    // 그 위에 Alert를 하나 더 띄워 z-index/ESC/배경/X 동작을 확인합니다.
    nestedAlertOpen.value = true
}

async function onConfirm() {
    lastAction.value = 'confirm:confirm'
    alertMessage.value = 'Confirm에서 확인을 눌렀습니다.'
    confirmOpen.value = false
    await nextTick()
    alertOpen.value = true
}

const output = computed(() =>
    JSON.stringify(
        {
            open: {
                alertOpen: alertOpen.value,
                confirmOpen: confirmOpen.value,
                confirmNestedOpen: confirmNestedOpen.value,
                nestedAlertOpen: nestedAlertOpen.value,
            },
            lastAction: lastAction.value,
        },
        null,
        2,
    ),
)
</script>
