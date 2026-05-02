<template>
  <div class="kontakt-page">
    <!-- Header Section -->
    <section class="page-header">
      <div class="container" v-animate-on-scroll>
        <h1 class="section-title">Kontakt</h1>
        <p class="section-subtitle">
          Hast du Fragen zum Verein, zur Steganlage oder möchtest du uns einfach kennenlernen? 
          Schreib uns eine Nachricht über das Kontaktformular.
        </p>
      </div>
    </section>

    <!-- Form Section -->
    <section class="contact-section">
      <div class="container">
        <FormContact />
      </div>
    </section>

    <!-- Info Section (Optional, analog zu anderen Seiten im WSCKL Design) -->
    <section class="contact-info-section">
      <div class="container">
        <div class="info-grid">
          <div class="info-item" v-animate-on-scroll="{ delay: 100 }">
            <div class="icon-wrapper">
              <MapPin :size="24" />
            </div>
            <h3>Standort</h3>
            <p>Postfach 1234<br>47533 Kleve</p>
          </div>
          <div class="info-item" v-animate-on-scroll="{ delay: 200 }">
            <div class="icon-wrapper">
              <Mail :size="24" />
            </div>
            <h3>E-Mail</h3>
            <p>info@wsc-kleve.de</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Mail } from 'lucide-vue-next'
// FormContact wird von Nuxt automatisch importiert
</script>

<style scoped>
.kontakt-page {
  padding-bottom: 8rem;
}

.page-header {
  padding: 8rem 0 6rem;
  background: linear-gradient(to bottom, var(--color-bg-alt), var(--color-bg));
  text-align: center;
}

.section-subtitle {
  color: var(--color-text-muted);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 1.5rem auto 0;
  line-height: 1.6;
}

.contact-section {
  margin-top: -4rem;
  position: relative;
  z-index: 10;
}

.contact-info-section {
  padding: 8rem 0 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  max-width: 800px;
  margin: 0 auto;
}

.info-item {
  text-align: center;
  padding: 2rem;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: var(--color-primary);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  margin: 0 auto 1.5rem;
  transform: rotate(-5deg);
}

.info-item h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.info-item p {
  color: var(--color-text-muted);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-header {
    padding: 6rem 0 5rem;
  }
  
  .contact-section {
    margin-top: -3rem;
  }
  
  .info-grid {
    gap: 2rem;
  }
}
</style>
