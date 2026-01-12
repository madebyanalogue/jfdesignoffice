import { useRoute } from 'vue-router'

export const usePageSettings = () => {
  const route = useRoute()
  
  const pageSlug = computed(() => {
    if (route.path === '/') return 'home'
    if (route.params.slug) {
      return Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
    }
    return null
  })

  const { data: page } = useAsyncData(
    () => `pageSettings-${pageSlug.value}`,
    async () => {
      if (!pageSlug.value) return null

      const query = pageSlug.value === 'home'
        ? `*[_type == "page" && slug.current == "home"][0] { textColor, backgroundColor }`
        : `*[_type == "page" && slug.current == $slug][0] { textColor, backgroundColor }`
      
      const params = pageSlug.value === 'home' ? {} : { slug: pageSlug.value }
      
      if (process.server) {
        const config = useRuntimeConfig()
        const projectId = config.public.sanity?.projectId || 'kpljrloc'
        const dataset = config.public.sanity?.dataset || 'production'
        
        return await $fetch(`https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, params }),
        }).then(result => result?.result || null).catch(() => null)
      }
      return await $fetch('/api/sanity/query', {
        method: 'POST',
        body: { query, params },
      }).then(result => result?.result || null).catch(() => null)
    },
    { watch: [pageSlug] }
  )

  const textColor = computed(() => page.value?.textColor || '#000000')
  const backgroundColor = computed(() => page.value?.backgroundColor || '#ffffff')

  return {
    textColor,
    backgroundColor,
  }
}

