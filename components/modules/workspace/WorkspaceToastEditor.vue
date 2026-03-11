<template>
    <div class="toast-editor" ref="root" />
</template>

<script setup lang="ts">
import type Editor from '@toast-ui/editor'

const props = withDefaults(
    defineProps<{
        modelValue: string
        preview?: 'edit' | 'preview' | 'vertical'
    }>(),
    { preview: 'vertical' },
)

const emit = defineEmits<{
    (e: 'update:modelValue', v: string): void
}>()

const root = ref<HTMLDivElement | null>(null)
let editor: Editor | null = null
let isSettingValue = false

onMounted(async () => {
    if (!root.value) return

    // 클라이언트에서만 로드(SSR/라우트 네비게이션 시 platform 참조 에러 방지)
    const [{ default: ToastEditor }] = await Promise.all([
        import('@toast-ui/editor'),
        import('@toast-ui/editor/dist/toastui-editor.css'),
    ])

    editor = new ToastEditor({
        el: root.value,
        height: '100%',
        initialEditType: 'markdown',
        previewStyle: props.preview === 'edit' ? 'tab' : props.preview === 'preview' ? 'tab' : 'vertical',
        initialValue: props.modelValue ?? '',
        usageStatistics: false,
    })

    editor.on('change', () => {
        if (!editor || isSettingValue) return
        emit('update:modelValue', editor.getMarkdown())
    })
})

watch(
    () => props.modelValue,
    (v) => {
        if (!editor) return
        const current = editor.getMarkdown()
        if (v === current) return
        isSettingValue = true
        editor.setMarkdown(v ?? '', false)
        isSettingValue = false
    },
)

onBeforeUnmount(() => {
    editor?.destroy()
    editor = null
})
</script>

<style scoped lang="scss">
.toast-editor {
    height: 100%;
    min-height: 0;
}

:deep(.toastui-editor-defaultUI) {
    border: 0;
    height: 100%;
}

:deep(.toastui-editor-toolbar) {
    border-bottom: 1px solid rgba($gray-200, 0.9);
}
</style>

