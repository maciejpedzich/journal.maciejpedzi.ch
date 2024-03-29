import { defineNuxtConfig } from 'nuxt';
import eslintPlugin from 'vite-plugin-eslint';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['~~/assets/base.css'],
  modules: ['@nuxt/content', 'nuxt-social-tags'],
  content: {
    highlight: {
      theme: 'material-darker'
    }
  },
  socialtags: {
    enabled: true,
    opengraph: true,
    twitter: true,
    locale: 'en-GB',
    img: 'https://journal.maciejpedzi.ch/images/banner.png',
    theme_color: '#485870',
    twitter_user: '@MaciejPedzich',
    twitter_card: 'summary_large_image'
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
