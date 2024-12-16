// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    vue: {
      customElement: true
    },
    vueJsx: {
      mergeProps: true
    }
  },
  webpack: {
    loaders: {
      vue: {
        hotReload: true,
      }
    }
  },  
  vue: {
    propsDestructure: true
  }
})
