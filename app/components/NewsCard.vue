<template>
  <article 
    class="news-card hover-lift"
    v-animate-on-scroll="{ animation: 'fade-up', delay: props.delay }"
  >
    <NuxtLink :to="'/news/aktuelles#' + item.id" class="card-image-link">
      <div class="card-image">
        <img v-if="item.image" :src="item.image.url" :alt="item.title" />
        <div v-else class="image-placeholder">
          <Calendar :size="48" />
        </div>
        <div class="image-overlay"></div>
        <div class="category-badge" :style="{ backgroundColor: getCategoryColor(item.category) }">
          {{ item.category }}sd
        </div>
      </div>
    </NuxtLink>
    
    <div class="card-content">
      <div class="card-meta">
        <span class="date">{{ new Date(item.publishDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }) }}</span>
      </div>
      
      <h3 class="card-title">{{ item.title }}</h3>
      
      <p class="excerpt">
        {{ excerpt }}
      </p>
      
      <NuxtLink :to="'/news/aktuelles#' + item.id" class="read-more">
        <span>Beitrag lesen</span>
        <div class="arrow-circle">
          <ArrowRight :size="16" />
        </div>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArrowRight, Calendar } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  item: any
  delay?: number
}>()

const excerpt = computed(() => {
  try {
    const firstText = props.item.content.root.children[0].children[0].text
    return firstText.length > 100 ? firstText.substring(0, 97) + '...' : firstText
  } catch (e) {
    return 'Klicken Sie für weitere Details.'
  }
})

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
.news-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(10, 36, 114, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  border: 1px solid rgba(0,0,0,0.05);
}

.news-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(10, 36, 114, 0.12);
  border-color: rgba(10, 36, 114, 0.1);
}

.card-image-link {
  display: block;
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
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
  transform: scale(1.05);
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
  top: 1rem;
  left: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 5;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
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
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  margin-bottom: 0.75rem;
}

.date {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary);
  opacity: 0.8;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.4;
  color: var(--color-primary);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.excerpt {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
  flex: 1;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-primary);
  font-weight: 800;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.arrow-circle {
  width: 32px;
  height: 32px;
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

@media (max-width: 768px) {
  .card-content { padding: 1.5rem; }
  .card-title { font-size: 1.2rem; }
}
</style>
