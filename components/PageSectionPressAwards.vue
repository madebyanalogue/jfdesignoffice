<template>
  <div class="press-awards-section">
    <div
      v-for="(item, index) in pressAwards"
      :key="item._id || index"
      class="press-award-item"
    >
      <h3 v-if="item.title" class="press-award-title">{{ item.title }}</h3>
      <p v-if="item.details" class="press-award-details">{{ item.details }}</p>
    </div>
  </div>
</template>

<script setup>
const { data: pressAwards } = useAsyncData('press-awards', async () => {
  const query = `*[_type == "pressAward"] | order(orderRank) {
    _id,
    title,
    details
  }`
  
  if (process.server) {
    const config = useRuntimeConfig()
    const projectId = config.public.sanity?.projectId || 'kpljrloc'
    const dataset = config.public.sanity?.dataset || 'production'
    
    try {
      const result = await $fetch(`https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      return result?.result || []
    } catch (err) {
      console.error('[PressAwards] Error fetching:', err)
      return []
    }
  }
  
  try {
    const result = await $fetch('/api/sanity/query', {
      method: 'POST',
      body: { query },
    })
    return result?.result || []
  } catch (err) {
    console.error('[PressAwards] Error fetching:', err)
    return []
  }
}, { server: true })
</script>

<style scoped>
.press-awards-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--gutter);
}

.press-award-item {
  display: flex;
  flex-direction: column;
  gap: calc(var(--gutter) / 2);
}

.press-award-title {
  font-size: var(--font-size-body);
  font-weight: normal;
  margin-bottom: 0;
}

.press-award-details {
  font-size: var(--font-size-body);
  opacity: 0.7;
  margin: 0;
  white-space: pre-line;
}
</style>

