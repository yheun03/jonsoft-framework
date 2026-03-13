export default defineNuxtConfig({
    devtools: { enabled: true },
    experimental: { appManifest: false },
    features: { inlineStyles: false },

    app: {
        baseURL: '/jonsoft-framework/',
    },

    modules: ['@pinia/nuxt'],
    css: ['~/assets/scss/main.scss'],

    components: [
        { path: '~/components/base' },
        { path: '~/components/data' },
        { path: '~/components/modules', pathPrefix: false },
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