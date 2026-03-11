<template>
    <div class="demo">
        <div class="demo-layout">
            <main class="demo-main">
                <header class="demo__header">
                    <h1 class="demo__title">Input Demo</h1>
                    <p class="demo__desc">사이즈/타입/상태/검증 메시지 케이스를 한 화면에서 확인합니다.</p>
                </header>

                <section class="card">
                    <h2 class="card__title">기본</h2>
                    <div class="grid">
                        <AppInput v-model="basic" label="이름" placeholder="이름을 입력하세요" clearable helper="최대 20자" :maxlength="20" />
                        <AppInput v-model="email" label="이메일" type="email" placeholder="name@example.com" clearable autocomplete="email" />
                        <AppInput v-model="search" label="검색" type="search" placeholder="검색어" clearable />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">사이즈</h2>
                    <div class="grid">
                        <AppInput v-model="sizes.sm" label="Small" size="sm" placeholder="sm" clearable />
                        <AppInput v-model="sizes.md" label="Medium" size="md" placeholder="md" clearable />
                        <AppInput v-model="sizes.lg" label="Large" size="lg" placeholder="lg" clearable />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">상태</h2>
                    <div class="grid">
                        <AppInput v-model="readonlyValue" label="Readonly" readonly helper="읽기 전용" />
                        <AppInput v-model="disabledValue" label="Disabled" disabled placeholder="비활성" helper="disabled" />
                        <AppInput v-model="password" label="Password" type="password" placeholder="••••••••" clearable />
                    </div>
                </section>

                <section class="card">
                    <h2 class="card__title">간단 검증</h2>
                    <div class="grid">
                        <AppInput
                            v-model="requiredValue"
                            label="필수 입력"
                            placeholder="비어있으면 에러"
                            :error="requiredError"
                            clearable
                        />
                        <AppInput
                            v-model="age"
                            label="나이"
                            type="number"
                            placeholder="0 ~ 120"
                            :min="0"
                            :max="120"
                            :error="ageError"
                            helper="숫자 입력"
                            input-mode-override="numeric"
                            clearable
                        />
                    </div>
                </section>
            </main>

            <aside class="demo-aside" aria-label="현재 값 패널">
                <div class="demo-aside__sticky">
                    <section class="card">
                        <h2 class="card__title">Actions</h2>
                        <div class="actions">
                            <AppButton variant="fill" @click="onSubmit">제출(검증)</AppButton>
                            <AppButton variant="text" @click="onReset">초기화</AppButton>
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
const basic = ref('')
const email = ref('')
const search = ref('')
const password = ref('')

const sizes = reactive({
    sm: '',
    md: '',
    lg: '',
})

const readonlyValue = ref('읽기 전용 값')
const disabledValue = ref('비활성 값')

const requiredValue = ref('')
const age = ref<string | number>('')

const submitted = ref(false)

const requiredError = computed(() => {
    if (!submitted.value) return undefined
    return requiredValue.value.trim().length === 0 ? '필수 입력입니다.' : undefined
})

const ageError = computed(() => {
    if (!submitted.value) return undefined
    const n = Number(age.value)
    if (age.value === '' || Number.isNaN(n)) return '숫자를 입력해주세요.'
    if (n < 0 || n > 120) return '0 ~ 120 범위로 입력해주세요.'
    return undefined
})

const output = computed(() =>
    JSON.stringify(
        {
            basic: basic.value,
            email: email.value,
            search: search.value,
            password: password.value ? '(hidden)' : '',
            sizes,
            readonlyValue: readonlyValue.value,
            disabledValue: disabledValue.value,
            requiredValue: requiredValue.value,
            age: age.value,
            submitted: submitted.value,
        },
        null,
        2,
    ),
)

function onSubmit() {
    submitted.value = true
}

function onReset() {
    basic.value = ''
    email.value = ''
    search.value = ''
    password.value = ''
    sizes.sm = ''
    sizes.md = ''
    sizes.lg = ''
    requiredValue.value = ''
    age.value = ''
    submitted.value = false
}
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
