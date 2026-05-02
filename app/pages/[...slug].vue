<script setup lang="ts">
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug || 'index'

const { data: pageData, pending, error } = await useFetch(`/api/pages?where[slug][equals]=${slug}`)
const page = computed(() => pageData.value?.docs?.[0])

// Provide SEO meta data
watchEffect(() => {
  if (page.value) {
    useSeoMeta({
      title: `${page.value.title} | WSCKL - Wassersportclub Kleve e.V.`,
      ogTitle: page.value.title,
      description: 'Wassersport am Niederrhein - Segeln, Motorboot und Gemeinschaft beim WSC Kleve.',
    })
  }
})
</script>

<template>
  <div class="cms-page">
    <div v-if="pending" class="loading-overlay">
       <div class="pulse-loader"></div>
    </div>

    <template v-else-if="page">
      <BlockRenderer :blocks="page.layout" />
    </template>

    <div v-else-if="error || !page" class="container section text-center">
      <h1>Seite nicht gefunden</h1>
      <p>Die angeforderte Seite "{{ slug }}" konnte nicht gefunden werden.</p>
      <NuxtLink to="/" class="btn btn-primary mt-8">Zurück zur Startseite</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.cms-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: white;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-loader {
  width: 12px;
  height: 12px;
  background-color: var(--color-primary);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 36, 114, 0.4); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(10, 36, 114, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 36, 114, 0); }
}
</style>
