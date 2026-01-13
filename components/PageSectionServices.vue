<template>
  <div class="services-section">
    <h2 v-if="section.servicesTitle" class="services-title">{{ section.servicesTitle }}</h2>
    <SanityBlocks :blocks="section.servicesContent" />
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
  max-width: 800px;
  margin: 0 auto;
}

.services-title {
  font-size: var(--font-size-large);
  font-weight: normal;
  margin-bottom: var(--gutter);
}
</style>

