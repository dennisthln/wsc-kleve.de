<template>
  <section class="news-section section">
    <div class="container">
      <header class="section-header" v-animate-on-scroll="{ animation: 'fade-up' }">
        <div class="header-content">
          <span class="badge">Neuigkeiten</span>
          <h2 class="section-title">Aktuelles vom Club</h2>
          <p class="section-subtitle">Erfahren Sie alles über Regatten, Feste und Neuigkeiten aus dem Vereinsleben.</p>
        </div>
        <NuxtLink to="/news/aktuelles" class="btn btn-outline desktop-only">Alle News ansehen</NuxtLink>
      </header>

      <div v-if="pending" class="loading-news">
        <div class="pulse-loader"></div>
        <span>Aktuelles wird geladen...</span>
      </div>
      <div v-else-if="news?.docs?.length" class="news-grid">
        <NewsCard 
          v-for="(item, idx) in news.docs.slice(0, props.limit || 3)" 
          :key="item.id" 
          :item="item"
          :delay="idx * 150"
        />
      </div>
      
      <div class="mobile-only text-center mt-12">
        <NuxtLink to="/news/aktuelles" class="btn btn-outline">Alle News ansehen</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  limit?: number
}>()

const { cmsUrl } = useCmsApi()
const { data: news, pending } = await useFetch<any>(() => cmsUrl(`/news?sort=-publishDate&limit=${props.limit || 3}`))
</script>

<style scoped>
.news-section { 
  background-color: var(--color-bg); 
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 5rem;
}

.header-content {
  max-width: 600px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.loading-news {
  padding: 5rem 0;
  text-align: center;
  color: var(--color-text-muted);
}

.pulse-loader {
  width: 12px;
  height: 12px;
  background-color: var(--color-secondary);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  70% { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(0.95); opacity: 0; }
}

@media (max-width: 992px) {
  .section-header { 
    flex-direction: column; 
    align-items: center; 
    text-align: center; 
    gap: 2.5rem; 
    margin-bottom: 3.5rem;
  }
  .news-grid { gap: 2rem; }
}

@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
}
</style>
