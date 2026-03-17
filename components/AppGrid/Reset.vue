<template>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useAgGridRegistry } from '~/core/composables/useAgGridRegistry'

const target = inject<string>('appGridTarget')

const { getApi } = useAgGridRegistry()


</script>