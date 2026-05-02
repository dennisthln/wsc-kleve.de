<script setup lang="ts">
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-vue-next'
</script>

<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="container footer-grid">
        <!-- Brand Section -->
        <div class="footer-brand">
          <img src="/logo-white.svg" class="footer-logo" />
          <p class="brand-desc">
            Ihr traditioneller Wassersportclub am Niederrhein. Erleben Sie Gemeinschaft, Natur und die Freiheit auf dem Wasser seit 1970.
          </p>
          <div class="social-links">
            <a href="#" class="social-icon"><Facebook :size="20" /></a>
            <a href="#" class="social-icon"><Instagram :size="20" /></a>
          </div>
        </div>
        
        <!-- Navigation Section -->
        <div class="footer-nav">
          <h4 class="footer-title">Navigation</h4>
          <ul class="nav-links">
            <li><NuxtLink to="/">Startseite</NuxtLink></li>
            <li><NuxtLink to="/news/aktuelles">Aktuelles</NuxtLink></li>
            <li><NuxtLink to="/verein">Der Verein</NuxtLink></li>
            <li><NuxtLink to="/antrag-liegeplatz" style="color: var(--color-accent); font-weight: 600;">Liegeplatz beantragen</NuxtLink></li>
            <li><NuxtLink to="/galerie">Galerie</NuxtLink></li>
            <li><NuxtLink to="/kontakt">Kontakt</NuxtLink></li>
          </ul>
        </div>

        <!-- Rechtliches Section -->
        <div class="footer-legal">
          <h4 class="footer-title">Rechtliches</h4>
          <ul class="nav-links">
            <li><NuxtLink to="/satzung">Satzung & Ordnungen</NuxtLink></li>
            <li><NuxtLink to="/impressum">Impressum</NuxtLink></li>
            <li><NuxtLink to="/datenschutz">Datenschutz</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact Section -->
        <div class="footer-contact">
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
        <div class="bottom-badges">
          <span>⚓ Made at Niederrhein</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-primary);
  color: white;
  padding-top: 6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 4rem;
  padding-bottom: 5rem;
}

.footer-logo {
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

.admin-link {
  color: var(--color-accent) !important;
  font-weight: 600;
  opacity: 1 !important;
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

.footer-logo {
  width: 120px;
}
</style>
