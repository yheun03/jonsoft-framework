export default defineNuxtConfig({
    devtools: { enabled: true },
    experimental: { appManifest: false },
    modules: ['@pinia/nuxt'],
    css: ['~/assets/scss/main.scss'],

    components: [
        { path: '~/components/base' },
        // { path: '~/components/patterns', prefix: 'Pattern' },
        { path: '~/components/modules', pathPrefix: false },
    ],

    vite: {
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