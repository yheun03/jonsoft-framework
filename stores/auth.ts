import { defineStore } from 'pinia'
import { ref } from 'vue'

const KEY_USER_ID = 'demo_userId'
const KEY_USER_PW = 'demo_userPw'

export const useAuthStore = defineStore('auth', () => {
    const userId = ref('')
    const userPw = ref('')

    function hydrate() {
        if (!import.meta.client) return
        userId.value = sessionStorage.getItem(KEY_USER_ID) ?? ''
        userPw.value = sessionStorage.getItem(KEY_USER_PW) ?? ''
    }

    function save(payload: { userId: string; userPw: string }) {
        userId.value = payload.userId
        userPw.value = payload.userPw

        if (!import.meta.client) return
        sessionStorage.setItem(KEY_USER_ID, payload.userId)
        sessionStorage.setItem(KEY_USER_PW, payload.userPw)

        // ✅ 디버깅용 (잘 저장됐는지 바로 확인)
        console.log('[auth.save] saved', {
            [KEY_USER_ID]: sessionStorage.getItem(KEY_USER_ID),
            [KEY_USER_PW]: sessionStorage.getItem(KEY_USER_PW),
        })
    }

    function clear() {
        userId.value = ''
        userPw.value = ''

        if (!import.meta.client) return
        sessionStorage.removeItem(KEY_USER_ID)
        sessionStorage.removeItem(KEY_USER_PW)
    }

    return { userId, userPw, hydrate, save, clear }
})