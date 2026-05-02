<script setup lang="ts">
import { Calendar, Tag } from 'lucide-vue-next'

const { data: news, pending, error } = await useFetch<any>('http://localhost:3000/api/news?sort=-publishDate')

const getCategoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    verein: '#0a2472',
    regatta: '#0077be',
    jugend: '#00e5ff',
    sonstiges: '#888'
  }
  return colors[cat] || colors.verein
}
</script>

<template>
  <div class="news-page">
    <section class="page-header">
      <div class="container" v-animate-on-scroll>
        <h1 class="section-title">Aktuelles vom Club</h1>
        <p class="section-subtitle">Bleiben Sie informiert über alles, was im WSCKL passiert.</p>
      </div>
    </section>

    <section class="news-content section">
      <div class="container">
        <div v-if="pending" class="loading">Lade Neuigkeiten...</div>
        <div v-else-if="news?.docs?.length" class="news-stack">
          <article 
            v-for="(item, idx) in news.docs" 
            :key="item.id" 
            :id="item.id"
            class="news-entry glass"
            v-animate-on-scroll="{ delay: idx * 50 }"
          >
            <div class="entry-image" v-if="item.image">
              <img :src="item.image.url" :alt="item.title" />
            </div>
            <div class="entry-body">
              <div class="entry-meta">
                <span class="category" :style="{ color: getCategoryColor(item.category) }">
                  <Tag :size="14" /> {{ item.category }}
                </span>
                <span class="date">
                  <Calendar :size="14" /> {{ new Date(item.publishDate).toLocaleDateString('de-DE') }}
                </span>
              </div>
              <h2>{{ item.title }}</h2>
              <div class="rich-content">
                <BlockRenderer :blocks="[{ blockType: 'content', text: item.content, columns: '1' }]" />
              </div>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <p>Aktuell liegen keine Neuigkeiten vor.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.news-page { background: var(--color-bg); }

.page-header {
  padding: 8rem 0 6rem;
  background: linear-gradient(to bottom, var(--color-bg-alt), var(--color-bg));
  text-align: center;
}

.section-subtitle { color: var(--color-text-muted); font-size: 1.2rem; max-width: 600px; margin: 1.5rem auto 0; }

.news-stack { display: flex; flex-direction: column; gap: 4rem; max-width: 900px; margin: 0 auto; }

.news-entry {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: white;
}

.entry-image { height: 400px; }
.entry-image img { width: 100%; height: 100%; object-fit: cover; }

.entry-body { padding: 4rem; }

.entry-meta { display: flex; gap: 2rem; margin-bottom: 1.5rem; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.entry-meta span { display: flex; align-items: center; gap: 0.5rem; }

.entry-body h2 { font-size: 2.5rem; margin-bottom: 2rem; color: var(--color-primary); }

.rich-content { line-height: 1.8; color: var(--color-text-muted); }

@media (max-width: 768px) {
  .entry-body { padding: 2rem; }
  .entry-image { height: 250px; }
  .entry-body h2 { font-size: 1.8rem; }
}
</style>
