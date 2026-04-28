<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">AppTable</h1>
                    <p class="page-demo__desc">
                        rows / cells 스키마 기반 테이블 데모입니다.
                        상태와 옵션 데이터는 pinia에서 관리합니다.
                    </p>
                </header>

                <section class="page-demo-card">
                    <AppTable :model-value="form" :rows="rows" title="기본 타입" description="오알켐 방식 rows/cells 스키마 예시입니다."
                        default-label-width="140px" @update:model-value="handleUpdateModel"
                        @field-action="handleFieldAction" />
                </section>
            </main>

            <aside class="page-demo-aside">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Current Value</h2>
                        <pre class="page-demo-output">{{ output }}</pre>
                    </section>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AppTableRow, AppTableOption } from '~/core/types/table'

const inspectionTypeOptions: AppTableOption[] = [
    { label: '수입검사', value: 'incoming' },
    { label: '공정검사', value: 'process' },
    { label: '출하검사', value: 'shipping' },
]

const judgementOptions: AppTableOption[] = [
    { label: '합격', value: 'pass' },
    { label: '불합격', value: 'fail' },
]

const checkboxSingleOptions: AppTableOption[] = [
    { label: 'text', value: 'text' },
]

const form = ref<Record<string, unknown>>({
    onlyText: 'only text',
    result: 'pass',
    agreeList: ['text'],
    singleDate: '2026-02-22',
    searchKeyword: '',
    selectValue: null,
    textareaValue: '',
    phone1: '',
    phone2: '',
    phone3: '',
    emailId: '',
    emailDomain: '',
    startDate: '',
    endDate: '',
    inputValue: '',
})

const rows: AppTableRow[] = [
    {
        cells: [
            { label: 'text', key: 'onlyText', type: 'text' },
            {
                label: 'phone',
                type: 'phone',
                keys: ['phone1', 'phone2', 'phone3'],
                placeholders: ['000', '0000', '0000'],
            },
        ],
    },
    {
        cells: [
            {
                label: 'radio',
                key: 'result',
                type: 'radio',
                options: judgementOptions,
            },
            {
                label: 'email',
                type: 'email',
                keys: ['emailId', 'emailDomain'],
                placeholders: ['text', 'text.com'],
            },
        ],
    },
    {
        cells: [
            {
                label: 'checkbox',
                key: 'agreeList',
                type: 'checkbox',
                options: checkboxSingleOptions,
            },
            {
                label: 'select',
                key: 'selectValue',
                type: 'select',
                placeholder: '선택하세요.',
                options: inspectionTypeOptions,
            },
        ],
    },
]

function handleUpdateModel(next: Record<string, unknown>) {
    form.value = next
}

function handleFieldAction(cell: unknown) {
    console.log('field action:', cell)
}

const output = computed(() => JSON.stringify(form.value, null, 2))
</script>