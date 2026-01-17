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

const { 
  maxWidth, 
  seoTitle, 
  seoDescription, 
  facebookShareImage,
  mobileBreakpoint,
  gutterMobile,
  gutterDesktop,
  fontSizeBodyMobile,
  fontSizeLargeMobile,
  fontSizeLogoMobile,
  fontSizeBodyDesktop,
  fontSizeLargeDesktop,
  fontSizeLogoDesktop,
  lineHeight,
  headerType,
} = useSiteSettings()
const { textColor, backgroundColor } = usePageSettings()

// Inject initial colours, header height, and typography variables into SSR so first paint uses custom values
useHead(() => ({
  htmlAttrs: {
    class: headerType.value === 'static' ? 'header-static' : '',
    style: `
      --text-color: ${textColor.value || '#000000'}; 
      --background-color: ${backgroundColor.value || '#ffffff'}; 
      --header-height: 0px;
      --mobile-breakpoint: ${mobileBreakpoint.value};
      --gutter-mobile: ${gutterMobile.value};
      --gutter-desktop: ${gutterDesktop.value};
      --font-size-body-mobile: ${fontSizeBodyMobile.value};
      --font-size-large-mobile: ${fontSizeLargeMobile.value};
      --font-size-logo-mobile: ${fontSizeLogoMobile.value};
      --font-size-body-desktop: ${fontSizeBodyDesktop.value};
      --font-size-large-desktop: ${fontSizeLargeDesktop.value};
      --font-size-logo-desktop: ${fontSizeLogoDesktop.value};
      --line-height: ${lineHeight.value};
    `,
  },
}))

const appStyles = computed(() => {
  return {
    '--max-width': maxWidth.value || '1800px',
    '--mobile-breakpoint': `${mobileBreakpoint.value}`,
    '--gutter-mobile': `${gutterMobile.value}`,
    '--gutter-desktop': `${gutterDesktop.value}`,
    '--font-size-body-mobile': `${fontSizeBodyMobile.value}`,
    '--font-size-large-mobile': `${fontSizeLargeMobile.value}`,
    '--font-size-logo-mobile': `${fontSizeLogoMobile.value}`,
    '--font-size-body-desktop': `${fontSizeBodyDesktop.value}`,
    '--font-size-large-desktop': `${fontSizeLargeDesktop.value}`,
    '--font-size-logo-desktop': `${fontSizeLogoDesktop.value}`,
    '--line-height': `${lineHeight.value}`,
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

// Update typography CSS variables
const updateTypography = () => {
  if (process.client) {
    const html = document.documentElement
    html.style.setProperty('--mobile-breakpoint', `${mobileBreakpoint.value}`)
    html.style.setProperty('--gutter-mobile', `${gutterMobile.value}`)
    html.style.setProperty('--gutter-desktop', `${gutterDesktop.value}`)
    html.style.setProperty('--font-size-body-mobile', `${fontSizeBodyMobile.value}`)
    html.style.setProperty('--font-size-large-mobile', `${fontSizeLargeMobile.value}`)
    html.style.setProperty('--font-size-logo-mobile', `${fontSizeLogoMobile.value}`)
    html.style.setProperty('--font-size-body-desktop', `${fontSizeBodyDesktop.value}`)
    html.style.setProperty('--font-size-large-desktop', `${fontSizeLargeDesktop.value}`)
    html.style.setProperty('--font-size-logo-desktop', `${fontSizeLogoDesktop.value}`)
    html.style.setProperty('--line-height', `${lineHeight.value}`)
  }
}

// Update header height CSS variable (responsive)
const updateHeaderHeight = () => {
  if (process.client) {
    const header = document.querySelector('.header')
    if (header) {
      const height = header.offsetHeight
      // Set on html element for global access
      // Always calculate, but CSS class controls whether it's used
      document.documentElement.style.setProperty('--header-height', `${height}px`)
    }
  }
}

// Set initial colors instantly when component mounts
onMounted(async () => {
  // Only update if colors differ from what's already set via useHead
  const html = document.documentElement
  const currentTextColor = getComputedStyle(html).getPropertyValue('--text-color').trim()
  const currentBgColor = getComputedStyle(html).getPropertyValue('--background-color').trim()
  
  // Only update if colors have changed (avoid unnecessary style changes)
  if (currentTextColor !== (textColor.value || '#000000') || 
      currentBgColor !== (backgroundColor.value || '#ffffff')) {
    updateColors(false)
  }
  
  // Set initial header height (use nextTick to ensure header is rendered)
  await nextTick()
  updateHeaderHeight()
  
  // Update typography variables
  updateTypography()
  
  // Update header type class on html element
  const updateHeaderTypeClass = () => {
    if (process.client) {
      const html = document.documentElement
      if (headerType.value === 'static') {
        html.classList.add('header-static')
      } else {
        html.classList.remove('header-static')
      }
    }
  }
  updateHeaderTypeClass()
  
  // Update header height on resize using ResizeObserver for efficiency
  const resizeObserver = new ResizeObserver(() => {
    updateHeaderHeight()
  })
  
  const header = document.querySelector('.header')
  if (header) {
    resizeObserver.observe(header)
  }
  
  // Also listen to window resize as fallback
  const handleResize = () => {
    updateHeaderHeight()
  }
  window.addEventListener('resize', handleResize, { passive: true })
  
  // Cleanup
  onUnmounted(() => {
    resizeObserver.disconnect()
    window.removeEventListener('resize', handleResize)
  })
  
  isInitialLoad.value = false
  previousPath = route.path
})

// Watch for route changes to detect navigation (not initial load)
watch(() => route.path, (newPath) => {
  if (!isInitialLoad.value && newPath !== previousPath) {
    // On navigation, allow transitions
    updateColors(true)
    // Update header height in case it changed
    updateHeaderHeight()
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

// Watch typography values and update CSS variables
watch([
  mobileBreakpoint,
  gutterMobile,
  gutterDesktop,
  fontSizeBodyMobile,
  fontSizeLargeMobile,
  fontSizeLogoMobile,
  fontSizeBodyDesktop,
  fontSizeLargeDesktop,
  fontSizeLogoDesktop,
  lineHeight,
], () => {
  if (process.client) {
    updateTypography()
  }
}, { immediate: false })

// Watch header type and update class
watch(headerType, () => {
  if (process.client) {
    const html = document.documentElement
    if (headerType.value === 'static') {
      html.classList.add('header-static')
    } else {
      html.classList.remove('header-static')
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

