<template>
    <AppModalBase :id="id" :title="title" :width="width" :height="height" :z-index="zIndex" :overlay="overlay"
        :closable="closable" :close-on-dim="closeOnDim" :close-on-esc="closeOnEsc" :is-top="isTop"
        @modal-close="onClose">
        <div class="app-alert-modal__message">
            {{ message }}
        </div>

        <template #footer>
            <div class="app-alert-modal__actions">
                <AppButton variant="fill" @click="onConfirm">
                    {{ confirmText }}
                </AppButton>
            </div>
        </template>
    </AppModalBase>
</template>

<script setup lang="ts">
import AppModalBase from './AppModalBase.vue'

const props = withDefaults(
    defineProps<{
        id: number
        title?: string
        message?: string
        confirmText?: string
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
        title: '안내',
        message: '',
        confirmText: '확인',
        width: '420px',
        height: undefined,
        zIndex: 2000,
        overlay: true,
        closable: true,
        closeOnDim: true,
        closeOnEsc: true,
        isTop: true,
    },
)

const emit = defineEmits<{
    (e: 'modal-close', id: number, reason?: 'esc' | 'backdrop' | 'close'): void
    (e: 'modal-confirm', id: number): void
}>()

function onClose(id: number, reason: 'esc' | 'backdrop' | 'close') {
    emit('modal-close', id, reason)
}

function onConfirm() {
    emit('modal-confirm', props.id)
}
</script>