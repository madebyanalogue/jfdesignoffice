<template>
  <header :class="['header', 'border-bottom', 'pad-1', { 
    'header-static': headerType === 'static',
    'header-fixed': headerType === 'fixed',
    'header-sticky': headerType === 'responsive' && isPastHeader, 
    'header-hidden': headerType === 'responsive' && isScrollingDown, 
    'header-transition': headerType === 'responsive' && shouldAddTransition 
  }]">
    <nav class="header-nav header-nav-left underline-links">
      <NuxtLink
        v-for="item in leftMenuItems"
        :key="item._key || item.text"
        :to="getMenuItemUrl(item)"
        :target="isExternalUrl(item.link?.url) ? '_blank' : undefined"
        :rel="isExternalUrl(item.link?.url) ? 'noopener' : undefined"
        :class="['header-link', { 'header-link-active': isActive(item) }]"
      >
        <span class="header-link-text-desktop">{{ item.text }}</span>
        <span v-if="item.textMobile" class="header-link-text-mobile">{{ item.textMobile }}</span>
        <span v-else class="header-link-text-mobile">{{ item.text }}</span>
      </NuxtLink>
    </nav>
    
    <div class="header-logo">
      <NuxtLink to="/">
        <Logo />
      </NuxtLink>
    </div>
    
    <nav class="header-nav header-nav-right underline-links">
      <NuxtLink
        v-for="item in rightMenuItems"
        :key="item._key || item.text"
        :to="getMenuItemUrl(item)"
        :target="isExternalUrl(item.link?.url) ? '_blank' : undefined"
        :rel="isExternalUrl(item.link?.url) ? 'noopener' : undefined"
        :class="['header-link', { 'header-link-active': isActive(item) }]"
      >
        <span class="header-link-text-desktop">{{ item.text }}</span>
        <span v-if="item.textMobile" class="header-link-text-mobile">{{ item.textMobile }}</span>
        <span v-else class="header-link-text-mobile">{{ item.text }}</span>
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup>
import { useSiteSettings } from '~/composables/useSiteSettings'

const route = useRoute()
const { leftMenu, rightMenu, headerType } = useSiteSettings()

const leftMenuItems = computed(() => leftMenu.value?.items || [])
const rightMenuItems = computed(() => rightMenu.value?.items || [])

const isExternalUrl = (url) => {
  if (!url) return false
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return true
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return false
  return !url.startsWith('/') && !url.startsWith('#')
}

const getMenuItemUrl = (item) => {
  if (item.link?.type === 'page' && item.link?.page?.slug?.current) {
    return `/${item.link.page.slug.current}`
  }
  if (item.link?.url) {
    return item.link.url
  }
  return '#'
}

const isActive = (item) => {
  const itemUrl = getMenuItemUrl(item)
  if (!itemUrl || itemUrl === '#') return false
  if (isExternalUrl(itemUrl)) return false
  
  // Normalize paths for comparison
  const currentPath = route.path === '/' ? '/' : route.path.replace(/\/$/, '')
  const normalizedItemUrl = itemUrl === '/' ? '/' : itemUrl.replace(/\/$/, '')
  
  return currentPath === normalizedItemUrl
}

// Scroll detection for header hide/show
const isScrollingDown = ref(false)
const isPastHeader = ref(false)
const shouldAddTransition = ref(false)
const headerHeight = ref(0)
let lastScrollY = 0
let ticking = false

const handleScroll = () => {
  // Only run scroll logic for responsive header type
  if (!process.client || headerType.value !== 'responsive') {
    ticking = false
    return
  }
  
  const currentScrollY = window.scrollY
  
  // Only update if scroll position changed significantly (avoid jitter)
  if (Math.abs(currentScrollY - lastScrollY) < 5) {
    ticking = false
    return
  }
  
  const headerEl = document.querySelector('.header')
  if (!headerEl) {
    ticking = false
    return
  }
  
  // Get header height if not set
  if (headerHeight.value === 0) {
    headerHeight.value = headerEl.offsetHeight
  }
  
  // Check if we've scrolled past the full header height
  const hasScrolledPastHeader = currentScrollY >= headerHeight.value
  // Increased threshold for transition (e.g., 2x header height)
  const transitionThreshold = headerHeight.value * 2
  
  // At the very top - header goes back to relative
  if (currentScrollY <= 0) {
    isPastHeader.value = false
    shouldAddTransition.value = false
    isScrollingDown.value = false
  } 
  // Once we've scrolled past header, it becomes sticky and stays sticky
  else if (hasScrolledPastHeader || isPastHeader.value) {
    // Once past header, always stay sticky (even when scrolling back up into header zone)
    isPastHeader.value = true
    
    // Only add transition after scrolling past the increased threshold
    shouldAddTransition.value = currentScrollY >= transitionThreshold
    
    // Show header when scrolling up
    if (currentScrollY < lastScrollY) {
      isScrollingDown.value = false
    } 
    // Hide header when scrolling down
    else if (currentScrollY > lastScrollY) {
      isScrollingDown.value = true
    }
  } else {
    // Before scrolling past header for the first time, always show (relative positioning)
    isPastHeader.value = false
    shouldAddTransition.value = false
    isScrollingDown.value = false
  }
  
  lastScrollY = currentScrollY
  ticking = false
}

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll)
    ticking = true
  }
}

onMounted(() => {
  // Only add scroll listener for responsive header type
  if (process.client && headerType.value === 'responsive') {
    lastScrollY = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
  }
})

onUnmounted(() => {
  // Only remove scroll listener if it was added (responsive header type)
  if (process.client && headerType.value === 'responsive') {
    window.removeEventListener('scroll', onScroll)
  }
})
</script>

<style scoped>
.header-link-text-desktop {
  display: inline;
}

.header-link-text-mobile {
  display: none;
}

/* Below 800px, show mobile text and hide desktop text */
@media (max-width: 799px) {
  .header-link-text-desktop {
    display: none;
  }
  
  .header-link-text-mobile {
    display: inline;
  }
}
.header-link {
  position: relative;
  display: inline-block;
}
.header-link:after {
  content: '';
  position: absolute;
  bottom: var(--underline-offset);
  left: 0;
  width: 100%;
  height: 1px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.32s ease;
  background: currentColor;
}
.header-link:hover:after,
.header-link-active:after {
  transform: scaleX(1);
}
</style>

<style>
.header {
  position: relative;
  z-index: 1000;
  background-color: var(--background-color);
  color: var(--text-color);
  /* transition: color 0.6s ease, background-color 0.6s ease; */
  transform: translateY(0);
}

.header.header-static {
  position: relative;
}

.header.header-fixed {
  position: sticky;
  top: 0;
}

.header.header-sticky {
  position: sticky;
  top: 0;
}

.header.header-transition {
  transition: transform 0.3s ease;
}

.header.header-hidden {
  transform: translateY(-100%);
}
</style>
