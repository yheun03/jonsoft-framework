<template>
    <AppModal v-model="open" :title="title" :closable="closable" :close-on-backdrop="closeOnBackdrop"
        :close-on-esc="closeOnEsc">
        <div class="app-confirm-modal__message">
            <slot>{{ message }}</slot>
        </div>

        <template #footer>
            <div class="app-confirm-modal__actions">
                <AppButton variant="outline" @click="onCancel">{{ cancelText }}</AppButton>
                <AppButton variant="fill" @click="onConfirm">{{ confirmText }}</AppButton>
            </div>
        </template>
    </AppModal>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        modelValue: boolean
        title?: string
        message?: string
        confirmText?: string
        cancelText?: string
        /** true면 confirm/cancel 시 자동으로 닫힘 */
        autoClose?: boolean
        closable?: boolean
        closeOnBackdrop?: boolean
        closeOnEsc?: boolean
    }>(),
    {
        title: '확인',
        message: '',
        confirmText: '확인',
        cancelText: '취소',
        autoClose: true,
        closable: true,
        closeOnBackdrop: true,
        closeOnEsc: true,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
    (e: 'cancel'): void
}>()

const open = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
})

function onCancel() {
    emit('cancel')
    // UX 관점에서 "취소"는 항상 닫히는 것이 자연스럽습니다.
    // autoClose는 confirm(확인) 동작에만 적용합니다.
    open.value = false
}

function onConfirm() {
    emit('confirm')
    if (props.autoClose) open.value = false
}
</script>
