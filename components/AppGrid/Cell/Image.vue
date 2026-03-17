<template>
    <div
        class="app-grid-cell-image"
        @dragenter.stop
        @dragover.stop
        @dragleave.stop
        @drop.stop
    >
        <AppImageField v-model="value" :allow-drop="true" />
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    params: Object
})

const params = props.params

const value = computed({

    get: () => params?.value,

    set: (v) => {

        params?.node?.setDataValue(
            params?.column?.getColId(),
            v
        )

    }

})

</script>