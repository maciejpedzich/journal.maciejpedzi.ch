<script setup lang="ts">
const dateFrags = (doc) =>
  new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
    .formatToParts(new Date(doc.date))
    .filter(({ type }) => type !== 'literal')
    .map((frag) => {
      frag.value = frag.value.toLowerCase();
      return frag;
    });
</script>

<template>
  <article>
    <ContentDoc>
      <template #default="{ doc }">
        <h1>{{ doc.title }}</h1>
        <p id="date-published" class="cmr2-text">
          <span v-for="{ type, value } of dateFrags(doc)" :key="type">
            {{ value }}
          </span>
        </p>
        <ContentRenderer :value="doc" />
      </template>
      <template #not-found>
        <p>This page doesn't exist!</p>
      </template>
    </ContentDoc>
  </article>
</template>

<style scoped>
#date-published {
  margin-top: 0;
}
</style>
