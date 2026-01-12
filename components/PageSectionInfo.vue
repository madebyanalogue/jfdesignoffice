<template>
  <div class="info-section">
    <SanityBlocks :blocks="section.infoContent" />
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
.info-section {
  max-width: 800px;
  margin: 0 auto;
}
</style>

