<template>
    <div class="demo">
        <div class="row">
            <AppButton variant="fill">면 버튼</AppButton>
            <AppButton variant="text">글자 버튼</AppButton>
            <AppButton variant="underline">밑줄 버튼</AppButton>
        </div>

        <div class="row">
            <AppButton variant="fill">
                <template #iconLeft>
                    <span v-html="TempIconSvg" />
                </template>
                왼쪽 아이콘
            </AppButton>

            <AppButton variant="fill">
                오른쪽 아이콘
                <template #iconRight>
                    <span v-html="TempIconSvg" />
                </template>
            </AppButton>

            <AppButton variant="text" size="md" aria-label="아이콘 버튼">
                <template #iconLeft>
                    <span v-html="TempIconSvg" />
                </template>
            </AppButton>
        </div>

        <div class="row">
            <AppButton variant="underline" size="sm">
                <template #iconLeft>
                    <span v-html="TempIconSvg" />
                </template>
                밑줄 + 아이콘
            </AppButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import TempIconSvg from '@/assets/icons/temp.svg?raw'
</script>

<style scoped lang="scss">
.demo {
    display: grid;
    gap: 16px;
    padding: 16px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
}
</style>
