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
