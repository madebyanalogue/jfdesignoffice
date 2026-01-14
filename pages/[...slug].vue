<template>
  <div v-if="pending" class="page">
    <p>Loading...</p>
  </div>
  <div v-else-if="error" class="page">
    <p>Error loading page: {{ error.message }}</p>
  </div>
  <div v-else-if="page" class="page">
    <div v-if="sections.length === 0" style="padding: var(--gutter);">
      <p>No sections found for this page. Add sections in Sanity.</p>
    </div>
    <div v-for="section in sections" :key="section._id" class="page-section">
      <PageSectionFeaturedProjects
        v-if="section.sectionType === 'featuredProjects'"
        :section="section"
      />
      <PageSectionInfo
        v-else-if="section.sectionType === 'info'"
        :section="section"
      />
      <PageSectionServices
        v-else-if="section.sectionType === 'services'"
        :section="section"
      />
      <PageSectionPressAwards
        v-else-if="section.sectionType === 'pressAwards'"
        :section="section"
      />
      <PageSectionPortfolio
        v-else-if="section.sectionType === 'portfolio'"
        :section="section"
      />
    </div>
  </div>
  <div v-else class="page">
    <p>Page not found</p>
  </div>
</template>

<script setup>
const route = useRoute()

const slug = computed(() => {
  if (route.path === '/') return 'home'
  if (route.params.slug) {
    return Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
  }
  return null
})

const { data: page, pending, error } = useAsyncData(
  () => `page-${slug.value}`,
  async () => {
    if (!slug.value) {
      console.log('[Page] No slug value')
      return null
    }
    
    console.log('[Page] Fetching page for slug:', slug.value)
    
    const query = `*[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      sections[]-> {
        _id,
        _type,
        title,
        sectionType,
        featuredProjects[] {
          project-> {
            _id,
            title,
            slug,
            featuredImage {
              asset->
            }
          },
          format
        },
        infoImage {
          asset->
        },
        infoContent[] {
          _type,
          _key,
          title,
          text,
          links[] {
            linkTitle,
            subtitle,
            link,
            openInNewTab
          },
          content
        },
        servicesTitle,
        servicesClassName,
        servicesContent
      }
    }`
    
    if (process.server) {
      const config = useRuntimeConfig()
      const projectId = config.public.sanity?.projectId || 'kpljrloc'
      const dataset = config.public.sanity?.dataset || 'production'
      
      try {
        const result = await $fetch(`https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, params: { slug: slug.value } }),
        })
        console.log('[Page] Server result:', JSON.stringify(result, null, 2))
        const pageData = result?.result
        if (pageData && pageData._id) {
          console.log('[Page] ✅ Found page:', pageData._id, pageData.title)
          return pageData
        }
        console.warn('[Page] ❌ No page data in result for slug:', slug.value)
        console.log('[Page] Full result object:', result)
        return null
      } catch (err) {
        console.error('[Page] Error fetching page:', err)
        throw err
      }
    }
    try {
      const result = await $fetch('/api/sanity/query', {
        method: 'POST',
        body: { query, params: { slug: slug.value } },
      })
      console.log('[Page] Client result:', JSON.stringify(result, null, 2))
      const pageData = result?.result
      if (pageData && pageData._id) {
        console.log('[Page] ✅ Found page:', pageData._id, pageData.title)
        return pageData
      }
      console.warn('[Page] ❌ No page data in result for slug:', slug.value)
      console.log('[Page] Full result object:', result)
      return null
    } catch (err) {
      console.error('[Page] Error fetching page:', err)
      throw err
    }
  },
  { watch: [slug] }
)

const sections = computed(() => page.value?.sections || [])
</script>

<style scoped>
.page {
  padding: var(--gutter) 0;
}

.page-section {
  margin-bottom: var(--gutter);
}
</style>

