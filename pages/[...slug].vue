<template>
  <article>
    <ContentDoc>
      <template #default="{ doc }">
        <h1>{{ doc.title }}</h1>
        <p id="desc">
          <em>{{ doc.description }}</em>
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
#desc {
  text-align: center;
}
</style>
