<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">Progress Demo</h1>
                    <p class="demo__desc">선형/원형 프로그레스와 값 변경을 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">Controls</h2>
                    <div class="controls">
                        <div class="control">
                            <label class="control__label">값</label>
                            <input class="control__range" type="range" min="0" max="100" :value="value" @input="onValue" />
                            <div class="control__value">{{ value }}%</div>
                        </div>
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">Linear</h2>
                    <AppProgress :value="value" variant="linear" />
                </section>

                <section class="card">
                    <h2 class="card__title">Circular</h2>
                    <AppProgress :value="value" variant="circular" :show-label="true" />
                </section>
            </main>

            <aside class="demo-aside" aria-label="현재 값 패널">
                <div class="demo-aside__sticky">
                    <section class="card">
                        <h2 class="card__title">Actions</h2>
                        <div class="actions">
                            <AppButton variant="fill" @click="randomize">랜덤</AppButton>
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
const value = ref(35)

function onValue(e: Event) {
    value.value = Number((e.target as HTMLInputElement).value)
}

function randomize() {
    value.value = Math.round(Math.random() * 100)
}

function reset() {
    value.value = 35
}

const output = computed(() => JSON.stringify({ value: value.value }, null, 2))
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

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.controls {
    display: grid;
    gap: 12px;
}

.control {
    display: grid;
    gap: 6px;
}

.control__label {
    font-size: 0.875rem;
    color: var(--text-primary, #0f172a);
}

.control__range {
    width: 100%;
}

.control__value {
    font-size: 12px;
    color: rgba(15, 23, 42, 0.7);
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
}
</style>

