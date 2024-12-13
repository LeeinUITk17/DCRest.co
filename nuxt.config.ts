// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  app: {
    head: {
      title: 'Drunken Clam',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
        },
        { rel: 'icon', type: 'image/x-icon', href: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1731220914/d5gjgrzdoft32wmaxlmy.png' }
      ]
    }
  },
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image-edge',
    '@nuxt/image',
    '@nuxt/icon',
  ],
  tailwindcss: {
    viewer: false
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      'vue-final-modal': '~/plugins/vue-final-modal',
    },
  },
  icon: {
    serverBundle: {
      collections: ['uil', 'mdi'] 
    }
  },
  image: {
    domains: ['example.com'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://api.example.com',
    }
  },
})