export const useSiteSettings = () => {
    const query = `*[_type == "siteSettings"][0] {
      maxWidth,
      logo,
    title,
      seoTitle,
      seoDescription,
    headerType,
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
    disablePreloader,
    preloaderImages[] {
      image {
        asset->
      },
      alt,
      repeatLeftRight
    },
    preloaderText,
    preloaderSvgCode,
    preloaderFontSizeMobile,
    preloaderFontSize,
      facebookShareImage {
        asset->
      },
      leftMenu-> {
        title,
        items[] {
          text,
        textMobile,
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
        textMobile,
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
  const logo = computed(() => settings.value?.logo || [])
  const title = computed(() => settings.value?.title || 'JF Design Office')
  const seoTitle = computed(() => settings.value?.seoTitle || 'JF Design Office')
  const seoDescription = computed(() => settings.value?.seoDescription || '')
  const disablePreloader = computed(() => settings.value?.disablePreloader === true)
  const preloaderImages = computed(() => settings.value?.preloaderImages || [])
  const preloaderText = computed(() => settings.value?.preloaderText || [])
  const preloaderSvgCode = computed(() => settings.value?.preloaderSvgCode || null)
  const preloaderFontSizeMobile = computed(() => settings.value?.preloaderFontSizeMobile ?? 20)
  const preloaderFontSize = computed(() => settings.value?.preloaderFontSize ?? 40)
  const facebookShareImage = computed(() => {
    const image = settings.value?.facebookShareImage?.asset
    if (!image?._ref) return null
    const [file, id, extension] = image._ref.replace('image-', '').split('-')
    return `https://cdn.sanity.io/images/kpljrloc/production/${id}.${extension}`
  })
  const leftMenu = computed(() => settings.value?.leftMenu)
  const rightMenu = computed(() => settings.value?.rightMenu)
  const footerLinks = computed(() => settings.value?.footerLinks || [])
  const headerType = computed(() => settings.value?.headerType || 'responsive')
  const mobileBreakpoint = computed(() => settings.value?.mobileBreakpoint ?? 800)
  const gutterMobile = computed(() => settings.value?.gutterMobile ?? 15)
  const gutterDesktop = computed(() => settings.value?.gutterDesktop ?? 20)
  const fontSizeBodyMobile = computed(() => settings.value?.fontSizeBodyMobile ?? 12)
  const fontSizeLargeMobile = computed(() => settings.value?.fontSizeLargeMobile ?? 18)
  const fontSizeLogoMobile = computed(() => settings.value?.fontSizeLogoMobile ?? 14)
  const fontSizeBodyDesktop = computed(() => settings.value?.fontSizeBodyDesktop ?? 16)
  const fontSizeLargeDesktop = computed(() => settings.value?.fontSizeLargeDesktop ?? 22)
  const fontSizeLogoDesktop = computed(() => settings.value?.fontSizeLogoDesktop ?? 40)
  const lineHeight = computed(() => settings.value?.lineHeight ?? 1.1)
  const copyright = computed(() => {
    const text = settings.value?.copyright || ''
    const currentYear = new Date().getFullYear()
    return text.replace(/\[year\]/g, currentYear.toString())
  })

  return {
    settings,
    maxWidth,
    logo,
    title,
    seoTitle,
    seoDescription,
    facebookShareImage,
    leftMenu,
    rightMenu,
    footerLinks,
    headerType,
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
    copyright,
    disablePreloader,
    preloaderImages,
    preloaderText,
    preloaderSvgCode,
    preloaderFontSizeMobile,
    preloaderFontSize,
  }
}

