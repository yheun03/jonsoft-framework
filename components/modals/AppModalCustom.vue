<template>
    <AppModalBase :id="id" :title="title" :width="width" :height="height" :z-index="zIndex" :overlay="overlay"
        :closable="closable" :close-on-dim="closeOnDim" :close-on-esc="closeOnEsc" :is-top="isTop"
        @modal-close="onClose">
        <component :is="component" v-bind="componentProps" />
    </AppModalBase>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import AppModalBase from './AppModalBase.vue'

const props = withDefaults(
    defineProps<{
        id: number
        title?: string
        component: Component
        componentProps?: Record<string, unknown>
        width?: string
        height?: string
        zIndex?: number
        overlay?: boolean
        closable?: boolean
        closeOnDim?: boolean
        closeOnEsc?: boolean
        isTop?: boolean
    }>(),
    {
        componentProps: () => ({}),
    },
)

const emit = defineEmits<{
    (e: 'modal-close', id: number, reason?: 'esc' | 'backdrop' | 'close'): void
}>()

function onClose(id: number, reason: 'esc' | 'backdrop' | 'close') {
    emit('modal-close', id, reason)
}
</script>