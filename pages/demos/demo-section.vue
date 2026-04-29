<template>
    <div class="page-demo section-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">
                        AppSection
                    </h1>

                    <p class="page-demo__desc">
                        AppSection 컴포넌트군의 핵심 속성(direction, ratio, gap)을
                        실시간으로 확인할 수 있는 데모입니다.
                    </p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Section Playground
                    </h2>

                    <p class="page-demo-card__desc">
                        컨트롤 값을 변경하면 wrapper/section 레이아웃이 즉시 반영됩니다.
                    </p>

                    <div class="section-demo-controls">
                        <label class="section-demo-control">
                            <span>wrapper.direction</span>
                            <select v-model="controls.wrapperDirection">
                                <option value="column">column</option>
                                <option value="row">row</option>
                            </select>
                        </label>

                        <label class="section-demo-control">
                            <span>wrapper.gap</span>
                            <input v-model.number="controls.wrapperGap" type="number" min="0" step="2">
                        </label>

                        <label class="section-demo-control">
                            <span>wrapper.ratio</span>
                            <input v-model="controls.wrapperRatioText" type="text" placeholder="2 1">
                        </label>

                        <label class="section-demo-control">
                            <span>section.direction</span>
                            <select v-model="controls.sectionDirection">
                                <option value="column">column</option>
                                <option value="row">row</option>
                            </select>
                        </label>

                        <label class="section-demo-control">
                            <span>section.gap</span>
                            <input v-model.number="controls.sectionGap" type="number" min="0" step="2">
                        </label>

                        <label class="section-demo-control">
                            <span>section.ratio</span>
                            <input v-model="controls.sectionRatioText" type="text" placeholder="1 1">
                        </label>
                    </div>

                    <AppSectionWrapper class="section-demo__wrapper-demo" title="Playground Wrapper"
                        desc="header slot + dynamic props" :direction="controls.wrapperDirection"
                        :ratio="wrapperRatio" :gap="controls.wrapperGap">
                        <template #header>
                            <div class="section-demo-box section-demo-box--wrapper-header">
                                <strong>AppSectionWrapper Header</strong>
                                <span>direction: {{ controls.wrapperDirection }}</span>
                                <span>ratio: {{ formatRatio(wrapperRatio) }}</span>
                                <span>gap: {{ controls.wrapperGap }}px</span>
                            </div>
                        </template>

                        <AppSection class="section-demo__section-demo" title="Section A" desc="header/body/footer"
                            :direction="controls.sectionDirection" :ratio="sectionRatio" :gap="controls.sectionGap">
                            <AppSectionHeader>
                                <div class="section-demo-box section-demo-box--header">
                                    <strong>AppSectionHeader</strong>
                                    <span>section metadata</span>
                                </div>
                            </AppSectionHeader>

                            <AppSectionBody>
                                <div class="section-demo-box section-demo-box--body">
                                    <strong>AppSectionBody</strong>
                                    <span>direction: {{ controls.sectionDirection }}</span>
                                    <span>ratio: {{ formatRatio(sectionRatio) }}</span>
                                </div>
                            </AppSectionBody>

                            <AppSectionFooter>
                                <div class="section-demo-box section-demo-box--footer">
                                    <strong>AppSectionFooter</strong>
                                    <span>gap: {{ controls.sectionGap }}px</span>
                                </div>
                            </AppSectionFooter>
                        </AppSection>

                        <AppSection class="section-demo__section-demo" title="Section B" desc="body only section"
                            :direction="controls.sectionDirection" :ratio="sectionRatio" :gap="controls.sectionGap">
                            <AppSectionBody>
                                <div class="section-demo-box section-demo-box--body">
                                    <strong>AppSectionBody</strong>
                                    <span>body only 구성</span>
                                </div>
                            </AppSectionBody>
                        </AppSection>
                    </AppSectionWrapper>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">
                        Repeated Sections
                    </h2>

                    <p class="page-demo-card__desc">
                        동일한 props를 가진 section을 반복 렌더링하는 예시입니다.
                    </p>

                    <AppSectionWrapper class="section-demo__wrapper-demo" title="v-for Example" desc="반복 섹션 예시"
                        :direction="controls.wrapperDirection" :gap="controls.wrapperGap">
                        <template #header>
                            <div class="section-demo-box section-demo-box--wrapper-header">
                                <strong>AppSectionWrapper Header</strong>
                                <span>반복 리스트 상위 그룹</span>
                            </div>
                        </template>

                        <AppSection v-for="item in repeatedSections" :key="item.id" class="section-demo__section-demo"
                            :title="item.title" :desc="item.desc" :direction="controls.sectionDirection"
                            :ratio="sectionRatio" :gap="controls.sectionGap">
                            <AppSectionBody>
                                <div class="section-demo-box section-demo-box--body">
                                    <strong>{{ item.label }}</strong>
                                    <span>{{ item.note }}</span>
                                </div>
                            </AppSectionBody>
                        </AppSection>
                    </AppSectionWrapper>
                </section>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">
                            Structure Info
                        </h2>

                        <pre class="page-demo-output">{{ output }}</pre>
                    </section>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
