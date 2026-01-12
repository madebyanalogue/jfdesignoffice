<template>
  <div class="logo">
    <span v-if="logoSpans.length > 0">
      <component
        v-for="(span, index) in logoSpans"
        :key="index"
        :is="span.tag"
        class="logo-span"
      >
        {{ span.text }}
      </component>
    </span>
    <span v-else>JF</span>
  </div>
</template>

<script setup>
import { useSiteSettings } from '~/composables/useSiteSettings'

const { logo } = useSiteSettings()

const logoSpans = computed(() => {
  const logoData = logo.value
  
  if (!logoData || !Array.isArray(logoData) || logoData.length === 0) {
    return []
  }
  
  const spans = []
  
  for (const block of logoData) {
    if (block._type === 'block' && block.children) {
      for (const child of block.children) {
        if (child._type === 'span') {
          spans.push({
            tag: getSpanTag(child),
            text: child.text || '',
          })
        }
      }
    }
  }
  
  return spans
})

const getSpanTag = (child) => {
  if (!child.marks || child.marks.length === 0) return 'span'
  const mark = child.marks[0]
  const markMap = {
    strong: 'strong',
    em: 'em',
    underline: 'u',
    code: 'code',
  }
  return markMap[mark] || 'span'
}
</script>

<style scoped>
.logo {
  font-family: var(--logo-font-family);
  font-size: var(--font-size-logo);
  color: currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  white-space: break-spaces;
  transform: translateY(10%);
  white-space: break-spaces;
  line-height: 1;
}

.logo :deep(p) {
  margin: 0;
  display: inline;
}

.logo-span {
  display: inline;
}

/* Ensure logo link has no decoration */
.logo :deep(a) {
  text-decoration: none;
  color: inherit;
}
</style>

