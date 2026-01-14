<template>
  <div class="info-section">
    <div v-if="section.infoImage?.asset" class="info-section-image">
      <NuxtImg
        :src="section.infoImage.asset.url || ''"
        alt=""
        class="info-image"
      />
    </div>
    
    <div class="info-section-content">
      <div
        v-for="(block, index) in section.infoContent"
        :key="block._key || index"
        class="info-block"
      >
        <!-- Text Block -->
        <div v-if="block._type === 'infoTextBlock'" class="info-text-block">
          <h2 v-if="block.title" class="info-block-title">{{ block.title }}</h2>
          <SanityBlocks v-if="block.text" :blocks="block.text" />
        </div>
        
        <!-- Links Block -->
        <div v-else-if="block._type === 'infoLinksBlock'" class="info-links-block">
          <h2 v-if="block.title" class="info-block-title">{{ block.title }}</h2>
          <SanityBlocks v-if="block.text" :blocks="block.text" />
          <div v-if="block.links && block.links.length > 0" class="info-links-list">
            <div
              v-for="(linkItem, linkIndex) in block.links"
              :key="linkIndex"
              class="info-link-item"
            >
              <span v-if="linkItem.subtitle" class="info-link-subtitle">{{ linkItem.subtitle }}</span>
              <a
                :href="linkItem.link"
                :target="shouldOpenInNewTab(linkItem.link, linkItem.openInNewTab) ? '_blank' : undefined"
                :rel="shouldOpenInNewTab(linkItem.link, linkItem.openInNewTab) ? 'noopener' : undefined"
                class="info-link"
              >
                <span class="info-link-title">{{ linkItem.linkTitle || linkItem.link }} <span class="info-link-arrow">↗</span></span>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Services Block -->
        <div v-else-if="block._type === 'infoServicesBlock'" class="info-services-block">
          <h2 v-if="block.title" class="info-block-title">{{ block.title }}</h2>
          <div class="info-services-content">
            <SanityBlocks :blocks="block.content" />
          </div>
        </div>
        
        <!-- Press & Awards Block -->
        <div v-else-if="block._type === 'infoPressAwardsBlock'" class="info-press-awards-block">
          <h2 v-if="block.title" class="info-block-title">{{ block.title }}</h2>
          <div v-if="pressAwards && pressAwards.length > 0" class="info-press-awards-list">
            <div
              v-for="(item, index) in pressAwards"
              :key="item._id || index"
              class="info-press-award-item"
            >
              <h3 v-if="item.title" class="info-press-award-title">{{ item.title }}</h3>
              <p v-if="item.details" class="info-press-award-details">{{ item.details }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const { data: pressAwards } = useAsyncData('press-awards', async () => {
  const query = `*[_type == "pressAward"] | order(orderRank) {
    _id,
    title,
    details
  }`
  
  if (process.server) {
    const config = useRuntimeConfig()
    const projectId = config.public.sanity?.projectId || 'kpljrloc'
    const dataset = config.public.sanity?.dataset || 'production'
    
    try {
      const result = await $fetch(`https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      return result?.result || []
    } catch (err) {
      console.error('[PressAwards] Error fetching:', err)
      return []
    }
  }
  
  try {
    const result = await $fetch('/api/sanity/query', {
      method: 'POST',
      body: { query },
    })
    return result?.result || []
  } catch (err) {
    console.error('[PressAwards] Error fetching:', err)
    return []
  }
}, { server: true })

const shouldOpenInNewTab = (link, openInNewTab) => {
  if (!link) return false
  // Don't open mailto: or tel: in new tab
  if (link.startsWith('mailto:') || link.startsWith('tel:')) return false
  // If explicitly set to open in new tab, do it
  if (openInNewTab) return true
  // For external URLs (http/https), open in new tab
  if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('//')) return true
  return false
}
</script>

<style scoped>
.info-section {
  margin: 0 auto;
  display: grid;
  padding: 0px var(--gutter);
  gap: var(--gutter);
  grid-template-columns: 1fr;
}

@media all and (min-width:1000px) {
  .info-section {
    grid-template-columns: 2fr 1fr;
    grid-template-areas: "content image";
  }
}
.info-section-image {
  margin-bottom: var(--gutter);
}

.info-image {
  width: 100%;
  height: auto;
  display: block;
}

.info-section-content {
  display: flex;
  flex-direction: column;
  gap: calc(var(--gutter) * 3);
}

.info-block, .info-text-block {
  display: flex;
  flex-direction: column;
  gap: var(--gutter);
}
.info-block {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gutter);
}

@media all and (min-width:1000px) {
  .info-block {
    grid-template-columns: 1fr 1fr;
  } 
  .info-section-image {
    grid-area: image;
  }
}

.info-block-title {
  font-weight: normal;
}

.info-link-item {
  display: flex;
  flex-direction: column;
  gap: calc(var(--gutter) / 4);
}

.info-link {
  color: inherit;
}

.info-link-title {
  font-size: var(--font-size-large);
  position: relative;
  display: inline-block;
}

.info-link-title:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  background: currentColor;
}

.info-link:hover .info-link-title:after {
  transform: scaleX(1);
}

.info-link-subtitle {
  font-size: var(--font-size-body);
}

.info-links-block {
  display: flex;
  flex-direction: column;
  gap: var(--gutter);
}

.info-links-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--gutter) * 1);
}

.info-link-arrow:before {
  content: ' ';
}
.info-link-arrow {
  transform: scale(0);
  transform-origin: bottom left;
  transition: transform 0.3s ease;
  display: inline-block;
}
.info-link:hover .info-link-arrow {
  transform: scale(1);
}

.info-services-block {
  display: flex;
  flex-direction: column;
  gap: var(--gutter);
}

.info-services-content {
  font-size: var(--font-size-large);
}

.info-services-content :deep(.sanity-block) {
  white-space: pre-line;
}

.info-services-content :deep(p) {
  margin-bottom: 0;
}

.info-press-awards-block {
  display: flex;
  flex-direction: column;
  gap: var(--gutter);
}

.info-press-awards-list {
  display: grid;
  gap: var(--gutter);
}
@media (min-width:800px) {
  .info-press-awards-block {
    grid-column: span 2;
  }
  .info-press-awards-list {
    grid-template-columns: 1fr 1fr;
  }
}


.info-press-award-item {
  display: flex;
  flex-direction: column;
}

.info-press-award-title {
  font-weight: normal;
  margin-bottom: 0;
}

.info-press-award-details {
  margin: 0;
  white-space: pre-line;
}
</style>