type DemoDirection = 'row' | 'column'

const controls = reactive({
    wrapperDirection: 'column' as DemoDirection,
    wrapperGap: 20,
    wrapperRatioText: '2 1',
    sectionDirection: 'row' as DemoDirection,
    sectionGap: 10,
    sectionRatioText: '1 1',
})

const repeatedSections = ref([
    {
        id: 1,
        title: 'Section Item 1',
        desc: '첫 번째 반복 섹션',
        label: 'Body 1',
        note: 'v-for item #1',
    },
    {
        id: 2,
        title: 'Section Item 2',
        desc: '두 번째 반복 섹션',
        label: 'Body 2',
        note: 'v-for item #2',
    },
    {
        id: 3,
        title: 'Section Item 3',
        desc: '세 번째 반복 섹션',
        label: 'Body 3',
        note: 'v-for item #3',
    },
])

function parseRatio(value: string) {
    const parsed = value
        .split(/[,\s]+/)
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item) && item > 0)

    return parsed.length > 0 ? parsed : null
}

function formatRatio(ratio: number[] | null) {
    if (!ratio || ratio.length === 0) return 'auto'

    return ratio.map((item) => `${item}fr`).join(' ')
}

const wrapperRatio = computed(() => {
    if (controls.wrapperDirection === 'column') return null
    return parseRatio(controls.wrapperRatioText)
})

const sectionRatio = computed(() => {
    if (controls.sectionDirection === 'column') return null
    return parseRatio(controls.sectionRatioText)
})

const output = computed(() =>
    JSON.stringify(
        {
            playground: {
                wrapper: {
                    direction: controls.wrapperDirection,
                    ratio: formatRatio(wrapperRatio.value),
                    gap: `${controls.wrapperGap}px`,
                },
                section: {
                    direction: controls.sectionDirection,
                    ratio: formatRatio(sectionRatio.value),
                    gap: `${controls.sectionGap}px`,
                },
            },
            repeat: {
                count: repeatedSections.value.length,
                sameProps: true,
            },
        },
        null,
        2,
    ),
)
</script>

<style lang="scss" scoped>
.section-demo {
    &-controls {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 16px;
    }

    &-control {
        display: grid;
        gap: 6px;

        span {
            font-size: 13px;
            color: #334155;
        }

        input,
        select {
            width: 100%;
            height: 34px;
            padding: 0 10px;
            border: 1px solid rgba(100, 116, 139, 0.35);
            border-radius: 8px;
            background: #fff;
            color: #0f172a;
        }
    }

    &__wrapper-demo {
        padding: 16px;
        border: 1px solid rgba(168, 85, 247, 0.24);
        border-radius: 20px;
        background: rgba(168, 85, 247, 0.08);
    }

    &__section-demo {
        border-color: rgba(239, 68, 68, 0.22);
        background: rgba(239, 68, 68, 0.08);
    }
}

.section-demo-box {
    display: grid;
    gap: 6px;
    min-height: 88px;
    padding: 16px;
    border-radius: 12px;
    border: 1px dashed rgba(15, 23, 42, 0.14);

    strong {
        font-weight: 700;
        color: #0f172a;
    }

    span {
        font-size: 14px;
        color: #475569;
    }

    &--wrapper-header {
        background: rgba(126, 34, 206, 0.14);
    }

    &--header {
        background: rgba(59, 130, 246, 0.14);
    }

    &--body {
        background: rgba(34, 197, 94, 0.14);
    }

    &--footer {
        background: rgba(249, 115, 22, 0.14);
    }
}
</style>
