<template>

    <div :class="[
        'app-input',
        `app-input--${size}`,
        `app-input--shape-${shape}`,
        {
            'app-input--icon-left': hasIconLeft,
            'app-input--icon-right': hasIconRight,
            'is-disabled': disabled,
            [`is-${state}`]: state
        }
    ]">

        <!-- label -->
        <label v-if="label" class="app-input__label" :for="inputId">
            {{ label }}
        </label>


        <!-- control -->
        <div class="app-input__control">

            <!-- icon left -->
            <span v-if="hasIconLeft" class="app-input__icon app-input__icon--left">
                <slot name="iconLeft" />
            </span>

            <!-- input -->
            <input :id="inputId" class="app-input__field" :type="type" :value="value" :placeholder="placeholder"
                :name="name" :autocomplete="autocomplete" :disabled="disabled" :readonly="readonly"
                :aria-invalid="state === 'error'" :aria-describedby="hintId" @input="onInput" />

            <!-- icon right -->
            <span v-if="hasIconRight" class="app-input__icon app-input__icon--right">
                <slot name="iconRight" />
            </span>

        </div>


        <!-- hint -->
        <p v-if="hint && state !== 'error'" class="app-input__hint" :id="hintId">
            {{ hint }}
        </p>


        <!-- error -->
        <p v-if="state === 'error'" class="app-input__error" :id="hintId">
            {{ hint }}
        </p>

    </div>

</template>


<script setup lang="ts">
import { computed, useSlots } from 'vue'

/* types */

type InputSize = 'xs' | 'sm' | 'md' | 'lg'

type InputShape =
    | 'square'
    | 'round'
    | 'pill'
    | 'underline'

type InputState =
    | 'error'
    | 'warning'
    | 'success'
    | null


/* props */

const props = withDefaults(
    defineProps<{

        modelValue: string | number | null

        label?: string
        hint?: string

        placeholder?: string
        type?: string

        size?: InputSize
        shape?: InputShape

        state?: InputState

        disabled?: boolean
        readonly?: boolean

        id?: string
        name?: string
        autocomplete?: string

    }>(),
    {
        size: 'md',
        shape: 'round',
        state: null,
        type: 'text',
        disabled: false,
        readonly: false
    }
)


/* emits */

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()


/* slots */

const slots = useSlots()

const hasIconLeft = computed(() => !!slots.iconLeft)
const hasIconRight = computed(() => !!slots.iconRight)


/* value */

const value = computed(() =>
    props.modelValue ?? ''
)


/* id */

const fallbackId = useId()

const inputId = computed(() =>
    props.id ?? `app-input-${fallbackId}`
)


/* aria */

const hintId = computed(() =>
    props.hint ? `hint-${inputId.value}` : undefined
)


/* events */

function onInput(e: Event) {

    const target = e.target as HTMLInputElement

    emit('update:modelValue', target.value)

}
</script>