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
        
        <!-- Link Block -->
        <div v-else-if="block._type === 'infoLinkBlock'" class="info-link-block">
          <h2 v-if="block.title" class="info-block-title">{{ block.title }}</h2>
          <a
            v-if="block.link"
            :href="block.link"
            :target="shouldOpenInNewTab(block.link, block.openInNewTab) ? '_blank' : undefined"
            :rel="shouldOpenInNewTab(block.link, block.openInNewTab) ? 'noopener' : undefined"
            class="info-link"
          >
            {{ block.linkTitle || block.link }}
          </a>
        </div>
        
        <!-- Spacer Block -->
        <div v-else-if="block._type === 'infoSpacerBlock'" class="info-spacer-block"></div>
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
  max-width: 800px;
  margin: 0 auto;
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
  gap: var(--gutter-4x);
}

.info-block {
  display: flex;
  flex-direction: column;
}

.info-block-title {
  font-size: var(--font-size-large);
  font-weight: normal;
  margin-bottom: var(--gutter);
}

.info-link {
  color: inherit;
  text-decoration: underline;
}

.info-spacer-block {
  padding-bottom: var(--gutter-4x);
}
</style>

