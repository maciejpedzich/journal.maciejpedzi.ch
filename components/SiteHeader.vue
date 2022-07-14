<template>
  <header>
    <h1 id="title" class="cmr2-text">
      <span>mac's</span>
      <span>journal</span>
    </h1>
    <div id="nav" class="cmr2-text">
      <span><NuxtLink to="/">home</NuxtLink></span>
      <span><NuxtLink to="/about">about</NuxtLink></span>
      <span>
        <NuxtLink to="/rss.xml" target="_blank">rss feed</NuxtLink>
      </span>
      <span>
        <NuxtLink to="https://maciejpedzi.ch" target="_blank"
          >maciejpedzi.ch</NuxtLink
        >
      </span>
      <span>
        <NuxtLink to="https://hashnode.maciejpedzi.ch" target="_blank"
          >hashnode</NuxtLink
        >
      </span>
      <span>
        <NuxtLink to="https://github.com/maciejpedzich" target="_blank"
          >github</NuxtLink
        >
      </span>
      <span>
        <NuxtLink to="https://twitter.com/MaciejPedzich" target="_blank"
          >twitter</NuxtLink
        >
      </span>
      <span>
        <NuxtLink to="mailto:contact@maciejpedzi.ch" target="_blank"
          >email me</NuxtLink
        >
      </span>
    </div>
  </header>
</template>

<style scoped>
header,
#nav {
  width: 100%;
}

header {
  margin-bottom: 2rem;
}

#title.cmr2-text > span {
  border-left-width: 0.1rem;
}

#nav {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  overflow-x: auto;
}

@media only screen and (max-width: 625px) {
  #nav {
    justify-content: left;
  }
}

#nav.cmr2-text > span {
  color: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.4);
  flex: 0 0 auto;
}

#nav.cmr2-text a {
  text-decoration: none;
}

#nav.cmr2-text > span:first-of-type {
  border-left: none;
}
</style>
