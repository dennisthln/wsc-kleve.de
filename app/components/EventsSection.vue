<template>
  <section class="events-section section">
    <div class="container">
      <div class="events-layout">
        <div class="events-info" v-animate-on-scroll="{ animation: 'fade-right' }">
          <span class="badge">Termine</span>
          <h2 class="section-title">Anstehende Events</h2>
          <p class="section-subtitle">
            Verpassen Sie kein Highlight! Hier finden Sie alle wichtigen Daten für die aktuelle Saison im Überblick.
            Ob Regatta, Sommerfest oder Versammlung – bleiben Sie am Ball.
          </p>
          <div class="cta-wrapper">
            <NuxtLink to="/news/termine" class="btn btn-primary">Alle Termine ansehen</NuxtLink>
          </div>
        </div>

        <div class="events-list">
          <div v-if="pending" class="loading">Lade Termine...</div>
          <div v-else-if="events?.docs?.length">
            <NuxtLink 
              v-for="(event, idx) in events.docs.slice(0, 4)" 
              :key="event.id" 
              to="/news/termine"
              class="event-item"
              v-animate-on-scroll="{ animation: 'fade-left', delay: idx * 100 }"
            >
              <div class="event-date">
                <span class="day">{{ new Date(event.date).getDate() }}</span>
                <span class="month">{{ getMonth(event.date) }}</span>
              </div>
              <div class="event-details">
                <h3>{{ event.title }}</h3>
                <div class="event-meta">
                  <span v-if="event.location"><MapPin :size="14" /> {{ event.location }}</span>
                  <span><Clock :size="14" /> {{ getTime(event.date) }} Uhr</span>
                </div>
              </div>
              <ArrowRight class="event-arrow" />
            </NuxtLink>
          </div>
          <div v-else class="no-events-card glass">
            <Calendar :size="32" class="mb-4 opacity-30" />
            <p>Aktuell keine Termine geplant.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MapPin, Clock, ArrowRight, Calendar } from 'lucide-vue-next'

const props = defineProps<{
  limit?: number
}>()

const { cmsUrl } = useCmsApi()
const { data: events, pending } = await useFetch<any>(() => cmsUrl(`/events?sort=date&limit=${props.limit || 4}`))

const getMonth = (date: string) => {
  return new Date(date).toLocaleDateString('de-DE', { month: 'short' }).toUpperCase()
}

const getTime = (date: string) => {
  return new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.events-section { 
  background-color: var(--color-bg-alt); 
}

.events-layout {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 8rem;
  align-items: center;
}

.section-title {
  margin-bottom: 2rem;
  display: block;
}

.section-subtitle {
  color: var(--color-text-muted);
  font-size: 1.15rem;
  line-height: 1.7;
  max-width: 450px;
}

.cta-wrapper {
  margin-top: 3rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.75rem 2rem;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  text-decoration: none;
  color: inherit;
  border: 1px solid transparent;
}

.event-item:hover {
  transform: translateX(10px);
  border-color: var(--color-accent);
  box-shadow: var(--shadow-md);
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  min-width: 80px;
  height: 80px;
  border-radius: 16px;
  flex-shrink: 0;
}

.event-date .day { font-size: 1.75rem; font-weight: 800; line-height: 1; }
.event-date .month { font-size: 0.8rem; font-weight: 700; opacity: 0.8; margin-top: 0.25rem; }

.event-details {
  flex: 1;
}

.event-details h3 { 
  font-size: 1.3rem; 
  margin-bottom: 0.5rem; 
  color: var(--color-primary);
}

.event-meta { 
  display: flex; 
  gap: 1.5rem; 
  color: var(--color-text-muted); 
  font-size: 0.9rem; 
}

.event-meta span { 
  display: flex; 
  align-items: center; 
  gap: 0.5rem; 
}

.event-arrow { 
  color: var(--color-accent); 
  opacity: 0; 
  transition: var(--transition); 
}

.event-item:hover .event-arrow { 
  opacity: 1; 
  transform: translateX(5px); 
}

.no-events-card {
  text-align: center;
  padding: 4rem;
  border-radius: var(--radius-lg);
  color: var(--color-text-muted);
}

@media (max-width: 1200px) {
  .events-layout { gap: 4rem; }
}

@media (max-width: 992px) {
  .events-layout { grid-template-columns: 1fr; gap: 5rem; }
  .events-info { text-align: center; display: flex; flex-direction: column; align-items: center; }
  .section-subtitle { max-width: 600px; }
}

@media (max-width: 600px) {
  .event-item { padding: 1.25rem; gap: 1.25rem; }
  .event-date { min-width: 70px; height: 70px; }
  .event-meta { flex-direction: column; gap: 0.5rem; }
}
</style>
