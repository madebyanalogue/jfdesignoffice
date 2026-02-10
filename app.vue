<template>
  <ClientOnly>
    <Preloader 
      @preloader-complete="onPreloaderComplete" 
      @preloader-ready="onPreloaderReady" 
    />
  </ClientOnly>
  
  <div v-if="preloaderReady || disablePreloader" id="app" :style="appStyles">
    <Header />
    <main class="page-wrapper">
      <NuxtPage />
    </main>
    <Footer :class="{ 'footer-fade-out': isNavigating }" />
  </div>
</template>

<script setup>
import Preloader from '~/components/Preloader.vue'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { usePageSettings } from '~/composables/usePageSettings'
import { providePageLoading } from '~/composables/usePageLoading'

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
  disablePreloader,
} = useSiteSettings()
const { textColor, backgroundColor } = usePageSettings()

// Store displayed colors separately to control when they update during navigation
const displayedTextColor = ref(textColor.value || '#000000')
const displayedBackgroundColor = ref(backgroundColor.value || '#ffffff')

// Preloader state - hide content until preloader is ready
const preloaderReady = ref(false)

// Page loading state - track when pages are loading
const { isLoading: isPageLoading } = providePageLoading()

// Store header height to prevent useHead from resetting it
// Initialize from sessionStorage if available, otherwise default to 0px
const currentHeaderHeight = ref('0px')

// Initialize from sessionStorage on client side
if (process.client) {
  const stored = sessionStorage.getItem('header-height')
  if (stored) {
    currentHeaderHeight.value = stored
  }
}

// Preloader handlers
const onPreloaderReady = () => {
  // Preloader is ready to start, show content
  preloaderReady.value = true
  if (process.client) {
    document.body.classList.add('preloader-ready')
    // Update header height once header is rendered
    nextTick(() => {
      updateHeaderHeight()
    })
  }
}

const onPreloaderComplete = () => {
  // Preloader animation finished, site is ready
  if (process.client) {
    document.body.classList.add('preloader-complete')
    // Ensure header height is updated after preloader completes
    nextTick(() => {
      updateHeaderHeight()
    })
  }
}

// If preloader is disabled, show content immediately
watch(disablePreloader, (disabled) => {
  if (disabled) {
    preloaderReady.value = true
    if (process.client) {
      document.body.classList.add('preloader-ready')
      document.body.classList.add('preloader-complete')
    }
  }
}, { immediate: true })

