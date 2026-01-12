export const useSiteSettings = () => {
  const query = `*[_type == "siteSettings"][0] {
    maxWidth,
    logo,
    seoTitle,
    seoDescription,
    facebookShareImage {
      asset->
    },
    leftMenu-> {
      title,
      items[] {
        text,
        link {
          type,
          page-> {
            slug {
              current
            }
          },
          url
        }
      }
    },
    rightMenu-> {
      title,
      items[] {
        text,
        link {
          type,
          page-> {
            slug {
              current
            }
          },
          url
        }
      }
    },
    footerLinks,
    copyright
  }`
  
  const { data: settings } = useAsyncData('siteSettings', async () => {
    if (process.server) {
      const config = useRuntimeConfig()
      const projectId = config.public.sanity?.projectId || 'kpljrloc'
      const dataset = config.public.sanity?.dataset || 'production'
      
      return await $fetch(`https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      }).then(result => result?.result || null).catch(() => null)
    }
    return await $fetch('/api/sanity/query', {
      method: 'POST',
      body: { query },
    }).then(result => result?.result || null).catch(() => null)
  }, { server: true }) // Ensure this runs on server for SSR

  const maxWidth = computed(() => settings.value?.maxWidth || '1800px')
  const logo = computed(() => {
    const logoData = settings.value?.logo || []
    if (process.client) {
      console.log('[useSiteSettings] Logo data:', logoData)
      console.log('[useSiteSettings] Settings:', settings.value)
    }
    return logoData
  })
  const seoTitle = computed(() => settings.value?.seoTitle || 'JF Design Office')
  const seoDescription = computed(() => settings.value?.seoDescription || '')
  const facebookShareImage = computed(() => {
    const image = settings.value?.facebookShareImage?.asset
    if (!image?._ref) return null
    const [file, id, extension] = image._ref.replace('image-', '').split('-')
    return `https://cdn.sanity.io/images/kpljrloc/production/${id}.${extension}`
  })
  const leftMenu = computed(() => settings.value?.leftMenu)
  const rightMenu = computed(() => settings.value?.rightMenu)
  const footerLinks = computed(() => settings.value?.footerLinks || [])
  const copyright = computed(() => {
    const text = settings.value?.copyright || ''
    const currentYear = new Date().getFullYear()
    return text.replace(/\[year\]/g, currentYear.toString())
  })

  return {
    maxWidth,
    logo,
    seoTitle,
    seoDescription,
    facebookShareImage,
    leftMenu,
    rightMenu,
    footerLinks,
    copyright,
  }
}

