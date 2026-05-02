<script setup lang='ts'>
const { data: pageData } = await useFetch('http://localhost:3000/api/pages?where[slug][equals]=verein')
const page = computed(() => pageData.value?.docs?.[0])
</script>

<template>
  <div>
    <template v-if='page'>
      <BlockRenderer :blocks='page.layout' />
    </template>
    <div v-else class='container section'>
      <h1>Der Verein</h1>
      <p>Lade Vereinsinformationen...</p>
    </div>
  </div>
</template>
