<template>
    <div class="route-tabs" role="navigation" aria-label="페이지 탭">
        <div class="route-tabs__scroller">
            <ul class="route-tabs__list" role="tablist" aria-label="최근 방문 페이지">
                <li v-for="t in tabs" :key="t.key" class="route-tabs__item" role="presentation">
                    <NuxtLink
                        class="route-tabs__tab"
                        :class="{ 'is-active': t.key === currentKey }"
                        role="tab"
                        :aria-selected="t.key === currentKey"
                        :to="t.path"
                        @click="() => onClickTab(t.key)"
                    >
                        <span class="route-tabs__title">{{ t.title }}</span>
                    </NuxtLink>

                    <button
                        class="route-tabs__close"
                        type="button"
                        aria-label="탭 닫기"
                        @click="(e) => onClose(e, t.key)"
                    >
                        <span class="route-tabs__close-icon" aria-hidden="true" v-html="XmarkSvg" />
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import XmarkSvg from '~/assets/icons/12/ic-xmark.svg?raw'
import { useRouteTabsStore } from '~/stores/route-tabs'

const router = useRouter()
const route = useRoute()
const store = useRouteTabsStore()

const { tabs, activeKey } = storeToRefs(store)
const currentKey = computed(() => activeKey.value ?? route.fullPath)

function onClickTab(key: string) {
    store.activate(key)
}

async function onClose(e: MouseEvent, key: string) {
    e.preventDefault()
    e.stopPropagation()

    const closingActive = currentKey.value === key
    const idx = tabs.value.findIndex((t) => t.key === key)
    const fallback = tabs.value[Math.max(0, idx - 1)] ?? tabs.value[idx + 1] ?? null

    store.close(key)

    if (closingActive && fallback) {
        await router.push(fallback.path)
    }
}
</script>

<style scoped lang="scss">
.route-tabs {
    background: $gray-0;
    border-bottom: 1px solid $gray-200;
    min-height: 40px;
    display: grid;
}

.route-tabs__scroller {
    overflow: auto hidden;
}

.route-tabs__list {
    list-style: none;
    padding: 6px 10px;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: max-content;
}

.route-tabs__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid $gray-200;
    border-radius: 8px;
    background: $gray-0;
    padding: 0 6px 0 10px;
    height: 28px;
}

.route-tabs__tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: $gray-700;
    text-decoration: none;
    max-width: 240px;
    min-width: 0;
}

.route-tabs__tab.is-active {
    color: $gray-900;
    font-weight: 600;
}

.route-tabs__title {
    @include b3_rg;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

.route-tabs__close {
    border: 0;
    background: transparent;
    padding: 0;
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background: $gray-100;
    }
}

.route-tabs__close-icon {
    display: inline-flex;
    width: 12px;
    height: 12px;

    :deep(svg) {
        width: 100%;
        height: 100%;
        display: block;
    }
}
</style>

