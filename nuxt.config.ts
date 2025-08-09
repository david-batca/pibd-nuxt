import { ro } from "vuetify/locale";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module"],
  vuetify: {
    vuetifyOptions: {
      locale: {
        locale: "ro",
        messages: { ro },
      },
      theme: {
        defaultTheme: "dark",
      },
    },
  },
  runtimeConfig: {
    databaseUrl: import.meta.env.DATABASE_URL,
  },
});
