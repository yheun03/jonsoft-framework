<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">Select Demo</h1>
                    <p class="page-demo__desc">기본 select + 검색형(selectable) 케이스를 확인합니다.</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">기본</h2>
                    <div class="page-demo-grid">
                        <AppSelect v-model="basic" label="부서" :options="options" />
                        <AppSelect v-model="withPlaceholder" label="플레이스홀더" placeholder="선택하세요" :options="options" />
                        <AppSelect v-model="required" label="필수" :error="requiredError" :options="options" />
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">검색</h2>
                    <div class="page-demo-grid">
                        <AppSelect v-model="searchable" label="검색형" :options="options2" searchable />
                        <AppSelect v-model="disabled" label="Disabled" :options="options" :disabled="true" helper="비활성" />
                    </div>
                </section>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Actions</h2>
                        <div class="page-demo-actions">
                            <AppButton variant="fill" @click="submit">검증</AppButton>
                            <AppButton variant="text" @click="reset">초기화</AppButton>
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

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->

