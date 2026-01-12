<template>
  <div class="portfolio-archive">
    <div
      v-for="project in projects"
      :key="project._id"
      class="portfolio-item"
      :class="`format-${project.archiveFormat}`"
    >
      <NuxtLink
        :to="`/portfolio/${project.slug.current}`"
        class="portfolio-item-link"
      >
        <NuxtImg
          v-if="project.featuredImage?.asset"
          :src="project.featuredImage.asset.url || ''"
          :alt="project.title"
          class="portfolio-item-image"
        />
        <h2 class="portfolio-item-title">{{ project.title }}</h2>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>

const { data: projects } = useAsyncData('portfolio', async () => {
  const query = `*[_type == "portfolio"] | order(orderRank) {
    _id,
    title,
    slug,
    featuredImage {
      asset->
    },
    archiveFormat
  }`
  
  if (process.server) {
    const config = useRuntimeConfig()
    const projectId = config.public.sanity?.projectId || 'kpljrloc'
    const dataset = config.public.sanity?.dataset || 'production'
    
    return await $fetch(`https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }).then(result => result?.result || []).catch(() => [])
  }
  return await $fetch('/api/sanity/query', {
    method: 'POST',
    body: { query },
  }).then(result => result?.result || []).catch(() => [])
})
</script>

<style scoped>
.portfolio-archive {
  display: grid;
  gap: var(--gutter);
  padding: var(--gutter);
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 800px) {
  .portfolio-archive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .portfolio-archive {
    grid-template-columns: repeat(3, 1fr);
  }
}


.portfolio-item-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.portfolio-item-image {
  width: 100%;
  height: auto;
  display: block;
}

.format-portrait .portfolio-item-image {
  aspect-ratio: var(--aspect-ratio-portrait);
  object-fit: cover;
}

.format-landscape .portfolio-item-image {
  aspect-ratio: var(--aspect-ratio-landscape);
  object-fit: cover;
}

.format-square .portfolio-item-image {
  aspect-ratio: var(--aspect-ratio-square);
  object-fit: cover;
}

.portfolio-item-title {
  margin-top: calc(var(--gutter) / 2);
  font-size: var(--font-size-body);
  font-weight: normal;
}
</style>

