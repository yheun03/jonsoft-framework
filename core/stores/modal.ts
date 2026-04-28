import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { AlertModalItem, ConfirmModalItem, CustomModalItem, ModalCloseReason, ModalItem, ModalOpenPayload } from '~/core/types/modal';

const MODAL_DEFAULTS = {
    common: {
        overlay: true,
        closable: true,
        closeOnDim: true,
        closeOnEsc: true,
        keepOnConfirm: false,
        width: '560px',
        height: undefined,
    },
    alert: {
        title: '안내',
        message: '',
        confirmText: '확인',
        width: '420px',
    },
    confirm: {
        title: '확인',
        message: '',
        confirmText: '확인',
        cancelText: '취소',
        width: '460px',
    },
    custom: {
        title: '',
        width: '560px',
        height: undefined,
        componentProps: {},
    },
} as const;

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

    function normalizePayload(payload: ModalOpenPayload): ModalItem {
        const common = MODAL_DEFAULTS.common;

        switch (payload.type) {
            case 'alert':
                return {
                    id: createId(),
                    ...common,
                    ...MODAL_DEFAULTS.alert,
                    ...payload,
                } as AlertModalItem;

            case 'confirm':
                return {
                    id: createId(),
                    ...common,
                    ...MODAL_DEFAULTS.confirm,
                    ...payload,
                } as ConfirmModalItem;

            case 'custom':
                return {
                    id: createId(),
                    ...common,
                    ...MODAL_DEFAULTS.custom,
                    ...payload,
                    componentProps: payload.componentProps ?? {},
                } as CustomModalItem;
        }
    }

    function modalOpen(payload: ModalOpenPayload) {
        const modal = normalizePayload(payload);
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

        const shouldKeep = modal.keepOnConfirm === true;

        if (modal.type === 'alert') {
            if (!shouldKeep) {
                modalClose(id, 'confirm');
            }

            modal.onConfirm?.();
            return;
        }

        if (modal.type === 'confirm') {
            if (!shouldKeep) {
                modalClose(id, 'confirm');
            }

            modal.onConfirm?.();
        }
    }

    function modalCancel(id: number) {
        const modal = modals.value.find((item) => item.id === id);
        if (!modal) return;

        if (modal.type === 'confirm') {
            modal.onCancel?.();
        }

        modalClose(id, 'cancel');
    }

    function modalCloseTop(reason: ModalCloseReason = 'close') {
        const id = topModalId.value;
        if (id == null) return;
        modalClose(id, reason);
    }

    function clearAllModals() {
        const ids = modals.value.map((modal) => modal.id).reverse();
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
