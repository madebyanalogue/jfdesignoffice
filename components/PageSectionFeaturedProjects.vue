<template>
  <div class="featured-projects">
    <div
      v-for="item in section.featuredProjects"
      :key="item.project?._id || item._key"
      class="featured-project"
      :class="`format-${item.format || 'landscape'}`"
    >
        <NuxtLink
          v-if="item.project?.slug?.current"
          :to="`/portfolio/${item.project.slug.current}`"
          class="featured-project-link"
        >
        <div class="featured-project-image-container">
          <div class="featured-project-image-wrapper">
              <NuxtImg
                v-if="item.project?.featuredImage?.asset"
                :src="item.project.featuredImage.asset.url || ''"
                :alt="item.project.title"
                class="featured-project-image"
              />
          </div>
        </div>
      </NuxtLink>
      <h3 class="featured-project-title">{{ item.project.title }}</h3>
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
.featured-projects {
  display: grid;
  gap: var(--gutter);
  padding: 0 var(--gutter);
}

.featured-project-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.featured-project-image-container {
  aspect-ratio: 1400 / 935;
  position: relative;
}
.featured-project-image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.featured-project-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: top left;
}

.format-landscape .featured-project-image {
  aspect-ratio: var(--aspect-ratio-landscape);
}

.format-landscapeSmall .featured-project-image {
  aspect-ratio: var(--aspect-ratio-landscape);
}

.format-square .featured-project-image {
  aspect-ratio: var(--aspect-ratio-square);
}

.format-portrait .featured-project-image {
  aspect-ratio: var(--aspect-ratio-portrait);
}

.featured-project-title {
  margin-top: calc(var(--gutter) / 2);
  font-size: var(--font-size-body);
  font-weight: normal;
}
</style>

