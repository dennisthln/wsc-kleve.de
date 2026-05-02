<template>
  <section class="news-section section">
    <div class="container">
      <header class="section-header" v-animate-on-scroll>
        <div class="header-content">
          <span class="badge">Neuigkeiten</span>
          <h2 class="section-title">Aktuelles vom Club</h2>
          <p class="section-subtitle">Erfahren Sie alles über Regatten, Feste und Neuigkeiten aus dem Vereinsleben.</p>
        </div>
        <NuxtLink to="/news/aktuelles" class="btn btn-outline desktop-only">Alle News ansehen</NuxtLink>
      </header>

      <div v-if="pending" class="loading">Lade News...</div>
      <div v-else-if="news?.docs?.length" class="news-grid">
        <article 
          v-for="(item, idx) in news.docs.slice(0, 3)" 
          :key="item.id" 
          class="news-card"
          :class="{ 'has-image': item.image }"
          v-animate-on-scroll="{ delay: idx * 100 }"
        >
          <div class="card-image" v-if="item.image">
            <img :src="item.image.url" :alt="item.title" />
          </div>
          
          <div class="card-content">
            <div class="card-top">
              <span class="category-tag" :style="{ color: getCategoryColor(item.category) }">
                {{ item.category }}
              </span>
              <span class="date">{{ new Date(item.publishDate).toLocaleDateString('de-DE') }}</span>
            </div>
            
            <h3>{{ item.title }}</h3>
            
            <p class="excerpt">
              {{ getExcerpt(item.content) }}
            </p>
            
            <NuxtLink :to="'/news/aktuelles#' + item.id" class="read-more">
              <span>Weiterlesen</span>
              <ArrowRight :size="18" />
            </NuxtLink>
          </div>
        </article>
      </div>
      
      <div class="mobile-only text-center mt-12">
        <NuxtLink to="/news/aktuelles" class="btn btn-outline">Alle News ansehen</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, Calendar } from 'lucide-vue-next'

const props = defineProps<{
  limit?: number
}>()

const { cmsUrl } = useCmsApi()
const { data: news, pending } = await useFetch<any>(() => cmsUrl(`/news?sort=-publishDate&limit=${props.limit || 3}`))

const getExcerpt = (content: any) => {
  try {
    const firstText = content.root.children[0].children[0].text
    return firstText.length > 100 ? firstText.substring(0, 97) + '...' : firstText
  } catch (e) {
    return 'Klicken Sie für weitere Details.'
  }
}

const getCategoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    verein: '#0a2472',
    regatta: '#0077be',
    jugend: '#00e5ff',
    sonstiges: '#64748b'
  }
  return colors[cat] || colors.verein
}
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
}

.news-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
  height: 100%;
  background: white;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(0,0,0,0.03);
}

.news-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-md);
}

.card-image {
  height: 220px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.news-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.category-tag {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.date {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.card-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
  line-height: 1.3;
  color: var(--color-primary);
}

.excerpt {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.read-more {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-secondary);
  font-weight: 700;
  text-decoration: none;
}

.read-more span {
  border-bottom: 2px solid transparent;
  transition: var(--transition);
}

.read-more:hover span {
  border-color: var(--color-accent);
}

.btn-outline {
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: white;
}

.desktop-only { display: inline-flex; }
.mobile-only { display: none; }

@media (max-width: 992px) {
  .section-header { flex-direction: column; align-items: center; text-align: center; gap: 2rem; }
}

@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
  .card-content { padding: 2rem; }
}
</style>
