<script setup lang="ts">
import { Cloud, Sun, CloudRain, CloudLightning, CloudSnow, Wind, Droplets } from 'lucide-vue-next'

const { data: nauticalData, pending, error } = await useFetch<any>('/nautical-data')
const weather = computed(() => nauticalData.value?.weather)

const getWeatherIcon = (code: number) => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return Sun // Clear sky
  if (code >= 1 && code <= 3) return Cloud // Mainly clear, partly cloudy, and overcast
  if (code >= 45 && code <= 48) return Cloud // Fog
  if (code >= 51 && code <= 67) return CloudRain // Drizzle, Rain
  if (code >= 71 && code <= 77) return CloudSnow // Snow
  if (code >= 80 && code <= 82) return CloudRain // Rain showers
  if (code >= 85 && code <= 86) return CloudSnow // Snow showers
  if (code >= 95 && code <= 99) return CloudLightning // Thunderstorm
  return Sun
}

const getWeatherLabel = (code: number) => {
  if (code === 0) return 'Klarer Himmel'
  if (code >= 1 && code <= 3) return 'Leicht bewölkt'
  if (code >= 45 && code <= 48) return 'Nebel'
  if (code >= 51 && code <= 55) return 'Nieselregen'
  if (code >= 61 && code <= 65) return 'Regen'
  if (code >= 71 && code <= 77) return 'Schneefall'
  if (code >= 80 && code <= 82) return 'Regenschauer'
  if (code >= 95) return 'Gewitter'
  return 'Sonnig'
}
</script>

<template>
  <div class="weather-display-wrapper">
    <div v-if="pending" class="loading-state">
      <div class="pulse-loader"></div>
    </div>

    <div v-else-if="error || !weather" class="error-state">
      <span>Wetter nicht verfügbar</span>
    </div>

    <div v-else class="weather-visual-group">
      <div class="status-badge">
        {{ getWeatherLabel(weather.weather_code) }}
      </div>

      <div class="weather-main-row">
        <div class="weather-temp-group">
          <div class="weather-main">
            <span class="value">{{ Math.round(weather.temperature_2m) }}</span>
            <span class="unit">°C</span>
          </div>
          <div class="weather-meta">
            Kleve (Hafen)
          </div>
        </div>

        <div class="weather-icon-box">
          <component :is="getWeatherIcon(weather.weather_code)" :size="64" class="weather-icon" />
        </div>
      </div>

      <div class="weather-details-grid">
        <div class="detail-item">
          <Wind :size="16" />
          <span>{{ Math.round(weather.wind_speed_10m) }} km/h</span>
        </div>
        <div class="detail-item">
          <Droplets :size="16" />
          <span>{{ weather.relative_humidity_2m }}% Luftf.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-display-wrapper {
  width: 100%;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 100px;
  background: var(--color-secondary);
  color: white;
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.weather-main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.weather-main {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
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

.weather-meta {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.weather-icon {
  color: var(--color-secondary);
}

.weather-details-grid {
  display: flex;
  gap: 1.25rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0,0,0,0.05);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.pulse-loader {
  width: 12px;
  height: 12px;
  background-color: var(--color-secondary);
  border-radius: 50%;
  margin: 2rem auto;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  70% { transform: scale(1.1); opacity: 0; }
  100% { transform: scale(0.95); opacity: 0; }
}

@media (max-width: 600px) {
  .weather-main-row {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
