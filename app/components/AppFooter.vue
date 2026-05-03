<script setup lang="ts">
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-vue-next'
</script>

<template>
  <footer class="footer">
    <!-- Decorative Wave Overlay -->
    <div class="footer-wave">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
      </svg>
    </div>

    <div class="footer-top">
      <div class="container footer-grid">
        <!-- Brand Section -->
        <div class="footer-brand" v-animate-on-scroll="{ animation: 'fade-right' }">
          <img src="/logo-white.svg" class="footer-logo" />
          <p class="brand-desc">
            Dein traditioneller Wassersportclub am Niederrhein. Erlebe Gemeinschaft, Natur und die Freiheit auf dem Wasser seit 1970.
          </p>
          <div class="social-links">
            <a href="#" class="social-icon"><Facebook :size="20" /></a>
            <a href="#" class="social-icon"><Instagram :size="20" /></a>
          </div>
        </div>
        
        <!-- Navigation Section -->
        <div class="footer-nav" v-animate-on-scroll="{ animation: 'fade-up', delay: 100 }">
          <h4 class="footer-title">Navigation</h4>
          <ul class="nav-links">
            <li><NuxtLink to="/">Startseite</NuxtLink></li>
            <li><NuxtLink to="/verein">Der Verein</NuxtLink></li>
            <li><NuxtLink to="/antrag-liegeplatz">Liegeplatz beantragen</NuxtLink></li>
            <li><NuxtLink to="/kontakt">Kontakt</NuxtLink></li>
          </ul>
        </div>

        <!-- Rechtliches Section -->
        <div class="footer-legal" v-animate-on-scroll="{ animation: 'fade-up', delay: 200 }">
          <h4 class="footer-title">Rechtliches</h4>
          <ul class="nav-links">
            <li><NuxtLink to="/satzung">Satzung & Ordnungen</NuxtLink></li>
            <li><NuxtLink to="/impressum">Impressum</NuxtLink></li>
            <li><NuxtLink to="/datenschutz">Datenschutz</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact Section -->
        <div class="footer-contact" v-animate-on-scroll="{ animation: 'fade-left', delay: 300 }">
          <h4 class="footer-title">Kontakt</h4>
          <ul class="contact-info">
            <li><MapPin :size="18" class="icon" /> Griethausener Altrhein, Kleve</li>
            <li><Mail :size="18" class="icon" /> <a href="mailto:info@wsc-kleve.de">info@wsc-kleve.de</a></li>
            <li><Phone :size="18" class="icon" /> +49 (0) 123 456789</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container bottom-content">
        <p>&copy; {{ new Date().getFullYear() }} WSCKL - Wassersportclub Kleve e.V. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-primary);
  color: white;
  padding-top: 8rem;
  position: relative;
  overflow: hidden;
}

.footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.footer-wave svg {
  position: relative;
  display: block;
  width: calc(150% + 1.3px);
  height: 80px;
}

.footer-wave .shape-fill {
  fill: var(--color-bg);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 4rem;
  padding-bottom: 5rem;
}

.footer-logo {
  width: 120px;
  color: white;
  margin-bottom: 2rem;
}

.brand-desc {
  opacity: 0.7;
  max-width: 300px;
  line-height: 1.8;
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);
}

.social-icon:hover {
  background: var(--color-accent);
  color: var(--color-primary);
  transform: translateY(-3px);
}

.footer-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--color-accent);
}

.nav-links {
  list-style: none;
}

.nav-links li {
  margin-bottom: 1rem;
}

.nav-links a {
  opacity: 0.7;
  font-size: 0.95rem;
  transition: var(--transition);
}

.nav-links a:hover {
  opacity: 1;
  color: var(--color-accent);
  padding-left: 5px;
}

.contact-info {
  list-style: none;
}

.contact-info li {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
  font-size: 0.95rem;
}

.contact-info .icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.footer-bottom {
  padding: 2rem 0;
  background: rgba(0, 0, 0, 0.2);
  font-size: 0.85rem;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.6;
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .bottom-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
