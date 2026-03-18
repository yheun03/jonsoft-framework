<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">Image Field Demo</h1>
                    <p class="page-demo__desc">이미지 업로드/미리보기/제거 및 change 이벤트를 확인합니다.</p>
                </header>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">기본</h2>

                    <div class="page-demo-row">
                        <AppImageField
                            v-model="imageUrl"
                            :preview-size="48"
                            empty-text="No Image"
                            :max-size-bytes="maxSizeBytes"
                            @change="onChange"
                            @error="onError"
                            @remove="onRemove"
                        />

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">현재 값 / 옵션</div>
                            <div class="page-demo-actions">
                                <AppButton size="sm" variant="outline" @click="setSample">샘플 이미지</AppButton>
                                <AppButton size="sm" variant="text" :disabled="!imageUrl" @click="clear">
                                    값 비우기
                                </AppButton>
                                <AppButton size="sm" variant="text" @click="toggleDisabled">
                                    disabled: {{ disabled ? 'ON' : 'OFF' }}
                                </AppButton>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="page-demo-card">
                    <h2 class="page-demo-card__title">Drag & Drop + objectUrl 모드</h2>

                    <div class="page-demo-stack">
                        <div class="page-demo-row">
                            <AppImageField
                                v-model="imageUrl2"
                                :preview-size="64"
                                :disabled="disabled"
                                read-mode="objectUrl"
                                :allow-drop="true"
                                empty-text="Drop here"
                                @change="onChange2"
                                @error="onError"
                            />
                            <div class="page-demo-hint">
                                이 섹션은 `readMode="objectUrl"`이라 메모리/성능상 유리할 수 있어요. (컴포넌트가 자동 revoke 처리)
                            </div>
                        </div>

                        <div
                            style="
                                width: 240px;
                                height: 240px;
                                border: 1px solid #eee;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                overflow: hidden;
                                background: #fafafa;
                            "
                        >
                            <img v-if="imageUrl2" :src="imageUrl2" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
                            <div v-else style="font-size: 12px; color: #999;">No Image</div>
                        </div>
                    </div>
                </section>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <section class="page-demo-card">
                        <h2 class="page-demo-card__title">Actions</h2>
                        <div class="page-demo-actions">
                            <AppButton variant="primary" @click="setSample">샘플 이미지(상단)</AppButton>
                            <AppButton variant="text" @click="resetAll">초기화</AppButton>
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
type FileMeta = {
    name: string
    type: string
    size: number
    lastModified: number
}

const imageUrl = ref('')
const imageUrl2 = ref('')
const disabled = ref(false)
const maxSizeBytes = ref(2 * 1024 * 1024)

const lastFile = ref<FileMeta | null>(null)
const lastFile2 = ref<FileMeta | null>(null)
const lastError = ref<{ message: string; detail?: unknown } | null>(null)
const removedCount = ref(0)

function toMeta(file: File): FileMeta {
    return {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
    }
}

function onChange(file: File) {
    lastFile.value = toMeta(file)
    lastError.value = null
}

function onChange2(file: File) {
    lastFile2.value = toMeta(file)
    lastError.value = null
}

function setSample() {
    imageUrl.value = 'https://picsum.photos/240?random=1'
}

function clear() {
    imageUrl.value = ''
}

function toggleDisabled() {
    disabled.value = !disabled.value
}

function onError(payload: { message: string; detail?: unknown }) {
    lastError.value = payload
}

function onRemove() {
    removedCount.value += 1
}

function resetAll() {
    imageUrl.value = ''
    imageUrl2.value = ''
    lastFile.value = null
    lastFile2.value = null
    lastError.value = null
    removedCount.value = 0
}

const output = computed(() =>
    JSON.stringify(
        {
            imageUrl: imageUrl.value ? '(set)' : '',
            imageUrl2: imageUrl2.value ? '(set)' : '',
            disabled: disabled.value,
            maxSizeBytes: maxSizeBytes.value,
            lastFile: lastFile.value,
            lastFile2: lastFile2.value,
            lastError: lastError.value,
            removedCount: removedCount.value,
        },
        null,
        2,
    ),
)
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->
