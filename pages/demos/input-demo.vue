<template>
    <div class="home">
        <h1>Jonsoft Framework</h1>
        <p>Input Demo: userId / userPw 저장</p>

        <div class="form">
            <AppInput v-model="form.userId" label="User ID" placeholder="아이디 입력" autocomplete="username" />

            <AppInput v-model="form.userPw" label="User Password" placeholder="비밀번호 입력" type="password"
                autocomplete="current-password" />

            <div class="buttons">
                <button class="btn primary" @click="onSave">저장</button>
                <button class="btn" @click="onClear">초기화</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const form = reactive({
    userId: '',
    userPw: '',
})

onMounted(() => {
    auth.hydrate()
    form.userId = auth.userId ?? ''
    form.userPw = auth.userPw ?? ''
})

function onSave() {
    if (!form.userId.trim()) return alert('userId를 입력해주세요.')
    if (!form.userPw.trim()) return alert('userPw를 입력해주세요.')

    auth.save({ userId: form.userId.trim(), userPw: form.userPw })
    alert('저장 완료 (sessionStorage)')
}

function onClear() {
    auth.clear()
    form.userId = ''
    form.userPw = ''
}
</script>

<style scoped lang="scss">
.home {
    padding: 2rem;
    text-align: center;
}

.form {
    margin: 2rem auto 0;
    max-width: 420px;
    display: grid;
    gap: 12px;
    text-align: left;
}

.buttons {
    display: flex;
    gap: 12px;
    margin-top: 8px;
}

.btn {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: #fff;
    cursor: pointer;
}

.btn.primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
}
</style>