// Inject initial colours, header height, and typography variables into SSR so first paint uses custom values
// Use displayed colors instead of direct page settings to control update timing
useHead(() => ({
  htmlAttrs: {
    lang: 'en',
    class: headerType.value === 'static' ? 'header-static' : '',
    style: `
      --text-color: ${displayedTextColor.value}; 
      --background-color: ${displayedBackgroundColor.value}; 
      --header-height: ${currentHeaderHeight.value};
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
// Track if we're currently navigating to prevent color watcher from interfering
const isNavigating = ref(false)
const route = useRoute()
let previousPath = route.path

// Store ResizeObserver for cleanup
let headerResizeObserver = null

// Apply color transitions on navigation (but not on initial load)
const updateColors = (withTransition = true) => {
  if (process.client) {
    // Update displayed colors (which useHead will pick up)
    displayedTextColor.value = textColor.value || '#000000'
    displayedBackgroundColor.value = backgroundColor.value || '#ffffff'
    
    const html = document.documentElement
    const body = document.body
    const app = document.getElementById('app')
    
    // Temporarily disable transitions for instant initial load
    if (!withTransition) {
      html.style.setProperty('transition', 'none', 'important')
      if (body) body.style.setProperty('transition', 'none', 'important')
      if (app) app.style.setProperty('transition', 'none', 'important')
    }
    
    // Update both CSS variables synchronously to ensure transitions start at the same time
    const updateBoth = () => {
      html.style.setProperty('--text-color', displayedTextColor.value)
      html.style.setProperty('--background-color', displayedBackgroundColor.value)
    }
    
    if (withTransition) {
      // For transitions, update immediately in the same frame
      updateBoth()
    } else {
      // For instant updates, update immediately
      updateBoth()
    }
    
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

// Update header height CSS variable (only on window resize or initial load)
const updateHeaderHeight = () => {
  if (process.client) {
    const header = document.querySelector('.header')
    if (header) {
      const height = header.offsetHeight
      const heightValue = `${height}px`
      // Only update if height actually changed
      if (currentHeaderHeight.value !== heightValue) {
        // Update the ref so useHead uses the correct value
        currentHeaderHeight.value = heightValue
        // Store in sessionStorage for persistence across navigations
        sessionStorage.setItem('header-height', heightValue)
        // Set on html element for global access
        document.documentElement.style.setProperty('--header-height', heightValue)
      }
      return true // Return true if header was found and height was set
    }
  }
  return false // Return false if header not found
}

// Set initial colors instantly when component mounts
onMounted(async () => {
  // Initialize displayed colors with current page settings
  displayedTextColor.value = textColor.value || '#000000'
  displayedBackgroundColor.value = backgroundColor.value || '#ffffff'
  
  // Only update if colors differ from what's already set via useHead
  const html = document.documentElement
  const currentTextColor = getComputedStyle(html).getPropertyValue('--text-color').trim()
  const currentBgColor = getComputedStyle(html).getPropertyValue('--background-color').trim()
  
  // Only update if colors have changed (avoid unnecessary style changes)
  if (currentTextColor !== displayedTextColor.value || 
      currentBgColor !== displayedBackgroundColor.value) {
    updateColors(false)
  }
  
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
  
  // Set up header height - only update on window resize
  const setupHeaderHeight = () => {
    const header = document.querySelector('.header')
    if (header) {
      // Set initial header height from stored value or calculate if not stored
      const storedHeight = sessionStorage.getItem('header-height')
      if (storedHeight) {
        currentHeaderHeight.value = storedHeight
        document.documentElement.style.setProperty('--header-height', storedHeight)
      } else {
        // Only calculate on initial load if not stored
        updateHeaderHeight()
      }
      
      // Update header height on window resize only
      const handleResize = () => {
        updateHeaderHeight()
      }
      window.addEventListener('resize', handleResize, { passive: true })
      
      // Also use ResizeObserver on header for more precise resize detection
      headerResizeObserver = new ResizeObserver(() => {
        updateHeaderHeight()
      })
      headerResizeObserver.observe(header)
      
      return true
    }
    return false
  }
  
  // Try to set up header height management immediately, or wait for preloader if needed
  if (preloaderReady.value || disablePreloader.value) {
    // Header should be rendered, set up
    await nextTick()
    setupHeaderHeight()
  } else {
    // If header wasn't found, watch for preloaderReady and set up then
    const unwatch = watch(preloaderReady, (ready) => {
      if (ready) {
        nextTick(() => {
          if (setupHeaderHeight()) {
            unwatch() // Stop watching once set up
          }
        })
      }
    }, { immediate: true })
  }
  
  // Cleanup
  onUnmounted(() => {
    if (headerResizeObserver) {
      headerResizeObserver.disconnect()
      headerResizeObserver = null
    }
  })
  
  isInitialLoad.value = false
  previousPath = route.path
})

// Watch for route changes to detect navigation (not initial load)
watch(() => route.path, (newPath) => {
  if (!isInitialLoad.value && newPath !== previousPath) {
    // Mark that we're navigating to prevent color watcher from interfering
    isNavigating.value = true
    
    // Disable color transitions during page fade-out
    const html = document.documentElement
    const body = document.body
    const app = document.getElementById('app')
    
    if (html && body && app) {
      // Disable transitions immediately to prevent any color changes during fade-out
      html.style.setProperty('transition', 'none', 'important')
      if (body) body.style.setProperty('transition', 'none', 'important')
      if (app) app.style.setProperty('transition', 'none', 'important')
      
      // Wait for page fade-out to complete (0.6s), then update displayed colors
      setTimeout(() => {
        // Update displayed colors AFTER fade-out completes
        // This ensures colors change when content is invisible
        displayedTextColor.value = textColor.value || '#000000'
        displayedBackgroundColor.value = backgroundColor.value || '#ffffff'
        
        // Also update CSS variables directly (transitions still disabled for instant change)
        html.style.setProperty('--text-color', displayedTextColor.value)
        html.style.setProperty('--background-color', displayedBackgroundColor.value)

        // After the old page has fully faded out, jump to the top of the new page
        // Use an instant scroll (no smooth transition), as requested
        if (process.client) {
          window.scrollTo(0, 0)
        }
        
        // Keep transitions disabled for a bit longer to ensure instant color change
        // Then re-enable transitions for future changes
        setTimeout(() => {
          requestAnimationFrame(() => {
            html.style.removeProperty('transition')
            if (body) body.style.removeProperty('transition')
            if (app) app.style.removeProperty('transition')
            // Navigation complete, allow color watcher to work again
            isNavigating.value = false
          })
        }, 50) // Small delay to ensure color change is instant
      }, 600) // Match page transition duration - update colors right after fade-out
    }
    
    // Header height is now only updated on window resize, not on navigation
    // The stored value from sessionStorage is used, preventing page jumps
  }
  previousPath = newPath
})

// Watch color values - only transition if not initial load and route changed
// Note: Route change handler above manages color updates during navigation
watch([textColor, backgroundColor], () => {
  if (process.client) {
    // Don't update colors if we're in the middle of a navigation
    if (isNavigating.value) {
      return
    }
    
    if (!isInitialLoad.value) {
      // Only update if route hasn't changed (handled by route watcher above)
      // This prevents double updates during navigation
      const currentPath = route.path
      // Small delay to check if route is still the same
      setTimeout(() => {
        if (route.path === currentPath && !isNavigating.value) {
          // Route didn't change, so this is a programmatic color change
          updateColors(true)
        }
      }, 50)
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

useHead(() => {
  const meta = []
  const siteTitle = seoTitle.value || 'JF Design Office'
  const siteUrl = process.client ? window.location.origin : 'https://www.jfdesignoffice.com'
  const currentUrl = process.client ? window.location.href : siteUrl
  
  // Meta description
  if (seoDescription.value) {
    meta.push({
      name: 'description',
      content: seoDescription.value,
    })
  }
  
  // Open Graph / Facebook
  meta.push(
    {
      property: 'og:title',
      content: siteTitle,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:site_name',
      content: siteTitle,
    },
    {
      property: 'og:url',
      content: currentUrl,
    }
  )
  
  if (seoDescription.value) {
    meta.push({
      property: 'og:description',
      content: seoDescription.value,
    })
  }
  
  // OG Image with dimensions
  if (facebookShareImage.value) {
    meta.push(
      {
        property: 'og:image',
        content: facebookShareImage.value,
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      }
    )
  }
  
  // Twitter Card
  meta.push(
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: siteTitle,
    }
  )
  
  if (seoDescription.value) {
    meta.push({
      name: 'twitter:description',
      content: seoDescription.value,
    })
  }
  
  if (facebookShareImage.value) {
    meta.push({
      name: 'twitter:image',
      content: facebookShareImage.value,
    })
  }
  
  return {
    title: siteTitle,
    meta,
  }
})
</script>

<style>
/* Hide content until preloader is ready */
body:not(.preloader-ready) #app {
  visibility: hidden;
  opacity: 0;
}

body.preloader-ready #app {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s ease-in;
}

/* Page wrapper to ensure stable DOM structure during transitions */
.page-wrapper {
  min-height: 1px; /* Ensure wrapper has height */
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.6s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Footer fades with page transition */
.footer-fade-out {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* Footer fade-in transition */
.fade-enter-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from {
  opacity: 0;
}

/* Footer hidden state - use opacity to prevent layout shifts */
.footer-hidden {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
</style>

