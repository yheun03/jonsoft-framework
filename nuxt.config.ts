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
        { path: '~/components/Table', pathPrefix: false },
        { path: '~/components/Layout', pathPrefix: false },
        { path: '~/components/Modal', pathPrefix: false },
        // 모든 전역 컴포넌트를 components 루트에서 자동 등록
        { path: '~/components', pathPrefix: true },
    ],

    // 실무형 구조: 플러그인을 core 내부에서 명시 로딩
    plugins: [
        '~/core/plugins/preferences.client',
        '~/core/app/plugins/axios',
        '~/core/plugins/iconify',
        '~/core/plugins/ag-grid.client',
        '~/core/app/plugins/route-tabs.client',
        '~/core/plugins/global-css-no-inline.client',
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
        preset: 'static',
        scanDirs: ['core/server'],
    },
});
