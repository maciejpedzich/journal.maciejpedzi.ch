import { defineNuxtConfig } from 'nuxt';
import eslintPlugin from 'vite-plugin-eslint';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['~~/assets/styles.css'],
  modules: ['@nuxt/content'],
  content: {
    highlight: {
      theme: 'nord'
    }
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml']
    }
  },
  vite: {
    plugins: [eslintPlugin()]
  }
});
