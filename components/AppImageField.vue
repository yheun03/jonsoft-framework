<template>
    <div
        class="app-image-field"
        :class="{
            'is-disabled': disabled,
            'is-dragover': dragOver,
        }"
        :style="{
            '--aif-size': typeof previewSize === 'number' ? `${previewSize}px` : previewSize,
        }"
        @dragenter.prevent="onDragEnter"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
    >

        <button
            type="button"
            class="app-image-field__preview"
            :disabled="disabled"
            :aria-label="modelValue ? '이미지 변경' : '이미지 선택'"
            @click="openFile"
            @keydown.enter.prevent="openFile"
            @keydown.space.prevent="openFile"
        >
            <img v-if="modelValue" :src="modelValue" :alt="previewAlt" />
            <div v-else class="app-image-field__empty">
                {{ emptyText }}
            </div>

            <AppButton
                v-if="removable && modelValue"
                class="app-image-field__remove"
                variant="text"
                size="custom"
                :custom-size="{ width: 22, height: 22 }"
                :aria-label="removeText"
                @click.stop="removeImage"
            >
                <template #iconLeft>
                    <span class="app-image-field__remove-icon" aria-hidden="true" v-html="XmarkSvg" />
                </template>
            </AppButton>
        </button>

        <input
            ref="fileInput"
            type="file"
            :name="name"
            :accept="accept"
            hidden
            :disabled="disabled"
            @change="onFileChange"
        />

    </div>
</template>

<script setup lang="ts">
import XmarkSvg from '@/assets/icons/12/ic-xmark.svg?raw'

type ReadMode = 'dataUrl' | 'objectUrl'

const props = withDefaults(
    defineProps<{
        modelValue?: string
        name?: string
        disabled?: boolean
        accept?: string
        previewAlt?: string
        emptyText?: string
        changeText?: string
        removeText?: string
        previewSize?: number | string
        showActions?: boolean
        removable?: boolean
        allowDrop?: boolean
        maxSizeBytes?: number
        readMode?: ReadMode
        beforeChange?: (file: File) => boolean | Promise<boolean>
    }>(),
    {
        modelValue: '',
        name: undefined,
        disabled: false,
        accept: 'image/*',
        previewAlt: '',
        emptyText: 'No Image',
        changeText: '이미지 변경',
        removeText: '제거',
        previewSize: 48,
        showActions: true,
        removable: true,
        allowDrop: true,
        maxSizeBytes: undefined,
        readMode: 'dataUrl',
        beforeChange: undefined,
    },
)

const emit = defineEmits([
    'update:modelValue',
    'change',
    'remove',
    'error',
])

const fileInput = ref<HTMLInputElement>()
const dragOver = ref(false)
const lastObjectUrl = ref<string | null>(null)

function openFile() {
    if (props.disabled) return
    fileInput.value?.click()
}

function removeImage() {
    emit('update:modelValue', '')
    emit('remove')
    cleanupObjectUrl()
}

function cleanupObjectUrl() {
    if (lastObjectUrl.value) {
        URL.revokeObjectURL(lastObjectUrl.value)
        lastObjectUrl.value = null
    }
}

function isImageFile(file: File) {
    return file.type?.startsWith('image/')
}

function error(message: string, detail?: unknown) {
    emit('error', { message, detail })
}

async function shouldAccept(file: File) {
    if (props.maxSizeBytes != null && file.size > props.maxSizeBytes) {
        error('파일 용량 제한을 초과했습니다.', {
            maxSizeBytes: props.maxSizeBytes,
            size: file.size,
        })
        return false
    }

    if (props.accept.includes('image') && !isImageFile(file)) {
        error('이미지 파일만 업로드할 수 있습니다.', { type: file.type })
        return false
    }

    if (props.beforeChange) {
        const ok = await props.beforeChange(file)
        if (!ok) return false
    }

    return true
}

async function setFromFile(file: File) {
    if (!(await shouldAccept(file))) return

    if (props.readMode === 'objectUrl') {
        cleanupObjectUrl()
        const url = URL.createObjectURL(file)
        lastObjectUrl.value = url
        emit('update:modelValue', url)
        emit('change', file, url)
        return
    }

    const reader = new FileReader()

    reader.onerror = () => {
        error('파일을 읽는 중 오류가 발생했습니다.')
    }

    reader.onload = () => {
        const url = reader.result as string
        cleanupObjectUrl()
        emit('update:modelValue', url)
        emit('change', file, url)
    }

    reader.readAsDataURL(file)
}

async function onFileChange(e: Event) {

    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    await setFromFile(file)
    ;(e.target as HTMLInputElement).value = ''

}

function onDragEnter() {
    if (!props.allowDrop || props.disabled) return
    dragOver.value = true
}

function onDragOver() {
    if (!props.allowDrop || props.disabled) return
    dragOver.value = true
}

function onDragLeave() {
    dragOver.value = false
}

async function onDrop(e: DragEvent) {
    dragOver.value = false
    if (!props.allowDrop || props.disabled) return
    const file = e.dataTransfer?.files?.[0]
    if (!file) return
    await setFromFile(file)
}

onBeforeUnmount(() => cleanupObjectUrl())
</script>