<script setup lang="ts">
import { Anchor, Home, ArrowLeft, Ship } from 'lucide-vue-next'

const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-page">
    <div class="error-background">
      <div class="waves-container">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
      </div>
    </div>

    <div class="container error-content">
      <div class="visual-area" v-animate-on-scroll>
        <div class="drifting-ship">
          <Ship :size="120" stroke-width="1" />
        </div>
        <div class="anchor-drop">
          <Anchor :size="48" class="floating-anchor" />
        </div>
      </div>

      <h1 class="error-code">{{ error?.statusCode || '404' }}</h1>
      <h2 class="error-title">Vom Kurs abgekommen?</h2>
      
      <p class="error-message">
        <template v-if="error?.statusCode === 404">
          Die gesuchte Seite scheint in den Tiefen des Altrheins verschwunden zu sein. 
          Vielleicht wurde sie verschoben oder der Link ist veraltet.
        </template>
        <template v-else>
          Hoppla! Da ist wohl etwas über Bord gegangen. Wir arbeiten bereits daran, den Fehler zu beheben.
        </template>
      </p>

      <div class="error-actions">
        <button @click="handleError" class="btn btn-primary">
          <Home :size="20" />
          <span>Zur Startseite</span>
        </button>
        <NuxtLink to="/kontakt" class="btn btn-outline">
          <Anchor :size="20" />
          <span>Kontaktiere uns</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.error-background {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.waves-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 200px;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200"><path fill="%230077be" fill-opacity="0.4" d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 L1000,200 L0,200 Z"/></svg>');
  background-repeat: repeat-x;
  background-position: bottom;
  animation: wave-move 10s linear infinite;
}

.wave2 {
  animation: wave-move 15s linear infinite;
  opacity: 0.6;
  height: 120%;
}

.wave3 {
  animation: wave-move 20s linear infinite;
  opacity: 0.3;
  height: 140%;
}

@keyframes wave-move {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.error-content {
  position: relative;
  z-index: 10;
  max-width: 600px;
  padding: 2rem;
}

.visual-area {
  margin-bottom: 2rem;
  position: relative;
}

.drifting-ship {
  color: var(--color-accent);
  animation: drift 6s ease-in-out infinite;
}

.anchor-drop {
  position: absolute;
  bottom: -20px;
  right: 35%;
  color: white;
  opacity: 0.5;
}

.floating-anchor {
  animation: anchor-float 4s ease-in-out infinite;
}

@keyframes drift {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, 10px) rotate(5deg); }
  75% { transform: translate(-15px, 5px) rotate(-5deg); }
}

@keyframes anchor-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(15px); }
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
  background: linear-gradient(to bottom, white, rgba(255,255,255,0.2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.8;
}

.error-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.error-message {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 100px;
  font-weight: 700;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-accent);
  color: var(--color-primary);
  border: none;
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
}

.btn-outline:hover {
  border-color: var(--color-accent);
  background: rgba(0, 235, 255, 0.1);
}

@media (max-width: 600px) {
  .error-code { font-size: 5rem; }
  .error-title { font-size: 1.8rem; }
  .error-actions { flex-direction: column; }
}
</style>
