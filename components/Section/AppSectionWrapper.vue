<template>
    <section class="app-section-wrapper" :class="wrapperClasses" :style="wrapperStyle">
        <header v-if="hasHeader" class="app-section-wrapper__header">
            <slot name="header">
                <div class="app-section-wrapper__header-text">
                    <h2 v-if="title" class="app-section-wrapper__title">
                        {{ title }}
                    </h2>

                    <p v-if="desc" class="app-section-wrapper__desc">
                        {{ desc }}
                    </p>
                </div>
            </slot>
        </header>

        <div class="app-section-wrapper__body">
            <slot />
        </div>

        <footer v-if="$slots.footer" class="app-section-wrapper__footer">
            <slot name="footer" />
        </footer>
    </section>
</template>

<script setup lang="ts">
type SectionDirection = 'row' | 'column'
type SectionRatio = number[] | string | null

const props = withDefaults(
    defineProps<{
        direction?: SectionDirection
        ratio?: SectionRatio
        title?: string
        desc?: string
        gap?: number | string
    }>(),
    {
        direction: 'column',
        ratio: null,
        title: '',
        desc: '',
        gap: 16,
    },
)

function normalizeGap(value: number | string) {
    return typeof value === 'number' ? `${value}px` : value
}

function normalizeRatio(value: SectionRatio) {
    if (!value) return undefined

    if (Array.isArray(value)) {
        return value.map((item) => `${item}fr`).join(' ')
    }

    return value
}

const hasHeader = computed(() => {
    return !!props.title || !!props.desc || !!useSlots().header
})

const wrapperClasses = computed(() => [
    `app-section-wrapper--${props.direction}`,
])

const wrapperStyle = computed(() => {
    return {
        '--app-section-wrapper-gap': normalizeGap(props.gap),
        '--app-section-wrapper-template': normalizeRatio(props.ratio),
    }
})
</script>