<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">TimePicker Demo</h1>
                    <p class="demo__desc">네이티브 time input 기반 타임피커(step/min/max/에러)를 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">기본</h2>
                    <div class="grid">
                        <AppTimePicker v-model="time" label="시간" helper="HH:MM" />
                        <AppTimePicker v-model="timeStep" label="step=15분" :step="900" helper="15분 단위" />
                        <AppTimePicker v-model="timeRequired" label="필수" :error="requiredError" helper="비어있으면 에러" />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">범위 제한</h2>
                    <div class="grid">
                        <AppTimePicker v-model="timeMinMax" label="영업시간" min="09:00" max="18:00" helper="09:00 ~ 18:00" />
                    </div>
                </section>
            </main>

            <aside class="demo-aside" aria-label="현재 값 패널">
                <div class="demo-aside__sticky">
                    <section class="card">
                        <h2 class="card__title">Actions</h2>
                        <div class="actions">
                            <AppButton variant="fill" @click="submit">검증</AppButton>
                            <AppButton variant="text" @click="reset">초기화</AppButton>
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
const time = ref<string | null>(null)
const timeStep = ref<string | null>(null)
const timeMinMax = ref<string | null>(null)
const timeRequired = ref<string | null>(null)
const submitted = ref(false)

const requiredError = computed(() => {
    if (!submitted.value) return undefined
    return timeRequired.value ? undefined : '필수 입력입니다.'
})

function submit() {
    submitted.value = true
}

function reset() {
    time.value = null
    timeStep.value = null
    timeMinMax.value = null
    timeRequired.value = null
    submitted.value = false
}

const output = computed(() =>
    JSON.stringify(
        {
            time: time.value,
            timeStep: timeStep.value,
            timeMinMax: timeMinMax.value,
            timeRequired: timeRequired.value,
            submitted: submitted.value,
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

.grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
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
    max-height: calc(100dvh - 220px);
}

@media (max-width: 900px) {
    .demo-layout {
        grid-template-columns: 1fr;
    }
    .demo-aside__sticky {
        position: static;
        top: auto;
    }
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>

