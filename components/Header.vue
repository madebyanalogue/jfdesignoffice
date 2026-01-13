<template>
  <header class="header border-bottom pad-1">
    <nav class="header-nav header-nav-left">
      <NuxtLink
        v-for="item in leftMenuItems"
        :key="item._key || item.text"
        :to="getMenuItemUrl(item)"
        :target="isExternalUrl(item.link?.url) ? '_blank' : undefined"
        :rel="isExternalUrl(item.link?.url) ? 'noopener' : undefined"
        class="header-link"
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
    
    <nav class="header-nav header-nav-right">
      <NuxtLink
        v-for="item in rightMenuItems"
        :key="item._key || item.text"
        :to="getMenuItemUrl(item)"
        :target="isExternalUrl(item.link?.url) ? '_blank' : undefined"
        :rel="isExternalUrl(item.link?.url) ? 'noopener' : undefined"
        class="header-link"
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

const { leftMenu, rightMenu } = useSiteSettings()

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
</style>

