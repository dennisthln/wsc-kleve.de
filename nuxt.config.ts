// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  future: {
    compatibilityVersion: 4,
  },
  build: {
    transpile: ['lucide-vue-next']
  },
  runtimeConfig: {
    apiBaseInternal: process.env.NUXT_API_BASE_INTERNAL,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://wsc-kleve.kleverweb.de/api')
    }
  }
})
