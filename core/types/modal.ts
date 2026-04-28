import type { Component } from 'vue';

export type ModalType = 'alert' | 'confirm' | 'custom' | 'image' | 'pdf';
export type ModalCloseReason = 'esc' | 'backdrop' | 'close' | 'cancel' | 'confirm';

export type ModalBaseItem = {
    id: number;
    type: ModalType;
    title?: string;
    width?: string;
    height?: string;
    overlay?: boolean;
    closeOnDim?: boolean;
    closeOnEsc?: boolean;
    closable?: boolean;
    onClose?: (reason?: ModalCloseReason) => void;
};

export type AlertModalItem = ModalBaseItem & {
    type: 'alert';
    message?: string;
    confirmText?: string;
    onConfirm?: () => void;
};

export type ConfirmModalItem = ModalBaseItem & {
    type: 'confirm';
    message?: string;
    confirmText?: string;
    cancelText?: string;
    autoClose?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export type CustomModalItem = ModalBaseItem & {
    type: 'custom';
    component: Component;
    componentProps?: Record<string, unknown>;
};

export type ImageModalItem = ModalBaseItem & {
    type: 'image';
    imageUrl: string;
    imageAlt?: string;
    imageName?: string;
};

export type PdfModalItem = ModalBaseItem & {
    type: 'pdf';
    pdfUrl: string;
    downloadName?: string;
    emptyMessage?: string;
};

export type ModalItem = AlertModalItem | ConfirmModalItem | CustomModalItem | ImageModalItem | PdfModalItem;

export type ModalOpenPayload =
    | Omit<AlertModalItem, 'id'>
    | Omit<ConfirmModalItem, 'id'>
    | Omit<CustomModalItem, 'id'>
    | Omit<ImageModalItem, 'id'>
    | Omit<PdfModalItem, 'id'>;
