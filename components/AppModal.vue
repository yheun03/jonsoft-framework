<template>
    <Teleport to="body">
        <div v-if="modelValue" class="app-modal" :style="{ zIndex: String(zIndexValue) }">
            <div class="app-modal__backdrop" @click="onBackdropClick" />

            <div
                class="app-modal__dialog"
                role="dialog"
                aria-modal="true"
                :aria-label="ariaLabel"
                @click.stop
            >
                <header v-if="title || $slots.header" class="app-modal__header">
                    <div class="app-modal__header-left">
                        <slot name="header">
                            <h2 class="app-modal__title">{{ title }}</h2>
                        </slot>
                    </div>

                    <AppButton
                        v-if="closable"
                        class="app-modal__close"
                        variant="text"
                        size="custom"
                        :custom-size="{ width: 34, height: 34 }"
                        aria-label="닫기"
                        @click="requestClose('close')"
                    >
                        <template #iconLeft>
                            <span class="app-modal__close-icon" aria-hidden="true" v-html="XmarkSvg" />
                        </template>
                    </AppButton>
                </header>

                <section class="app-modal__body">
                    <slot />
                </section>

                <footer v-if="$slots.footer" class="app-modal__footer">
                    <slot name="footer" />
                </footer>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import XmarkSvg from '@/assets/icons/12/ic-xmark.svg?raw'
import { useModalStack } from '~/core/composables/useModalStack'

type CloseReason = 'esc' | 'backdrop' | 'close'

const props = withDefaults(
    defineProps<{
        modelValue: boolean
        title?: string
        ariaLabel?: string
        closable?: boolean
        closeOnBackdrop?: boolean
        closeOnEsc?: boolean
    }>(),
    {
        title: '',
        ariaLabel: '모달',
        closable: true,
        closeOnBackdrop: true,
        closeOnEsc: true,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'close', reason: CloseReason): void
}>()

const id = Symbol('modal')
const { open, close, isTop, zIndex } = useModalStack(id)

const zIndexValue = computed(() => zIndex(2000, 10))

function requestClose(reason: CloseReason) {
    emit('close', reason)
    emit('update:modelValue', false)
}

function onBackdropClick() {
    if (!props.closeOnBackdrop) return
    // 여러 모달이 열린 상태에서는 최상단만 닫히게
    if (!isTop()) return
    requestClose('backdrop')
}

function onKeydown(e: KeyboardEvent) {
    if (!props.closeOnEsc) return
    if (e.key !== 'Escape') return
    if (!props.modelValue) return
    if (!isTop()) return
    e.preventDefault()
    requestClose('esc')
}

watch(
    () => props.modelValue,
    (v) => {
        if (v) open()
        else close()
    },
    { immediate: true },
)

onMounted(() => {
    if (import.meta.server) return
    window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
    if (import.meta.server) return
    window.removeEventListener('keydown', onKeydown)
    close()
})
</script>

