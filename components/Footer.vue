<template>
  <footer class="footer">
    <div class="pad-1 border-bottom">
      <button class="footer-back-to-top" @click="scrollToTop"><span><svg id="a" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><polygon points="16.5 0 7 0 7 1.5 15.44 1.5 .05 16.89 1.11 17.95 16.5 2.56 16.5 11 18 11 18 1.5 18 0 16.5 0"/></svg></span></button>
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

