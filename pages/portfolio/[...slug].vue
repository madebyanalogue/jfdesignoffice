<template>
  <div class="portfolio-detail">
    <div v-if="pending" class="portfolio-loading">
     
    </div>
    <div v-if="error" class="portfolio-error">
      <p>Error loading portfolio: {{ error.message }}</p>
    </div>
    <div v-else-if="project">
      <div v-if="project.heroImage?.asset" class="portfolio-hero">
        <div 
          class="portfolio-image-container"
          :style="getImageAspectRatio(project.heroImage.asset)"
        >
          <NuxtImg
            :src="project.heroImage.asset.url || ''"
            :alt="project.title"
            width="3200"
            :height="project.heroImage.asset.metadata?.dimensions?.height"
            class="portfolio-image"
            loading="eager"
            @load="onImageLoad"
          />
        </div>
      </div>
      
      <div class="portfolio-info underline-links portfolio-fade-in">
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
          class="portfolio-content-block portfolio-fade-in"
          :style="{ transitionDelay: `${(index + 1) * 0.1}s` }"
        >
        <div v-if="block._type === 'imageBlock' && block.image?.asset" class="portfolio-image-block">
          <div 
            class="portfolio-image-container"
            :style="getImageAspectRatio(block.image.asset)"
          >
            <NuxtImg
              :src="block.image.asset.url || ''"
              :alt="project.title"
              :width="block.image.asset.metadata?.dimensions?.width"
              :height="block.image.asset.metadata?.dimensions?.height"
              class="portfolio-image"
              @load="onImageLoad"
            />
          </div>
        </div>
        
        <div v-else-if="block._type === 'videoBlock' && block.video" class="portfolio-video-block">
          <div class="portfolio-image-container" style="aspect-ratio: 16 / 9;">
            <video
              :src="block.video.asset.url"
              controls
              class="portfolio-video"
              @loadeddata="onVideoLoad"
            />
          </div>
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
            <div 
              v-else-if="block.image1?.asset"
              class="portfolio-image-container"
              :style="getImageAspectRatio(block.image1.asset)"
            >
              <NuxtImg
                :src="block.image1.asset.url || ''"
                :alt="project.title"
                :width="block.image1.asset.metadata?.dimensions?.width"
                :height="block.image1.asset.metadata?.dimensions?.height"
                class="portfolio-image"
                @load="onImageLoad"
              />
            </div>
          </div>
          <div class="portfolio-two-column-image">
            <PortfolioGallery
              v-if="block.column2Type === 'gallery' && block.column2Images && block.column2Images.length > 0"
              :images="block.column2Images"
              :timing="block.column2Timing || 1000"
              :alt="project.title"
            />
            <div 
              v-else-if="block.image2?.asset"
              class="portfolio-image-container"
              :style="getImageAspectRatio(block.image2.asset)"
            >
              <NuxtImg
                :src="block.image2.asset.url || ''"
                :alt="project.title"
                :width="block.image2.asset.metadata?.dimensions?.width"
                :height="block.image2.asset.metadata?.dimensions?.height"
                class="portfolio-image"
                @load="onImageLoad"
              />
            </div>
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
            <div 
              v-else-if="block.leftImages && block.leftImages.length === 1 && block.leftImages[0]?.asset"
              class="portfolio-image-container"
              :style="getImageAspectRatio(block.leftImages[0].asset)"
            >
              <NuxtImg
                :src="block.leftImages[0].asset.url || ''"
                :alt="project.title"
                :width="block.leftImages[0].asset.metadata?.dimensions?.width"
                :height="block.leftImages[0].asset.metadata?.dimensions?.height"
                class="portfolio-image"
                @load="onImageLoad"
              />
            </div>
          </div>
          <div class="portfolio-two-column-gallery-column">
            <PortfolioGallery
              v-if="block.rightImages && block.rightImages.length > 1"
              :images="block.rightImages"
              :timing="block.rightTiming || 1000"
              :alt="project.title"
            />
            <div 
              v-else-if="block.rightImages && block.rightImages.length === 1 && block.rightImages[0]?.asset"
              class="portfolio-image-container"
              :style="getImageAspectRatio(block.rightImages[0].asset)"
            >
              <NuxtImg
                :src="block.rightImages[0].asset.url || ''"
                :alt="project.title"
                :width="block.rightImages[0].asset.metadata?.dimensions?.width"
                :height="block.rightImages[0].asset.metadata?.dimensions?.height"
                class="portfolio-image"
                @load="onImageLoad"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div v-else class="portfolio-not-found">
      <p>Portfolio project not found</p>
    </div>
  </div>
