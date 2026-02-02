<template>
  <div v-if="project" class="portfolio-detail">
    <div v-if="project.heroImage?.asset" class="portfolio-hero">
      <NuxtImg
        :src="project.heroImage.asset.url || ''"
        :alt="project.title"
        class="portfolio-hero-image"
      />
    </div>
    
    <div class="portfolio-info underline-links">
      <div class="portfolio-info-column">
        <h1 class="portfolio-title">{{ project.title }}</h1>
      </div>
      <div class="portfolio-info-column">
        <SanityBlocks v-if="project.column1" :blocks="project.column1" />
      </div>
      <div class="portfolio-info-column">
        <SanityBlocks v-if="project.column2" :blocks="project.column2" />
      </div>
    </div>
    
    <div class="portfolio-content">
      <div
        v-for="(block, index) in project.contentBlocks"
        :key="block._key || index"
        class="portfolio-content-block"
      >
        <div v-if="block._type === 'imageBlock' && block.image?.asset" class="portfolio-image-block">
          <NuxtImg
            :src="block.image.asset.url || ''"
            :alt="project.title"
            class="portfolio-image"
          />
        </div>
        
        <div v-else-if="block._type === 'videoBlock' && block.video" class="portfolio-video-block">
          <video
            :src="block.video.asset.url"
            controls
            class="portfolio-video"
          />
        </div>
        
        <div v-else-if="block._type === 'textBlock' && block.text" class="portfolio-text-block underline-links">
          <SanityBlocks :blocks="block.text" />
        </div>
        
        <div v-else-if="block._type === 'galleryBlock' && block.images && block.images.length > 0" class="portfolio-gallery-block">
          <PortfolioGallery
            :images="block.images"
            :timing="block.timing || 1000"
            :alt="project.title"
          />
        </div>
        
        <div v-else-if="block._type === 'twoColumnBlock'" class="portfolio-two-column-block">
          <div class="portfolio-two-column-image">
            <PortfolioGallery
              v-if="block.column1Type === 'gallery' && block.column1Images && block.column1Images.length > 0"
              :images="block.column1Images"
              :timing="block.column1Timing || 1000"
              :alt="project.title"
            />
            <NuxtImg
              v-else-if="block.image1?.asset"
              :src="block.image1.asset.url || ''"
              :alt="project.title"
              class="portfolio-image"
            />
          </div>
          <div class="portfolio-two-column-image">
            <PortfolioGallery
              v-if="block.column2Type === 'gallery' && block.column2Images && block.column2Images.length > 0"
              :images="block.column2Images"
              :timing="block.column2Timing || 1000"
              :alt="project.title"
            />
            <NuxtImg
              v-else-if="block.image2?.asset"
              :src="block.image2.asset.url || ''"
              :alt="project.title"
              class="portfolio-image"
            />
          </div>
        </div>
        
        <div v-else-if="block._type === 'twoColumnGalleryBlock'" class="portfolio-two-column-gallery-block">
          <div class="portfolio-two-column-gallery-column">
            <PortfolioGallery
              v-if="block.leftImages && block.leftImages.length > 1"
              :images="block.leftImages"
              :timing="block.leftTiming || 1000"
              :alt="project.title"
            />
            <NuxtImg
              v-else-if="block.leftImages && block.leftImages.length === 1 && block.leftImages[0]?.asset"
              :src="block.leftImages[0].asset.url || ''"
              :alt="project.title"
              class="portfolio-image"
            />
          </div>
          <div class="portfolio-two-column-gallery-column">
            <PortfolioGallery
              v-if="block.rightImages && block.rightImages.length > 1"
              :images="block.rightImages"
              :timing="block.rightTiming || 1000"
              :alt="project.title"
            />
            <NuxtImg
              v-else-if="block.rightImages && block.rightImages.length === 1 && block.rightImages[0]?.asset"
              :src="block.rightImages[0].asset.url || ''"
              :alt="project.title"
              class="portfolio-image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const slug = computed(() => {
  if (route.params.slug) {
    return Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  }
  return null
})

const { data: project } = useAsyncData(
  () => `portfolio-${slug.value}`,
  async () => {
    if (!slug.value) return null
    
    const query = `*[_type == "portfolio" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      heroImage {
        asset->
      },
      column1,
      column2,
      contentBlocks[] {
        _type,
        _key,
        image {
          asset->
        },
        video {
          asset->
        },
        text,
        image1 {
          asset->
        },
        image2 {
          asset->
        },
        column1Type,
        column1Images[] {
          asset->
        },
        column1Timing,
        column2Type,
        column2Images[] {
          asset->
        },
        column2Timing,
        timing,
        images[] {
          asset->
        },
        leftImages[] {
          asset->
        },
        leftTiming,
        rightImages[] {
          asset->
        },
        rightTiming
      }
    }`
    
    if (process.server) {
      const config = useRuntimeConfig()
      const projectId = config.public.sanity?.projectId || 'kpljrloc'
      const dataset = config.public.sanity?.dataset || 'production'
      
      return await $fetch(`https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, params: { slug: slug.value } }),
      }).then(result => result?.result || null).catch(() => null)
    }
    return await $fetch('/api/sanity/query', {
      method: 'POST',
      body: { query, params: { slug: slug.value } },
    }).then(result => result?.result || null).catch(() => null)
  },
  { watch: [slug] }
)
</script>

<style scoped>
.portfolio-detail {
  padding: var(--gutter) 0;
}

.portfolio-hero {
  margin-bottom: var(--gutter);
  padding: 0px var(--gutter);
}

.portfolio-hero-image {
  width: 100%;
  height: auto;
  display: block;
}

.portfolio-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--gutter);
  padding: 0px var(--gutter);
  margin-bottom: var(--gutter);
  padding-bottom: calc(var(--gutter) * 3);

}

.portfolio-content {
  display: flex;
  flex-direction: column;
  gap: var(--gutter);
  padding: 0px var(--gutter);
}

.portfolio-text-block {
  padding-bottom: calc(var(--gutter) * 4);
}

.portfolio-image,
.portfolio-video {
  width: 100%;
  height: auto;
  display: block;
}

.portfolio-gallery-block {
  width: 100%;
}

.portfolio-two-column-block,
.portfolio-two-column-gallery-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gutter);
}

.portfolio-two-column-gallery-column {
  width: 100%;
}

@media (max-width: 800px) {
  .portfolio-info {
    grid-template-columns: 1fr;
  }
  
  .portfolio-two-column-block,
  .portfolio-two-column-gallery-block {
    grid-template-columns: 1fr;
  }
}
</style>

