<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)
const isScrolled = ref(false)

// Fetch Navigation from CMS (Client only for stability)
const { cmsUrl } = useCmsApi()
const { data: navData } = await useFetch(() => cmsUrl('/globals/navigation'), {
  server: false,
  lazy: true
})


// Simplified flat navigation fallback
const fallbackNav = [
  { label: 'Startseite', link: '/' },
  { label: 'News', link: '/news/aktuelles' },
  { label: 'Verein', link: '/verein' },
  { label: 'Galerie', link: '/galerie' },
  { label: 'Kontakt', link: '/kontakt' },
]

const menuItems = computed(() => {
  if (navData.value?.items && navData.value.items.length > 0) {
    // We map to ensure children are ignored if they exist in CMS data for now
    return navData.value.items.map((item: any) => ({
      label: item.label,
      link: item.link
    }))
  }
  return fallbackNav
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  
  // Prevent scrolling when menu is open
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled || isMenuOpen, 'is-open': isMenuOpen }">
    <div class="container header-content">
      <NuxtLink to="/" class="logo" @click="closeMenu">
        <img src="/logo-white.svg" alt="WSC Kleve Logo" />
      </NuxtLink>

      <nav class="desktop-nav">
        <ul class="nav-list">
          <li v-for="item in menuItems" :key="item.label" class="nav-item">
            <NuxtLink :to="item.link" class="nav-link">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <NuxtLink to="/aufnahmeantrag" class="btn-cta desktop-only">Mitglied werden</NuxtLink>
        <button class="mobile-toggle" :class="{ 'is-active': isMenuOpen }" @click="toggleMenu" aria-label="Menu">
          <Menu v-if="!isMenuOpen" :size="32" />
          <X v-else :size="32" />
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Navigation Overlay -->
  <Transition name="mobile-menu">
    <nav v-if="isMenuOpen" class="mobile-nav">
      <!-- Subtle Wave Background -->
      <div class="nav-waves-bg">
        <div class="nav-wave-svg s1"></div>
        <div class="nav-wave-svg s2"></div>
      </div>

      <div class="mobile-nav-inner container">
        <div class="mobile-nav-content">
          <ul class="mobile-nav-links">
            <li v-for="(item, index) in menuItems" :key="item.label" 
                class="mobile-nav-li" 
                :style="{ transitionDelay: `${index * 80 + 150}ms` }">
              <NuxtLink :to="item.link" class="mobile-nav-a" @click="closeMenu">
                <span class="nav-number">0{{ index + 1 }}</span>
                <span class="nav-label">{{ item.label }}</span>
                <div class="active-line"></div>
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <div class="mobile-nav-bottom" :style="{ transitionDelay: `${menuItems.length * 80 + 250}ms` }">
          <NuxtLink to="/aufnahmeantrag" class="btn-membership" @click="closeMenu">
            Mitglied werden
            <div class="btn-glow"></div>
          </NuxtLink>
          <div class="nav-socials">
             <span class="nautical-coord">51°47'11.1"N 6°08'43.4"E</span>
          </div>
        </div>
      </div>
    </nav>
  </Transition>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  z-index: 2000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  display: flex;
  align-items: center;
  background: var(--color-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-scrolled {
  height: 70px;
  background: rgba(10, 36, 114, 0.98);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.header.is-open {
  background: var(--color-primary);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  display: flex;
}

.logo img {
  width: 60px;
  height: auto;
  transition: transform 0.3s ease;
}

.logo:hover img {
  transform: scale(1.05);
}

.nav-list {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-link {
  font-weight: 600;
  font-size: 0.95rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
}

.nav-link:hover, .router-link-active.nav-link {
  opacity: 1;
  color: var(--color-accent);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-cta {
  background: var(--color-accent);
  color: var(--color-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 235, 255, 0.3);
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 2000;
  transition: transform 0.3s ease;
}

.mobile-toggle:active {
  transform: scale(0.9);
}

.mobile-nav {
  position: fixed;
  inset: 0;
  background: var(--color-primary);
  z-index: 1500;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nav-waves-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.3;
}

.nav-wave-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 250px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200"><path fill="%2300ebff" fill-opacity="0.2" d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 L1000,200 L0,200 Z"/></svg>');
  background-repeat: repeat-x;
  background-position: bottom;
  animation: wave-glide 15s linear infinite;
}

.s2 { animation-duration: 25s; opacity: 0.5; height: 300px; }

@keyframes wave-glide {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.mobile-nav-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 140px;
  padding-bottom: 40px;
  position: relative;
  z-index: 10;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mobile-nav-inner::-webkit-scrollbar {
  display: none;
}

.mobile-nav-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.mobile-nav-links {
  list-style: none;
  width: 100%;
}

.mobile-nav-li {
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.2, 1, 0.3, 1);
}

.mobile-menu-enter-active .mobile-nav-li {
  opacity: 1;
  transform: translateY(0);
}

.mobile-nav-a {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  color: white;
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
}

.nav-number {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--color-accent);
  opacity: 0.6;
}

.nav-label {
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -1px;
  transition: color 0.3s ease;
}

.active-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 4px;
  background: var(--color-accent);
  transition: width 0.4s ease;
}

.mobile-nav-a.router-link-active .nav-label {
  color: var(--color-accent);
}

.mobile-nav-a.router-link-active .active-line {
  width: 100%;
}

.mobile-nav-bottom {
  margin-top: 3rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.2, 1, 0.3, 1);
}

.mobile-menu-enter-active .mobile-nav-bottom {
  opacity: 1;
  transform: translateY(0);
}

.btn-membership {
  display: block;
  width: 100%;
  padding: 1.5rem;
  background: white;
  color: var(--color-primary);
  border-radius: 16px;
  font-weight: 800;
  font-size: 1.2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(0, 235, 255, 0.1), transparent);
  transform: translateX(-100%);
  animation: glow-slide 3s infinite;
}

@keyframes glow-slide {
  100% { transform: translateX(100%); }
}

.nav-socials {
  margin-top: 2rem;
  text-align: center;
}

.nautical-coord {
  font-family: monospace;
  font-size: 0.75rem;
  opacity: 0.4;
  letter-spacing: 2px;
}

@media (max-width: 992px) {
  .desktop-nav, .desktop-only { display: none; }
  .mobile-toggle { display: block; }
}

/* Transitions */
.mobile-menu-enter-active, .mobile-menu-leave-active {
  transition: opacity 0.5s ease;
}

.mobile-menu-enter-from, .mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-leave-to .mobile-nav-li {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
