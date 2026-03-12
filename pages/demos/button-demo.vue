<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">Button Demo</h1>
                    <p class="page-demo__desc">variant/size/icon/link/상태 케이스를 한 화면에서 확인합니다.</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Variant</h2>
                    <div class="page-demo-row">
                        <AppButton variant="fill" @click="log('fill')">fill</AppButton>
                        <AppButton variant="text" @click="log('text')">text</AppButton>
                        <AppButton variant="underline" @click="log('underline')">underline</AppButton>
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Size</h2>
                    <div class="page-demo-row">
                        <AppButton size="sm" @click="log('size:sm')">Small</AppButton>
                        <AppButton size="md" @click="log('size:md')">Medium</AppButton>
                        <AppButton size="lg" @click="log('size:lg')">Large</AppButton>
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Icon</h2>
                    <div class="page-demo-row">
                        <AppButton variant="fill" @click="log('icon:left')">
                            <template #iconLeft>
                                <span class="page-demo-icon" aria-hidden="true" v-html="TempIconSvg" />
                            </template>
                            왼쪽 아이콘
                        </AppButton>

                        <AppButton variant="fill" @click="log('icon:right')">
                            오른쪽 아이콘
                            <template #iconRight>
                                <span class="page-demo-icon" aria-hidden="true" v-html="TempIconSvg" />
                            </template>
                        </AppButton>

                        <AppButton variant="text" size="md" aria-label="아이콘 버튼" @click="log('icon:only')">
                            <template #iconLeft>
                                <span class="page-demo-icon" aria-hidden="true" v-html="TempIconSvg" />
                            </template>
                        </AppButton>
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Link</h2>
                    <div class="page-demo-row">
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

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">State</h2>
                    <div class="page-demo-row">
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
                                <span class="page-demo-icon" aria-hidden="true" v-html="TempIconSvg" />
                            </template>
                        </AppButton>
                    </div>
                </section>
            </main>

            <aside class="page-demo-aside" aria-label="클릭 로그 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Actions</h2>
                        <div class="page-demo-actions">
                            <AppButton variant="fill" @click="clear">로그 비우기</AppButton>
                        </div>
                    </section>

                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Click Log</h2>
                        <pre class="page-demo-output">{{ output }}</pre>
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

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->
