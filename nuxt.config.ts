export default defineNuxtConfig({
    devtools: { enabled: true },
    experimental: { appManifest: false },
    features: { inlineStyles: false },

    app: {
        baseURL: '/jonsoft-framework/',
    },

    modules: ['@pinia/nuxt'],
    css: [
        // AG Grid 테마 CSS는 전역 link 로드로 고정 (dev 인라인 주입 최소화)
        'ag-grid-community/styles/ag-theme-quartz.css',
        '~/assets/scss/main.scss',
    ],

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

    // macOS 등에서 fs watcher 한도(EMFILE) 이슈 완화
    watchers: {
        chokidar: {
            usePolling: true,
            interval: 250,
        },
    },

    runtimeConfig: {
        public: {
            apiBase: '/api',
        },
    },

    // GitHub Pages 배포 대응
    nitro: {
        preset: "static"
    }
})