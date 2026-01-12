<template>
  <div id="app" :style="appStyles">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup>
import { useSiteSettings } from '~/composables/useSiteSettings'
import { usePageSettings } from '~/composables/usePageSettings'

const { maxWidth, seoTitle, seoDescription, facebookShareImage } = useSiteSettings()
const { textColor, backgroundColor } = usePageSettings()

const appStyles = computed(() => {
  return {
    '--max-width': maxWidth.value || '1800px',
  }
})

// Apply color transitions by updating CSS variables on html element
const updateColors = () => {
  if (process.client) {
    const html = document.documentElement
    html.style.setProperty('--text-color', textColor.value || '#000000')
    html.style.setProperty('--background-color', backgroundColor.value || '#ffffff')
  }
}

// Watch for color changes to trigger transitions
watch([textColor, backgroundColor], () => {
  updateColors()
}, { immediate: true })

useHead({
  title: seoTitle.value || 'JF Design Office',
  meta: [
    {
      name: 'description',
      content: seoDescription.value || '',
    },
    // Open Graph / Facebook
    {
      property: 'og:title',
      content: seoTitle.value || 'JF Design Office',
    },
    {
      property: 'og:description',
      content: seoDescription.value || '',
    },
    {
      property: 'og:image',
      content: facebookShareImage.value || '',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: seoTitle.value || 'JF Design Office',
    },
    {
      name: 'twitter:description',
      content: seoDescription.value || '',
    },
    {
      name: 'twitter:image',
      content: facebookShareImage.value || '',
    },
  ],
})
</script>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.6s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

