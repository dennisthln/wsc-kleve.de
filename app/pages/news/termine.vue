<script setup lang="ts">
import { MapPin, Clock, Calendar } from 'lucide-vue-next'

const { data: events, pending } = await useFetch<any>('/api/events?sort=date')

const getDay = (date: string) => new Date(date).getDate()
const getMonth = (date: string) => new Date(date).toLocaleDateString('de-DE', { month: 'short' })
const getYear = (date: string) => new Date(date).getFullYear()
const getTime = (date: string) => new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <div class="termine-page">
    <section class="page-header">
      <div class="container" v-animate-on-scroll>
        <h1 class="section-title">Termine & Events</h1>
        <p class="section-subtitle">Alle Veranstaltungen des WSCKL für das aktuelle Jahr.</p>
      </div>
    </section>

    <section class="termine-list section">
      <div class="container">
        <div v-if="pending" class="loading">Lade Termine...</div>
        <div v-else-if="events?.docs?.length" class="events-grid">
          <div 
            v-for="(event, idx) in events.docs" 
            :key="event.id" 
            class="event-card glass"
            v-animate-on-scroll="{ delay: idx * 100 }"
          >
            <div class="event-date-side">
              <span class="day">{{ getDay(event.date) }}</span>
              <span class="month">{{ getMonth(event.date) }}</span>
              <span class="year">{{ getYear(event.date) }}</span>
            </div>
            <div class="event-main">
              <div class="event-header">
                <h2>{{ event.title }}</h2>
                <div class="event-meta">
                  <span v-if="event.location"><MapPin :size="16" /> {{ event.location }}</span>
                  <span><Clock :size="16" /> {{ getTime(event.date) }} Uhr</span>
                </div>
              </div>
              <p class="event-desc">{{ event.description }}</p>
            </div>
          </div>
        </div>
        <div v-else class="empty-state text-center">
          <Calendar :size="48" class="mb-4 opacity-20" />
          <p>Aktuell sind keine Termine eingetragen.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.termine-page { background: var(--color-bg); }

.page-header {
  padding: 8rem 0 6rem;
  background: linear-gradient(to bottom, var(--color-bg-alt), var(--color-bg));
  text-align: center;
}

.section-subtitle { color: var(--color-text-muted); font-size: 1.2rem; max-width: 600px; margin: 1.5rem auto 0; }

.events-grid { display: flex; flex-direction: column; gap: 2rem; max-width: 1000px; margin: 0 auto; }

.event-card {
  display: flex;
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
}

.event-card:hover { transform: translateX(10px); box-shadow: var(--shadow-md); }

.event-date-side {
  background: var(--color-primary);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  padding: 2rem;
}

.event-date-side .day { font-size: 2.5rem; font-weight: 800; line-height: 1; }
.event-date-side .month { font-size: 1.1rem; font-weight: 600; text-transform: uppercase; margin: 0.25rem 0; }
.event-date-side .year { font-size: 0.9rem; opacity: 0.6; }

.event-main { padding: 3rem; flex: 1; }
.event-header h2 { font-size: 1.8rem; margin-bottom: 1rem; color: var(--color-primary); }

.event-meta { display: flex; gap: 2rem; margin-bottom: 1.5rem; color: var(--color-secondary); font-weight: 600; font-size: 0.95rem; }
.event-meta span { display: flex; align-items: center; gap: 0.6rem; }

.event-desc { line-height: 1.7; color: var(--color-text-muted); }

@media (max-width: 768px) {
  .event-card { flex-direction: column; }
  .event-date-side { flex-direction: row; gap: 1rem; min-width: auto; padding: 1rem; }
  .event-main { padding: 2rem; }
}
</style>
