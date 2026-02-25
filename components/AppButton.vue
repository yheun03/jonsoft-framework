<template>
  <NuxtLink
    v-if="!isExternal"
    :to="to"
    class="app-button"
    :class="[variantClass, sizeClass]"
    @click="handleClick"
  >
    <slot />
  </NuxtLink>
  <a
    v-else
    :href="to"
    :target="newTab ? '_blank' : undefined"
    :rel="newTab ? 'noopener noreferrer' : undefined"
    class="app-button"
    :class="[variantClass, sizeClass]"
    @click="handleClick"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 이동할 주소 (내부 경로: /about, 외부: https://...) */
    to: string
    /** primary | secondary | outline | ghost */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    /** sm | md | lg */
    size?: 'sm' | 'md' | 'lg'
    /** 외부 링크 시 새 탭 열기 */
    newTab?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    newTab: false,
  }
)

const isExternal = computed(() =>
  /^https?:\/\//.test(props.to)
)

const variantClass = computed(() => `app-button--${props.variant}`)
const sizeClass = computed(() => `app-button--${props.size}`)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<style scoped lang="scss">
@use "abstract/variables" as *;
@use "sass:color";

.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  font-family: $font-family-base;
  font-weight: 600;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  // Size
  &--sm {
    padding: $spacing-xs $spacing-sm;
    font-size: 0.875rem;
  }

  &--md {
    padding: $spacing-sm $spacing-md;
    font-size: 1rem;
  }

  &--lg {
    padding: $spacing-md $spacing-lg;
    font-size: 1.125rem;
  }

  // Variant
  &--primary {
    background: $color-primary;
    color: white;

    &:hover {
      background: color.adjust($color-primary, $lightness: -8%);
    }
  }

  &--secondary {
    background: $color-secondary;
    color: white;

    &:hover {
      background: color.adjust($color-secondary, $lightness: -8%);
    }
  }

  &--outline {
    background: transparent;
    color: $color-primary;
    border: 2px solid $color-primary;

    &:hover {
    background: rgba($color-primary, 0.1);
    }
  }

  &--ghost {
    background: transparent;
    color: $color-primary;

    &:hover {
      background: rgba($color-primary, 0.1);
    }
  }
}
</style>
