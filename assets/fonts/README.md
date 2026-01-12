# Logo Fonts

Place your logo font files in this directory.

## Setup Instructions

1. Add your font files (`.woff`, `.woff2`, `.ttf`, etc.) to this folder
2. Add `@font-face` declarations in `assets/styles/main.css`:

```css
@font-face {
  font-family: 'Logo Font Name';
  src: url('~/assets/fonts/your-font.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Logo Font Name';
  src: url('~/assets/fonts/your-font-italic.woff2') format('woff2');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}
```

3. Update the `--logo-font-family` CSS variable in `assets/styles/main.css`:

```css
--logo-font-family: 'Logo Font Name', sans-serif;
```

4. Add preload links in `nuxt.config.ts` (optional, for better performance):

```js
link: [
  {
    rel: 'preload',
    href: '/_nuxt/assets/fonts/your-font.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
  },
]
```

Note: The `/_nuxt/assets/` path is how Vite serves assets in development. In production, the path may differ, so preloading from assets is optional - the @font-face will still work.

