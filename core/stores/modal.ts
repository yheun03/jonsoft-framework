import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ModalItem, ModalOpenPayload, ModalCloseReason, ConfirmModalItem, AlertModalItem } from '~/core/types/modal';

export const useModalStore = defineStore('modal', () => {
    const modals = ref<ModalItem[]>([]);
    const sequence = ref(0);

    const topModalId = computed(() => {
        return modals.value.length ? modals.value[modals.value.length - 1].id : null;
    });

    function createId() {
        sequence.value += 1;
        return sequence.value;
    }

    function modalOpen(payload: ModalOpenPayload) {
        const modal: ModalItem = {
            id: createId(),
            overlay: true,
            closeOnDim: true,
            closeOnEsc: true,
            closable: true,
            width: '560px',
            ...payload,
        } as ModalItem;

        modals.value.push(modal);
        return modal.id;
    }

    function modalClose(id: number, reason: ModalCloseReason = 'close') {
        const index = modals.value.findIndex((modal) => modal.id === id);
        if (index < 0) return;

        const [target] = modals.value.splice(index, 1);
        target?.onClose?.(reason);
    }

    function modalConfirm(id: number) {
        const modal = modals.value.find((item) => item.id === id);
        if (!modal) return;

        if (modal.type === 'alert') {
            (modal as AlertModalItem).onConfirm?.();
            modalClose(id, 'confirm');
            return;
        }

        if (modal.type === 'confirm') {
            const confirmModal = modal as ConfirmModalItem;

            confirmModal.onConfirm?.();

            if (confirmModal.autoClose !== false) {
                modalClose(id, 'confirm');
            }
        }
    }

    function modalCancel(id: number) {
        const modal = modals.value.find((item) => item.id === id);
        if (!modal) return;

        if (modal.type === 'confirm') {
            (modal as ConfirmModalItem).onCancel?.();
        }

        modalClose(id, 'cancel');
    }

    function modalCloseTop(reason: ModalCloseReason = 'close') {
        const id = topModalId.value;
        if (id == null) return;
        modalClose(id, reason);
    }

    function clearAllModals() {
        const ids = modals.value.map((modal) => modal.id);
        ids.forEach((id) => modalClose(id, 'close'));
    }

    return {
        modals,
        topModalId,
        modalOpen,
        modalClose,
        modalConfirm,
        modalCancel,
        modalCloseTop,
        clearAllModals,
    };
});
