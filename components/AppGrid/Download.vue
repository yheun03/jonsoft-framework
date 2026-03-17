<template>
    <div class="app-grid-download">

        <AppButton size="sm" variant="outline" @click="downloadAll">
            엑셀 다운로드
        </AppButton>

        <AppButton size="sm" variant="outline" @click="downloadSelected">
            선택만 엑셀
        </AppButton>

    </div>
</template>

<script setup lang="ts">
import { useAgGridRegistry } from '~/core/composables/useAgGridRegistry'
import { useAgGridExcelExport } from '~/core/composables/useAgGridExcelExport'

const props = defineProps<{
    target: string
}>()

const { getApi } = useAgGridRegistry()
const { exportDisplayed, exportDisplayedSelected } = useAgGridExcelExport()

async function downloadAll() {
    const api = getApi(props.target)
    if (!api) return
    await exportDisplayed(props.target, api)
}

async function downloadSelected() {
    const api = getApi(props.target)
    if (!api) return
    await exportDisplayedSelected(props.target, api)
}
</script>