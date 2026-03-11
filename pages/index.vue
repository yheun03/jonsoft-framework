<template>
    <div class="workspace">
        <header class="workspace__topbar">
            <AppButton variant="text" size="custom" :custom-size="{ width: 28 }" ariaLabel="창 분리" @click="ws.toggleSplit()">
                <template #iconLeft>
                    <span class="workspace__topbar-icon" aria-hidden="true">⧉</span>
                </template>
            </AppButton>
        </header>

        <div class="workspace__content" :class="{ 'is-split': ws.split }">
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

            <WorkspacePane
                v-if="ws.split"
                class="workspace__pane"
                :tabs="ws.tabs"
                :active-id="ws.activeTabIdByPane.right"
                :content="ws.rightTab.content"
                preview="preview"
                @select="(id) => ws.setActiveTabForPane('right', id)"
                @close="ws.closeTab"
                @update:content="(v) => ws.updateTabContent(ws.activeTabIdByPane.right, v)"
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
    grid-template-rows: auto 1fr;
    height: 100%;
    min-height: 0;
}

.workspace__topbar {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px 12px;
    border-bottom: 1px solid rgba($gray-200, 0.9);
    background: $gray-0;
}

.workspace__topbar-icon {
    font-size: 18px;
}

.workspace__content {
    min-height: 0;
    display: grid;
    grid-template-columns: 1fr;
}

.workspace__content.is-split {
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: rgba($gray-200, 0.9);
}

.workspace__pane {
    min-height: 0;
    background: $gray-0;
}
</style>
