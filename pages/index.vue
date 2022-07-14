<script setup lang="ts">
const { updateSocialTags } = useSocialTags();

const defaultMeta = {
  title: "Mac's Journal",
  description: "Maciej Pędzich's blog about all things Nuxt and Vue"
};

useHead(defaultMeta);
updateSocialTags(defaultMeta);

const { data } = useAsyncData('all-articles', () =>
  queryContent('/').only(['_id', '_path', 'date', 'title']).find()
);
</script>

<template>
  <div>
    <h2>the latest articles</h2>
    <ul>
      <li v-for="article in data" :key="article._id">
        <strong>[ {{ article.date.substring(0, 10) }} ]</strong>
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

li > strong,
li > span {
  margin-left: 0.6rem;
}
</style>
