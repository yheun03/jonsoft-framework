<template>
    <AppImageField v-model="value" />
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