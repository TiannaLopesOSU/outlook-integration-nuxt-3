// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          defer: true,
          crossorigin: 'anonymous'
        }
      ]
    },
    baseURL: '/outlook-inte÷gration-nuxt-3/',
  },
  vite: {
    vue: {
      customElement: true,
    },
    vueJsx: {
      mergeProps: true,
    },
  },

  webpack: {
    loaders: {
      vue: {
        hotReload: true,
      },
    },
  },
  plugins: [{ src: "~/plugins/vcalendar.js", mode: "client" }, { src: '~/plugins/bootstrap.client.ts', mode: 'client' }],
  vue: {
    propsDestructure: true,
  },
});
