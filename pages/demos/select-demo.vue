<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">Select Demo</h1>
                    <p class="demo__desc">기본 select + 검색형(selectable) 케이스를 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">기본</h2>
                    <div class="grid">
                        <AppSelect v-model="basic" label="부서" :options="options" />
                        <AppSelect v-model="withPlaceholder" label="플레이스홀더" placeholder="선택하세요" :options="options" />
                        <AppSelect v-model="required" label="필수" :error="requiredError" :options="options" />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">검색</h2>
                    <div class="grid">
                        <AppSelect v-model="searchable" label="검색형" :options="options2" searchable />
                        <AppSelect v-model="disabled" label="Disabled" :options="options" :disabled="true" helper="비활성" />
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
import type { AppSelectOption } from '~/components/base/AppSelect.vue'

const options: AppSelectOption[] = [
    { value: 'dev', label: '개발' },
    { value: 'design', label: '디자인' },
    { value: 'plan', label: '기획' },
    { value: 'ops', label: '운영', disabled: true },
]

const options2: AppSelectOption[] = [
    { value: 'seoul', label: '서울' },
    { value: 'busan', label: '부산' },
    { value: 'daegu', label: '대구' },
    { value: 'incheon', label: '인천' },
    { value: 'gwangju', label: '광주' },
    { value: 'daejeon', label: '대전' },
    { value: 'ulsan', label: '울산' },
]

const basic = ref<string | null>(null)
const withPlaceholder = ref<string | null>(null)
const required = ref<string | null>(null)
const searchable = ref<string | null>(null)
const disabled = ref<string | null>('dev')

const submitted = ref(false)

const requiredError = computed(() => {
    if (!submitted.value) return undefined
    return required.value ? undefined : '필수 선택입니다.'
})

function submit() {
    submitted.value = true
}

function reset() {
    basic.value = null
    withPlaceholder.value = null
    required.value = null
    searchable.value = null
    submitted.value = false
}

const output = computed(() =>
    JSON.stringify(
        {
            basic: basic.value,
            withPlaceholder: withPlaceholder.value,
            required: required.value,
            searchable: searchable.value,
            disabled: disabled.value,
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