</template>

<script setup>
import { injectPageLoading } from '~/composables/usePageLoading'

const route = useRoute()
const { setLoading } = injectPageLoading()

const slug = computed(() => {
  if (route.params.slug) {
    return Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  }
  return null
})

const { data: project, pending, error } = useAsyncData(
  () => `portfolio-${slug.value}`,
  async () => {
    if (!slug.value) return null
    
    const query = `*[_type == "portfolio" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      heroImage {
        asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
      },
      column1,
      column2,
      contentBlocks[] {
        _type,
        _key,
        image {
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              }
            }
          }
        },
        video {
          asset->
        },
        text,
        image1 {
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              }
            }
          }
        },
        image2 {
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              }
            }
          }
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
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              }
            }
          }
        },
        leftTiming,
        rightImages[] {
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              }
            }
          }
        },
        rightTiming
      }
    }`
    
    if (process.server) {
      const config = useRuntimeConfig()
      const projectId = config.public.sanity?.projectId || 'go8920y3'
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

// Update global loading state
watch(pending, (isPending) => {
  setLoading(isPending)
}, { immediate: true })

// Calculate aspect ratio for any image asset
const getImageAspectRatio = (asset) => {
  if (asset?.metadata?.dimensions) {
    const { width, height, aspectRatio } = asset.metadata.dimensions
    if (aspectRatio) {
      return { aspectRatio: `${aspectRatio}` }
    } else if (width && height) {
      return { aspectRatio: `${width / height}` }
    }
  }
  // Fallback to a reasonable aspect ratio (4:3)
  return { aspectRatio: '4 / 3' }
}

// Handle image load to fade in
const onImageLoad = (event) => {
  if (process.client && event?.target) {
    event.target.classList.add('loaded')
  }
}

// Handle video loads
const onVideoLoad = (event) => {
  if (process.client && event?.target) {
    event.target.classList.add('loaded')
  }
}

// Check all images on mount for cached images
onMounted(() => {
  if (process.client) {
    nextTick(() => {
      // Check all portfolio images
      const images = document.querySelectorAll('.portfolio-image')
      images.forEach((img) => {
        if (img.complete && img.naturalHeight > 0) {
          img.classList.add('loaded')
        }
      })
      
      // Check all portfolio videos
      const videos = document.querySelectorAll('.portfolio-video')
      videos.forEach((video) => {
        if (video.readyState >= 2) {
          video.classList.add('loaded')
        }
      })
    })
  }
})
</script>

<style scoped>
.portfolio-detail {
  padding: var(--gutter) 0;
}

.portfolio-hero {
  margin-bottom: var(--gutter);
  padding: 0px var(--gutter);
}

.portfolio-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--gutter);
  padding: 0px var(--gutter);
  margin-bottom: var(--gutter);
  padding-bottom: calc(var(--gutter) * 3);
}

.portfolio-fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease-in forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

.portfolio-image-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--background-color, #ffffff);
}

.portfolio-image,
.portfolio-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.4s ease-in;
  position: absolute;
  top: 0;
  left: 0;
}

.portfolio-image.loaded,
.portfolio-video.loaded {
  opacity: 1;
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

