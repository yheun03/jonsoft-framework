// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    // #app-manifest 오류 방지 (Nuxt 3.15+ app manifest 충돌)
    experimental: { appManifest: false },

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
