<template>
    <div class="app-tabs">
        <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            class="app-tabs__tab"
            :class="{ 'is-active': t.id === activeId }"
            @click="emit('select', t.id)"
        >
            <span class="app-tabs__label">{{ t.title }}</span>
            <button
                v-if="closable && tabs.length > 1"
                type="button"
                class="app-tabs__close"
                aria-label="탭 닫기"
                @click.stop="emit('close', t.id)"
            >
                ×
            </button>
        </button>
    </div>
</template>

<script setup lang="ts">
type Tab = { id: string; title: string }

defineProps<{
    tabs: Tab[]
    activeId: string
    closable?: boolean
}>()

const emit = defineEmits<{
    (e: 'select', id: string): void
    (e: 'close', id: string): void
}>()
</script>

<style scoped lang="scss">
.app-tabs {
    display: flex;
    gap: 6px;
    padding: 8px 10px;
    border-bottom: 1px solid rgba($gray-200, 0.9);
    background: $gray-0;
    overflow-x: auto;
}

.app-tabs__tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba($gray-200, 1);
    background: $gray-50;
    color: $gray-800;
    border-radius: 10px;
    padding: 6px 10px;
    cursor: pointer;

    &.is-active {
        background: $gray-0;
        border-color: rgba($gray-300, 1);
    }
}

.app-tabs__label {
    @include b3_rg;
}

.app-tabs__close {
    border: 0;
    background: transparent;
    color: $gray-600;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 0;
}
</style>

