export default defineNuxtConfig({
    devtools: { enabled: true },
    experimental: { appManifest: false },
    features: { inlineStyles: false },

    app: {
        baseURL: '/jonsoft-framework/',
    },

    modules: ['@pinia/nuxt'],
    css: ['~/assets/scss/main.scss'],

    imports: {
        dirs: ['~/core/composables'],
    },

    pinia: {
        storesDirs: ['~/core/stores'],
    },

    components: [
        // 모든 전역 컴포넌트를 components 루트에서 자동 등록
        { path: '~/components', pathPrefix: true },
    ],

    vite: {
        build: {
            cssCodeSplit: false,
        },
        server: {
            watch: {
                usePolling: true,
                interval: 250,
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    loadPaths: ['assets/scss'],
                    additionalData: `@use "abstract/index" as *;`,
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