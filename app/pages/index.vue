<script setup lang="ts">
const { data: page, error: pageError } = await useFetch<any>('/api/pages?where[slug][equals]=home')
const { data: settings, error: settingsError } = await useFetch<any>('/api/globals/site-settings')

if (pageError.value || settingsError.value) {
  console.error('CMS Fetch Error:', pageError.value || settingsError.value)
}

const homepage = computed(() => page.value?.docs?.[0])
</script>

<template>
  <div class="homepage">
    <!-- HERO SECTION (From Blocks) -->
    <template v-if="homepage?.layout">
      <!-- We find the hero and pegel blocks to show them first -->
      <BlockRenderer :blocks="homepage.layout.filter(b => b.blockType === 'hero' || b.blockType === 'pegel')" />
    </template>

    <!-- DYNAMIC EVENTS SECTION -->
    <EventsSection />

    <!-- REMAINING BLOCKS (Excluding hero and pegel) -->
    <template v-if="homepage?.layout">
      <BlockRenderer :blocks="homepage.layout.filter(b => b.blockType !== 'hero' && b.blockType !== 'pegel')" />
    </template>

    <!-- DYNAMIC NEWS SECTION -->
    <NewsSection />

    <!-- Loading/Error Fallback -->
    <template v-if="!homepage && !pageError">
      <section class="hero-fallback">
        <div class="container text-center">
          <h1>WSCKL</h1>
          <p>Inhalte werden geladen...</p>
        </div>
      </section>
    </template>

    <!-- Maintenance Banner -->
    <div v-if="settings?.maintenanceMode" class="maintenance-banner glass">
      <div class="container">
        <p><strong>⚓ Hinweis:</strong> {{ settings.maintenanceNotice || 'Die Internetseite befindet sich im Wartungsmodus.' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-fallback {
  padding: 10rem 0;
  background: var(--color-primary);
  color: white;
}

.maintenance-banner {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 1rem 2rem;
  border-radius: 100px;
  background: rgba(10, 36, 114, 0.9);
  color: white;
  border: 1px solid var(--color-accent);
  white-space: nowrap;
}
</style>
