export default defineNuxtConfig({
    devtools: { enabled: true },
    experimental: { appManifest: false },
    features: { inlineStyles: false },
    modules: ['@pinia/nuxt'],
    css: ['~/assets/scss/main.scss'],

    components: [
        { path: '~/components/base' },
        { path: '~/components/data' },
        // { path: '~/components/patterns', prefix: 'Pattern' },
        { path: '~/components/modules', pathPrefix: false },
    ],

    vite: {
        build: {
            cssCodeSplit: false,
        },
        server: {
            // macOS에서 fs watcher 한도(EMFILE) 이슈가 발생할 때 폴링으로 우회
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
        public: { apiBase: '/api' },
    },
})