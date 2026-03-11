<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">Button Demo</h1>
                    <p class="demo__desc">variant/size/icon/link/상태 케이스를 한 화면에서 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">Variant</h2>
                    <div class="row">
                        <AppButton variant="fill" @click="log('fill')">fill</AppButton>
                        <AppButton variant="text" @click="log('text')">text</AppButton>
                        <AppButton variant="underline" @click="log('underline')">underline</AppButton>
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">Size</h2>
                    <div class="row">
                        <AppButton size="sm" @click="log('size:sm')">Small</AppButton>
                        <AppButton size="md" @click="log('size:md')">Medium</AppButton>
                        <AppButton size="lg" @click="log('size:lg')">Large</AppButton>
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">Icon</h2>
                    <div class="row">
                        <AppButton variant="fill" @click="log('icon:left')">
                            <template #iconLeft>
                                <span class="icon" aria-hidden="true" v-html="TempIconSvg" />
                            </template>
                            왼쪽 아이콘
                        </AppButton>

                        <AppButton variant="fill" @click="log('icon:right')">
                            오른쪽 아이콘
                            <template #iconRight>
                                <span class="icon" aria-hidden="true" v-html="TempIconSvg" />
                            </template>
                        </AppButton>

                        <AppButton variant="text" size="md" aria-label="아이콘 버튼" @click="log('icon:only')">
                            <template #iconLeft>
                                <span class="icon" aria-hidden="true" v-html="TempIconSvg" />
                            </template>
                        </AppButton>
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">Link</h2>
                    <div class="row">
                        <AppButton variant="text" to="/demos/input-demo" @click="log('to:/demos/input-demo')">
                            내부 라우팅(to)
                        </AppButton>
                        <AppButton
                            variant="underline"
                            href="https://example.com"
                            new-tab
                            @click="log('href:https://example.com (newTab)')"
                        >
                            외부 링크(href)
                        </AppButton>
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">State</h2>
                    <div class="row">
                        <AppButton :disabled="true" @click="log('disabled (should not)')">Disabled</AppButton>
                        <AppButton :loading="true" @click="log('loading (should not)')">Loading</AppButton>
                        <AppButton :block="true" @click="log('block')">Block(100%)</AppButton>
                        <AppButton
                            variant="text"
                            size="custom"
                            :custom-size="{ width: 40, height: 40 }"
                            aria-label="커스텀 아이콘 버튼"
                            @click="log('custom size')"
                        >
                            <template #iconLeft>
                                <span class="icon" aria-hidden="true" v-html="TempIconSvg" />
                            </template>
                        </AppButton>
                    </div>
                </section>
            </main>

            <aside class="demo-aside" aria-label="클릭 로그 패널">
                <div class="demo-aside__sticky">
                    <section class="card">
                        <h2 class="card__title">Actions</h2>
                        <div class="actions">
                            <AppButton variant="fill" @click="clear">로그 비우기</AppButton>
                        </div>
                    </section>

                    <section class="card">
                        <h2 class="card__title">Click Log</h2>
                        <pre class="output">{{ output }}</pre>
                    </section>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import TempIconSvg from '@/assets/icons/temp.svg?raw'

type LogItem = { t: number; message: string }
const logs = ref<LogItem[]>([])

function log(message: string) {
    logs.value = [{ t: Date.now(), message }, ...logs.value].slice(0, 30)
}

function clear() {
    logs.value = []
}

const output = computed(() => JSON.stringify({ count: logs.value.length, logs: logs.value }, null, 2))
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

.row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
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
    max-height: calc(100dvh - 200px);
}

.icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
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
