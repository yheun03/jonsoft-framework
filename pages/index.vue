<template>
    <div class="workspace">
        <div class="workspace__content">
            <WorkspacePane
                class="workspace__pane"
                :tabs="ws.tabs"
                :active-id="ws.activeTabIdByPane.left"
                :content="ws.leftTab.content"
                preview="vertical"
                @select="(id) => ws.setActiveTabForPane('left', id)"
                @close="ws.closeTab"
                @update:content="(v) => ws.updateTabContent(ws.activeTabIdByPane.left, v)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import WorkspacePane from '~/components/modules/workspace/WorkspacePane.vue'
import { useWorkspaceStore } from '~/stores/workspace'

const ws = useWorkspaceStore()
</script>

<style scoped lang="scss">
.workspace {
    display: grid;
    grid-template-rows: 1fr;
    height: 100%;
    min-height: 0;
}

.workspace__content {
    min-height: 0;
    display: grid;
    grid-template-columns: 1fr;
}

.workspace__pane {
    min-height: 0;
    background: $gray-0;
}
</style>
