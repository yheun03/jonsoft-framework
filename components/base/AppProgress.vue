<template>
    <div class="app-progress" :class="`app-progress--${variant}`" :style="{ '--progress': `${clamped}%` }">
        <div v-if="variant === 'linear'" class="app-progress__track" role="progressbar" :aria-valuenow="clamped" aria-valuemin="0" aria-valuemax="100">
            <div class="app-progress__bar" />
        </div>

        <div v-else class="app-progress__circle" role="progressbar" :aria-valuenow="clamped" aria-valuemin="0" aria-valuemax="100">
            <svg viewBox="0 0 44 44" class="app-progress__svg" aria-hidden="true">
                <circle class="app-progress__ring" cx="22" cy="22" r="18" />
                <circle class="app-progress__value" cx="22" cy="22" r="18" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" />
            </svg>
            <span v-if="showLabel" class="app-progress__label">{{ clamped }}%</span>
        </div>
    </div>
</template>

<script setup lang="ts">
type Variant = 'linear' | 'circular'

const props = withDefaults(
    defineProps<{
        value: number
        variant?: Variant
        showLabel?: boolean
    }>(),
    { variant: 'linear', showLabel: false },
)

const clamped = computed(() => {
    const v = Number(props.value)
    if (Number.isNaN(v)) return 0
    return Math.min(100, Math.max(0, Math.round(v)))
})

// circular
const r = 18
const c = 2 * Math.PI * r
const dashArray = computed(() => `${c} ${c}`)
const dashOffset = computed(() => c - (clamped.value / 100) * c)
</script>

<style scoped lang="scss">
.app-progress__track {
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    overflow: hidden;
}

.app-progress__bar {
    height: 100%;
    width: var(--progress);
    background: var(--color-primary, #3b82f6);
    border-radius: 999px;
    transition: width 0.2s ease;
}

.app-progress__circle {
    position: relative;
    width: 80px;
    height: 80px;
    display: grid;
    place-items: center;
}

.app-progress__svg {
    width: 80px;
    height: 80px;
    transform: rotate(-90deg);
}

.app-progress__ring {
    fill: none;
    stroke: rgba(15, 23, 42, 0.08);
    stroke-width: 6;
}

.app-progress__value {
    fill: none;
    stroke: var(--color-primary, #3b82f6);
    stroke-width: 6;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.2s ease;
}

.app-progress__label {
    position: absolute;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.8);
}
</style>

