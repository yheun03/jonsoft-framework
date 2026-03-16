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

