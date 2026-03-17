<template>
    <AppModal v-model="open" :title="title" :closable="closable" :close-on-backdrop="closeOnBackdrop"
        :close-on-esc="closeOnEsc">
        <div class="app-alert-modal__message">
            <slot>{{ message }}</slot>
        </div>

        <template #footer>
            <div class="app-alert-modal__actions">
                <AppButton variant="fill" @click="onOk">{{ okText }}</AppButton>
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
        okText?: string
        closable?: boolean
        closeOnBackdrop?: boolean
        closeOnEsc?: boolean
    }>(),
    {
        title: '안내',
        message: '',
        okText: '확인',
        closable: true,
        closeOnBackdrop: true,
        closeOnEsc: true,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'ok'): void
}>()

const open = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
})

function onOk() {
    emit('ok')
    open.value = false
}
</script>
