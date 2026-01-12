<template>
  <div class="services-section">
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
</style>

