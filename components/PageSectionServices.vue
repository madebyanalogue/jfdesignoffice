<template>
  <div :class="['services-section', section.servicesClassName]">
    <h2 v-if="section.servicesTitle" class="services-title">{{ section.servicesTitle }}</h2>
    <div class="services-content">
      <SanityBlocks :blocks="section.servicesContent" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  section: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.services-section {
  display: flex;
  flex-direction: column;
  gap: var(--gutter);
  padding: 0 var(--gutter);
}
.services-title {
  font-weight: normal;
}
.services-content :deep(.sanity-blocks) {
  font-size: var(--font-size-large);
}
.services-content :deep(.sanity-block) {
  white-space: pre-line;
}
.services-content :deep(p) {
  margin-bottom: 0;
}
</style>

