<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = defineProps<{
  station: string
}>()

const pegel = ref<any>(null)
const pending = ref(true)
const error = ref(false)

const loadPegelData = async () => {
  pending.value = true
  error.value = false
  
  try {
    const stationName = props.station.toUpperCase()
    const response = await fetch(`https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/${stationName}/W/currentmeasurement.json`)
    
    if (!response.ok) throw new Error('API Response not ok')
    
    const data = await response.json()
    if (data && typeof data.value !== 'undefined') {
      pegel.value = data
    } else {
      throw new Error('No data value found')
    }
  } catch (e) {
    console.error('Pegel API Error:', e)
    error.value = true
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadPegelData()
})

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
      <span>Lade Live-Daten...</span>
    </div>

    <div v-else-if="error || !pegel" class="error-state">
      <div class="error-content">
        <span>⚠️ Pegel nicht abrufbar</span>
      </div>
      <button @click="loadPegelData" class="retry-btn">Neu laden</button>
    </div>

    <div v-else class="pegel-visual-group">
      <div class="pegel-main-row">
        <div class="pegel-value-group">
          <div class="pegel-status-label" :style="{ color: getStatusColor(pegel.stateMnwMhw) }">
            {{ getStatusLabel(pegel.stateMnwMhw) }}
          </div>
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

.pegel-status-label {
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.pegel-main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pegel-main {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.value {
  font-family: var(--font-heading);
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-primary);
}

.unit {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.pegel-meta {
  margin-top: 0.5rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.pegel-trend-indicator {
  padding: 1rem;
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
