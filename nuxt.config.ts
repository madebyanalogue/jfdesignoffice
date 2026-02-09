// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/sanity',
    '@nuxt/image',
  ],
  sanity: {
    projectId: 'kpljrloc',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-03-19',
    visualEditing: {
      studioUrl: false,
      enabled: false,
    },
  },
  runtimeConfig: {
    public: {
      sanity: {
        projectId: 'kpljrloc',
        dataset: 'production',
      },
    },
  },
  image: {
    sanity: {
      projectId: 'kpljrloc',
      dataset: 'production',
    },
    quality: 80,
    format: ['webp', 'jpg'],
    // Enable image caching
    domains: ['cdn.sanity.io'],
    // Add cache headers for images
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
  css: ['~/assets/styles/main.css'],
  experimental: {
    inlineSSRStyles: false,
  },
  app: {
    head: {
      title: 'JF Design Office',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      style: [
        {
          children: `
            html:not(.css-loaded) body { 
              visibility: hidden !important; 
              opacity: 0 !important;
            } 
            html.css-loaded body { 
              visibility: visible !important; 
              opacity: 1 !important;
              transition: opacity 0.2s ease-in;
            }
          `,
          key: 'prevent-fouc'
        }
      ],
      link: [
        {
          rel: 'preload',
          href: '/fonts/BagossStandardTRIAL-Regular.woff',
          as: 'font',
          type: 'font/woff',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/AyerRegular.woff',
          as: 'font',
          type: 'font/woff',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/AyerRegularItalic.woff',
          as: 'font',
          type: 'font/woff',
          crossorigin: 'anonymous',
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
          defer: true,
        },
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
  build: {
    transpile: ['@nuxtjs/sanity'],
  },
  vite: {
    optimizeDeps: {
      exclude: ['@sanity/visual-editing', '@sanity/ui', 'react-compiler-runtime', 'react', 'react-dom'],
    },
    ssr: {
      noExternal: [],
      external: ['@sanity/visual-editing'],
    },
    resolve: {
      alias: {
        'react-compiler-runtime': join(__dirname, 'node_modules/react-compiler-runtime/dist/index.js'),
        '@sanity/visual-editing': join(__dirname, 'node_modules/@sanity/visual-editing-stub/index.js'),
      },
    },
    plugins: [
      {
        name: 'stub-react-compiler-nested',
        resolveId(id) {
          if (id.includes('react-compiler-runtime')) {
            return join(__dirname, 'node_modules/react-compiler-runtime/dist/index.js')
          }
          if (id.includes('@sanity/visual-editing') && !id.includes('stub')) {
            return join(__dirname, 'node_modules/@sanity/visual-editing-stub/index.js')
          }
        },
      },
    ],
  },
})

