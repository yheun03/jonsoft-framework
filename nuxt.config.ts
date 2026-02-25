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
          additionalData: '@use "~/assets/scss/_variables.scss" as *;',
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000/api',
    },
  },
})
