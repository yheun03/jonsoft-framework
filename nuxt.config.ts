// nuxt.config.ts
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

                    // ✅ 실무에서 가장 많이 쓰는 “전역 주입”
                    // 모든 scss에서 variables/mixins/functions를 import 없이 사용
                    additionalData: `@use "abstract/variables" as *;`,
                },
            },
        },
    },

    runtimeConfig: {
        public: {
            apiBase: '/api',
        },
    },
})