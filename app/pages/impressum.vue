<script setup lang="ts">
const { data: pageData } = await useFetch('/api/pages', {
  query: {
    'where[slug][equals]': 'impressum',
  },
})
const page = computed(() => pageData.value?.docs?.[0])
</script>

<template>
  <div>
    <template v-if="page">
      <BlockRenderer :blocks="page.layout" />
    </template>
    <div v-else class="container section">
      <h1>Impressum</h1>
      <p>Lade Inhalte...</p>
    </div>
  </div>
</template>
