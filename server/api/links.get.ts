/**
 * 링크 목록 API
 * AppButton 등에서 사용할 이동 주소 목록 반환
 */
export default defineEventHandler(() => {
    return {
        links: [
            {
                id: '1',
                label: '홈으로',
                to: '/',
            },
            {
                id: '2',
                label: 'Nuxt 문서',
                to: 'https://nuxt.com',
                newTab: true,
            },
            {
                id: '3',
                label: 'Vue 문서',
                to: 'https://vuejs.org',
                newTab: true,
            },
            {
                id: '4',
                label: 'Pinia 문서',
                to: 'https://pinia.vuejs.org',
                newTab: true,
            },
            {
                id: '5',
                label: '유저 목록',
                to: '/users',
            },
            {
                id: '6',
                label: '유저별 구매이력',
                to: '/purchases',
            },
        ],
    }
})
