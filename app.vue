<script setup lang="ts">
const { updateSocialTags } = useSocialTags();

const defaultMeta = {
  title: "Mac's Journal",
  description: "Maciej Pędzich's blog about all things Nuxt and Vue"
};

useHead({
  ...defaultMeta,
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
});
updateSocialTags(defaultMeta);
</script>

<template>
  <div id="container">
    <SiteHeader />
    <main>
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>
