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

// Inject initial colours into SSR so first paint uses custom colours
useHead(() => ({
  htmlAttrs: {
    style: `--text-color: ${textColor.value || '#000000'}; --background-color: ${backgroundColor.value || '#ffffff'};`,
  },
}))

const appStyles = computed(() => {
  return {
    '--max-width': maxWidth.value || '1800px',
  }
})

// Track if this is the initial page load
const isInitialLoad = ref(true)
const route = useRoute()
let previousPath = route.path

// Apply color transitions on navigation (but not on initial load)
const updateColors = (withTransition = true) => {
  if (process.client) {
    const html = document.documentElement
    const body = document.body
    const app = document.getElementById('app')
    
    // Temporarily disable transitions for instant initial load
    if (!withTransition) {
      html.style.setProperty('transition', 'none', 'important')
      if (body) body.style.setProperty('transition', 'none', 'important')
      if (app) app.style.setProperty('transition', 'none', 'important')
    }
    
    html.style.setProperty('--text-color', textColor.value || '#000000')
    html.style.setProperty('--background-color', backgroundColor.value || '#ffffff')
    
    // Re-enable transitions after colors are set if we disabled them
    if (!withTransition) {
      // Use requestAnimationFrame to ensure colors are painted before re-enabling transitions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          html.style.removeProperty('transition')
          if (body) body.style.removeProperty('transition')
          if (app) app.style.removeProperty('transition')
        })
      })
    }
  }
}

// Set initial colors instantly when component mounts
onMounted(() => {
  // Only update if colors differ from what's already set via useHead
  const html = document.documentElement
  const currentTextColor = getComputedStyle(html).getPropertyValue('--text-color').trim()
  const currentBgColor = getComputedStyle(html).getPropertyValue('--background-color').trim()
  
  // Only update if colors have changed (avoid unnecessary style changes)
  if (currentTextColor !== (textColor.value || '#000000') || 
      currentBgColor !== (backgroundColor.value || '#ffffff')) {
    updateColors(false)
  }
  
  isInitialLoad.value = false
  previousPath = route.path
})

// Watch for route changes to detect navigation (not initial load)
watch(() => route.path, (newPath) => {
  if (!isInitialLoad.value && newPath !== previousPath) {
    // On navigation, allow transitions
    updateColors(true)
  }
  previousPath = newPath
})

// Watch color values - only transition if not initial load and route changed
watch([textColor, backgroundColor], () => {
  if (process.client) {
    if (!isInitialLoad.value) {
      updateColors(true)
    } else {
      // On initial load, set colors instantly
      updateColors(false)
    }
  }
}, { immediate: false })

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

