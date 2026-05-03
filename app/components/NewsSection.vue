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
        <article 
          v-for="(item, idx) in news.docs.slice(0, props.limit || 3)" 
          :key="item.id" 
          class="news-card hover-lift"
          v-animate-on-scroll="{ animation: 'fade-up', delay: idx * 150 }"
        >
          <NuxtLink :to="'/news/aktuelles#' + item.id" class="card-image-link">
            <div class="card-image">
              <img v-if="item.image" :src="item.image.url" :alt="item.title" />
              <div v-else class="image-placeholder">
                <Calendar :size="48" />
              </div>
              <div class="image-overlay"></div>
              <div class="category-badge" :style="{ backgroundColor: getCategoryColor(item.category) }">
                {{ item.category }}
              </div>
            </div>
          </NuxtLink>
          
          <div class="card-content">
            <div class="card-meta">
              <span class="date">{{ new Date(item.publishDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }) }}</span>
            </div>
            
            <h3 class="card-title">{{ item.title }}</h3>
            
            <p class="excerpt">
              {{ getExcerpt(item.content) }}
            </p>
            
            <NuxtLink :to="'/news/aktuelles#' + item.id" class="read-more">
              <span>Beitrag lesen</span>
              <div class="arrow-circle">
                <ArrowRight :size="16" />
              </div>
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
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 3rem;
}

.news-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(10, 36, 114, 0.04);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  border: 1px solid rgba(0,0,0,0.03);
}

.news-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 30px 60px rgba(10, 36, 114, 0.12);
  border-color: rgba(10, 36, 114, 0.05);
}

.card-image-link {
  display: block;
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
}

.card-image {
  height: 100%;
  width: 100%;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.news-card:hover .card-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(10, 36, 114, 0.4));
  opacity: 0;
  transition: opacity 0.5s ease;
}

.news-card:hover .image-overlay {
  opacity: 1;
}

.category-badge {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 100px;
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 5;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.image-placeholder {
  height: 100%;
  width: 100%;
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  opacity: 0.2;
}

.card-content {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  margin-bottom: 1.25rem;
}

.date {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-secondary);
  opacity: 0.8;
}

.card-title {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.excerpt {
  font-size: 1.05rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 2.5rem;
  flex: 1;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-primary);
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s ease;
}

.arrow-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.read-more:hover {
  color: var(--color-secondary);
}

.read-more:hover .arrow-circle {
  background: var(--color-secondary);
  color: white;
  transform: translateX(5px);
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
  .section-header { flex-direction: column; align-items: center; text-align: center; gap: 2.5rem; }
  .news-grid { gap: 2rem; }
}

@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
  .card-content { padding: 2rem; }
  .card-title { font-size: 1.4rem; }
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
