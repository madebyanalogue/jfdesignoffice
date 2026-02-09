<template>
  <footer class="footer">
    <div class="pad-1 border-bottom">
      <button class="footer-back-to-top" @click="scrollToTop" aria-label="Back to top"><span><div class="arrow-up"></div></span></button>
    </div>
    <div class="pad-1 footer-content">
      <div class="footer-links" v-if="footerLinks && footerLinks.length > 0">
        <a
          v-for="link in footerLinks"
          :key="link._key || link.text"
          :href="link.url"
          :target="isExternalUrl(link.url) ? '_blank' : undefined"
          :rel="isExternalUrl(link.url) ? 'noopener' : undefined"
          class="footer-link"
        >
          {{ link.text }}
        </a>
      </div>
      
      <div class="footer-copyright">
        {{ copyright }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useSiteSettings } from '~/composables/useSiteSettings'

const { footerLinks, copyright } = useSiteSettings()

const isExternalUrl = (url) => {
  if (!url) return false
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return true
  return !url.startsWith('/') && !url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:')
}

const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}
</script>

<style scoped>


</style>

