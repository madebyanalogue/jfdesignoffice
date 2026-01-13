<template>
  <div class="press-awards-section">
    <div
      v-for="(item, index) in section.pressAwardsContent"
      :key="item._key || index"
      class="press-award-item"
    >
      <NuxtLink
        v-if="item.featuredProject?.project?.slug?.current"
        :to="`/portfolio/${item.featuredProject.project.slug.current}`"
        class="press-award-link"
      >
        <NuxtImg
          v-if="item.featuredProject?.project?.featuredImage?.asset"
          :src="item.featuredProject.project.featuredImage.asset.url || ''"
          :alt="item.featuredProject.project.title"
          class="press-award-image"
        />
        <div class="press-award-info">
          <h3 class="press-award-title">
            {{ item.featuredProject?.project?.title || item.featuredProject?.customTitle }}
          </h3>
          <p class="press-award-publisher">{{ item.publisher }}</p>
        </div>
      </NuxtLink>
      <div v-else class="press-award-link">
        <NuxtImg
          v-if="item.featuredProject?.customImage?.asset"
          :src="item.featuredProject.customImage.asset.url || ''"
          :alt="item.featuredProject.customTitle"
          class="press-award-image"
        />
        <div class="press-award-info">
          <h3 class="press-award-title">{{ item.featuredProject?.customTitle }}</h3>
          <p class="press-award-publisher">{{ item.publisher }}</p>
        </div>
      </div>
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
.press-awards-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--gutter);
}

.press-award-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.press-award-image {
  width: 100%;
  height: auto;
  display: block;
}

.press-award-info {
  margin-top: calc(var(--gutter) / 2);
}

.press-award-title {
  font-size: var(--font-size-body);
  font-weight: normal;
  margin-bottom: calc(var(--gutter) / 4);
}

.press-award-publisher {
  font-size: var(--font-size-body);
  opacity: 0.7;
}
</style>

