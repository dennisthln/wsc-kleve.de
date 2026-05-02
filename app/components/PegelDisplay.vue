<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const { data: nauticalData, pending, error } = await useFetch<any>('/nautical-data')
const pegel = computed(() => nauticalData.value?.pegel)

const getStatusLabel = (state: string) => {
  switch (state) {
    case 'low': return 'Niedrigwasser'
    case 'normal': return 'Normaler Pegel'
    case 'high': return 'Hochwasser'
    case 'commented': return 'Störung'
    case 'out-dated': return 'Veraltet'
    default: return 'Normal'
  }
}

const getStatusColor = (state: string) => {
  switch (state) {
    case 'low': return '#f59e0b'
    case 'normal': return '#10b981'
    case 'high': return '#ef4444'
    default: return 'var(--color-primary)'
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '--:--'
  try {
    return new Date(dateStr).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return '--:--'
  }
}
</script>

<template>
  <div class="pegel-display-wrapper">
    <div v-if="pending" class="loading-state">
      <div class="pulse-loader"></div>
      <span>Lade Pegeldaten...</span>
    </div>

    <div v-else-if="error || !pegel" class="error-state">
      <div class="error-content">
        <span>⚠️ Pegel nicht abrufbar</span>
      </div>
    </div>

    <div v-else class="pegel-visual-group">
      <div class="status-badge" :style="{ backgroundColor: getStatusColor(pegel.stateMnwMhw) }">
        {{ getStatusLabel(pegel.stateMnwMhw) }}
      </div>
      <div class="pegel-main-row">
        <div class="pegel-value-group">
          <div class="pegel-main">
            <span class="value">{{ pegel.value }}</span>
            <span class="unit">cm</span>
          </div>
          <div class="pegel-meta">
            <span class="time">Stand: {{ formatDate(pegel.timestamp) }} Uhr</span>
          </div>
        </div>

        <!-- Trend Icon -->
        <div v-if="pegel.trend === 1 || pegel.trend === -1" class="pegel-trend-indicator" :class="{ 'rising': pegel.trend === 1, 'falling': pegel.trend === -1 }">
          <component :is="pegel.trend === 1 ? 'TrendingUp' : 'TrendingDown'" :size="48" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pegel-display-wrapper {
  width: 100%;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 100px;
  color: white;
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.pegel-main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pegel-main {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}

.value {
  font-family: var(--font-heading);
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-primary);
}

.unit {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.pegel-meta {
  margin-top: 0.25rem;
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.pegel-trend-indicator {
  padding: 0.5rem;
  opacity: 0.5;
}

.rising { color: #10b981; }
.falling { color: #ef4444; }

.loading-state, .error-state {
  padding: 2rem;
  text-align: center;
}

.pulse-loader {
  width: 12px;
  height: 12px;
  background-color: var(--color-accent);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 235, 255, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 235, 255, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 235, 255, 0); }
}

@media (max-width: 600px) {
  .pegel-main-row {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  .pegel-main { justify-content: center; }
}
</style>
