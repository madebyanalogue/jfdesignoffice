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
        {{ item.text }}
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
        {{ item.text }}
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

</style>

