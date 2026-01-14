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
        <div class="portfolio-item-image-container">
          <div class="portfolio-item-image-wrapper">
            <NuxtImg
              v-if="project.featuredImage?.asset"
              :src="project.featuredImage.asset.url || ''"
              :alt="project.title"
              class="portfolio-item-image"
            />
          </div>
          <h3 class="portfolio-item-title">{{ project.title }}</h3>
        </div>
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
  .portfolio-item-title {
    opacity:0;
  }
  .portfolio-item-link:hover .portfolio-item-title {
    opacity:1;
  }
}

.portfolio-item-image-container {
  aspect-ratio: var(--aspect-ratio-landscape);
  position: relative;
}

.portfolio-item-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.portfolio-item-image-wrapper {
  top: 0;
  left: 0;
  display: block;
  position: relative;
}

.format-portrait .portfolio-item-image-wrapper {
  aspect-ratio: var(--aspect-ratio-portrait);
  object-fit: contain;
}

.format-landscape .portfolio-item-image-wrapper {
  aspect-ratio: var(--aspect-ratio-landscape);
  object-fit: contain;
}

.format-square .portfolio-item-image-wrapper {
  aspect-ratio: var(--aspect-ratio-square);
  object-fit: contain;
}
.portfolio-item-image-wrapper img {
  width: 100%;
  position: absolute;
  height: 100%;
  object-fit: cover;
  object-position: center;
}


.format-square .portfolio-item-image-wrapper {
  max-width: 74%;
}

.format-portrait .portfolio-item-image-wrapper {
    height: 100%;
    width: auto;
    position: relative;
    max-width: unset;
  }


.portfolio-item-title {
  margin-top: calc(var(--gutter) / 1.5);
  font-size: var(--font-size-body);
  font-weight: normal;
  transition:opacity 0.3s ease;
}


@media (min-width: 800px) {
  .portfolio-item-image-container {
    aspect-ratio: var(--aspect-ratio-square);
  }
}
</style>

