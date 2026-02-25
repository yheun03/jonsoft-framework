// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-02-25',
    devtools: { enabled: true },

    modules: ['@pinia/nuxt'],

    css: ['~/assets/scss/main.scss'],

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    // abstract/variables 등 상대 경로가 assets/scss 기준으로 해석됨
                    loadPaths: ['assets/scss'],
                },
            },
        },
    },

    runtimeConfig: {
        public: {
            apiBase: '/api', // 상대경로 - IP/포트 변경에 영향 없음
        },
    },
})
