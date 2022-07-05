<script setup lang="ts">
useHead({
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
});
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
