<script setup lang="ts">
import { ChevronRight, FileText, Scale, Anchor, Calculator } from 'lucide-vue-next'

const { data: pageData } = await useFetch('/api/pages?where[slug][equals]=satzung')
const page = computed(() => pageData.value?.docs?.[0])

const toc = [
  { id: 'satzung', title: 'Satzung', icon: Scale },
  { id: 'jugend', title: 'Jugendordnung', icon: FileText },
  { id: 'steg', title: 'Stegordnung', icon: Anchor },
  { id: 'gebuehren', title: 'Gebührenordnung', icon: Calculator },
]

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const offset = 100
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = el.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
</script>

<template>
  <div class="satzung-page">
    <template v-if="page">
      <!-- Custom Hero for Legal Content -->
      <section class="legal-hero">
        <div class="container" v-animate-on-scroll>
          <div class="legal-badge">Dokumente & Rechtliches</div>
          <h1 class="hero-title">{{ page.title }}</h1>
          <p class="hero-subtitle">{{ page.layout[0]?.subtitle }}</p>
        </div>
      </section>

      <div class="container legal-container">
        <div class="legal-layout">
          <!-- Sidebar TOC -->
          <aside class="legal-sidebar">
            <div class="toc-card glass" v-animate-on-scroll>
              <h3>Inhaltsverzeichnis</h3>
              <nav class="toc-nav">
                <button 
                  v-for="item in toc" 
                  :key="item.id"
                  @click="scrollToSection(item.id)"
                  class="toc-item"
                >
                  <component :is="item.icon" :size="18" />
                  <span>{{ item.title }}</span>
                  <ChevronRight :size="14" class="ml-auto arrow" />
                </button>
              </nav>
            </div>
          </aside>

          <!-- Main Content -->
          <main class="legal-content">
            <div class="content-paper" v-animate-on-scroll>
              <div id="satzung" class="anchor-point"></div>
              <BlockRenderer v-if="page.layout[1]" :blocks="[page.layout[1]]" />
              
              <div id="jugend" class="anchor-point mt-20"></div>
              <BlockRenderer v-if="page.layout[2]" :blocks="[page.layout[2]]" />

              <div id="steg" class="anchor-point mt-20"></div>
              <BlockRenderer v-if="page.layout[3]" :blocks="[page.layout[3]]" />

              <div id="gebuehren" class="anchor-point mt-20"></div>
              <BlockRenderer v-if="page.layout[4]" :blocks="[page.layout[4]]" />
            </div>
          </main>
        </div>
      </div>
    </template>

    <div v-else class="container section text-center">
      <h1 class="mt-20">Satzung & Ordnungen</h1>
      <p>Lade rechtliche Dokumente...</p>
    </div>
  </div>
</template>

<style scoped>
.satzung-page {
  background: var(--color-bg-alt);
  padding-bottom: 8rem;
}

.legal-hero {
  padding: 10rem 0 6rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  text-align: center;
  margin-bottom: -4rem;
}

.legal-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: var(--color-accent);
  color: var(--color-primary);
  border-radius: 100px;
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: white;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.legal-container {
  position: relative;
  z-index: 10;
}

.legal-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  align-items: start;
}

.legal-sidebar {
  position: sticky;
  top: 100px;
}

.toc-card {
  padding: 2rem;
  border-radius: var(--radius-lg);
  background: white;
}

.toc-card h3 {
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toc-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
  width: 100%;
}

.toc-item:hover {
  background: var(--color-bg-alt);
  color: var(--color-secondary);
}

.toc-item .arrow {
  opacity: 0;
  transform: translateX(-5px);
  transition: var(--transition);
}

.toc-item:hover .arrow {
  opacity: 1;
  transform: translateX(0);
}

.content-paper {
  background: white;
  padding: 5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  line-height: 1.8;
}

.anchor-point {
  height: 0;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .legal-layout {
    grid-template-columns: 1fr;
  }
  .legal-sidebar {
    display: none;
  }
  .content-paper {
    padding: 3rem 2rem;
  }
}
</style>
