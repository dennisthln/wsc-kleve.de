<script setup lang="ts">
definePageMeta({
  pageTransition: false,
  layoutTransition: false
})

const { cmsUrl } = useCmsApi()
const { data: pageData } = await useFetch(cmsUrl('/pages'), {
  query: {
    'where[slug][equals]': 'satzung',
  },
})
const page = computed(() => pageData.value?.docs?.[0])
</script>

<template>
  <div class="satzung-page">
    <template v-if="page">
      <BlockRenderer :blocks="page.layout" />
    </template>
    <div v-else class="container section">
      <h1>Satzung & Ordnungen</h1>
      <p>Lade Inhalte...</p>
    </div>
  </div>
</template>

<style scoped>
.satzung-page {
  padding-bottom: 5rem;
}

/* Disable animations for this page to ensure content visibility */
.satzung-page :deep(.reveal-base) {
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
}

.satzung-page :deep(.hover-lift:hover) {
  transform: none !important;
}
</style>
