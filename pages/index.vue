<script setup lang="ts">
const { data } = useAsyncData(
  'all-articles',
  () => queryContent('/')
    .only(['_id', '_path', 'date_published', 'title'])
    .find()
)
</script>

<template>
  <div>
    <h2>the latest articles</h2>
    <ul>
      <li v-for="article in data" :key="article._id">
        <strong>[ {{ article.date_published.substring(0, 10) }} ]</strong>
        <span>
          <NuxtLink :to="article._path">
            {{ article.title }}
          </NuxtLink>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style-type: '-';
}

li > strong, li > span {
  margin-left: 0.6rem;
}
</style>
