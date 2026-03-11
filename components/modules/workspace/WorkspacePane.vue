<template>
    <section class="workspace-pane">
        <div class="workspace-pane__body">
            <MarkdownEditor
                :model-value="content"
                :preview="preview"
                @update:model-value="(v) => emit('update:content', v)"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import MarkdownEditor from '~/components/modules/workspace/WorkspaceToastEditor.vue'

defineProps<{
    tabs: { id: string; title: string }[]
    activeId: string
    content: string
    preview?: 'edit' | 'preview' | 'vertical'
}>()

const emit = defineEmits<{
    (e: 'select', id: string): void
    (e: 'close', id: string): void
    (e: 'update:content', content: string): void
}>()
</script>

<style scoped lang="scss">
.workspace-pane {
    display: grid;
    grid-template-rows: 1fr;
    height: 100%;
    min-height: 0;
}

.workspace-pane__body {
    height: 100%;
    min-height: 0;
    overflow: hidden;
}
</style>

