<template>
  <article :id="item.id" class="news-entry" v-animate-on-scroll="{ delay: delay }">
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
      <h2 class="entry-title">{{ item.title }}</h2>
      <div class="rich-content">
        {{ item.content.root.children[0].children[0].text }}
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Calendar, Tag } from 'lucide-vue-next'

const props = defineProps<{
  item: any
  delay?: number
}>()

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
.news-entry {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(10, 36, 114, 0.05);
  margin-bottom: 3rem;
  border: 1px solid rgba(0,0,0,0.03);
}

.entry-image {
  height: 350px;
  width: 100%;
}

.entry-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.entry-body {
  padding: 2.5rem;
}

.entry-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.entry-meta span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.entry-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  font-weight: 800;
  line-height: 1.2;
}

.rich-content {
  line-height: 1.7;
  color: var(--color-text-muted);
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .entry-body { padding: 1.5rem; }
  .entry-image { height: 200px; }
  .entry-title { font-size: 1.5rem; }
  .entry-meta { gap: 1rem; }
}
</style>
