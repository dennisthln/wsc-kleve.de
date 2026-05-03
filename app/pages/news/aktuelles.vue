<script setup lang="ts">
const { cmsUrl } = useCmsApi()
const { data: news, pending } = await useFetch<any>(cmsUrl('/news?sort=-publishDate'))
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
          <NewsEntry 
            v-for="(item, idx) in news.docs" 
            :key="item.id" 
            :item="item"
            :delay="idx * 50"
          />
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
  padding: 6rem 0 4rem;
  background: linear-gradient(to bottom, var(--color-bg-alt), var(--color-bg));
  text-align: center;
}

.section-subtitle { color: var(--color-text-muted); font-size: 1.1rem; max-width: 600px; margin: 1rem auto 0; }

.news-stack { display: flex; flex-direction: column; max-width: 850px; margin: 0 auto; }

.empty-state { text-align: center; padding: 4rem 0; color: var(--color-text-muted); }

@media (max-width: 768px) {
  .page-header { padding: 4rem 0 3rem; }
}
</style>
