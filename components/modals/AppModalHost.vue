<template>
    <Teleport to="body">
        <template v-for="(modalItem, modalIndex) in modalStore.modals" :key="modalItem.id">
            <AppModalAlert v-if="modalItem.type === 'alert'" :id="modalItem.id" :title="modalItem.title"
                :message="modalItem.message" :confirm-text="modalItem.confirmText" :width="modalItem.width"
                :height="modalItem.height" :z-index="getModalZIndex(modalIndex)" :overlay="modalItem.overlay"
                :closable="modalItem.closable" :close-on-dim="modalItem.closeOnDim" :close-on-esc="modalItem.closeOnEsc"
                :is-top="isTopModal(modalItem.id)" @modal-close="handleModalClose"
                @modal-confirm="handleModalConfirm" />

            <AppModalConfirm v-else-if="modalItem.type === 'confirm'" :id="modalItem.id" :title="modalItem.title"
                :message="modalItem.message" :confirm-text="modalItem.confirmText" :cancel-text="modalItem.cancelText"
                :auto-close="modalItem.autoClose" :width="modalItem.width" :height="modalItem.height"
                :z-index="getModalZIndex(modalIndex)" :overlay="modalItem.overlay" :closable="modalItem.closable"
                :close-on-dim="modalItem.closeOnDim" :close-on-esc="modalItem.closeOnEsc"
                :is-top="isTopModal(modalItem.id)" @modal-close="handleModalClose" @modal-cancel="handleModalCancel"
                @modal-confirm="handleModalConfirm" />

            <AppModalCustom v-else-if="modalItem.type === 'custom'" :id="modalItem.id" :title="modalItem.title"
                :component="modalItem.component" :component-props="modalItem.componentProps" :width="modalItem.width"
                :height="modalItem.height" :z-index="getModalZIndex(modalIndex)" :overlay="modalItem.overlay"
                :closable="modalItem.closable" :close-on-dim="modalItem.closeOnDim" :close-on-esc="modalItem.closeOnEsc"
                :is-top="isTopModal(modalItem.id)" @modal-close="handleModalClose" />
        </template>
    </Teleport>
</template>

<script setup lang="ts">
import { useModalStore } from '~/core/stores/modal'
import AppModalAlert from './AppModalAlert.vue'
import AppModalConfirm from './AppModalConfirm.vue'
import AppModalCustom from './AppModalCustom.vue'

const modalStore = useModalStore()

function getModalZIndex(modalIndex: number) {
    return 2000 + modalIndex * 10
}

function isTopModal(modalId: number) {
    return modalId === modalStore.topModalId
}

function handleModalClose(modalId: number | undefined | null) {
    if (modalId == null) return
    modalStore.modalClose(modalId)
}

function handleModalCancel(modalId: number | undefined | null) {
    if (modalId == null) return
    modalStore.modalCancel(modalId)
}

function handleModalConfirm(modalId: number | undefined | null) {
    if (modalId == null) return
    modalStore.modalConfirm(modalId)
}
</script>