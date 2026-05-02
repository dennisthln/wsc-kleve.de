<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Menu, X, ChevronDown } from 'lucide-vue-next'

const isMenuOpen = ref(false)
const activeDropdown = ref<string | null>(null)
const isScrolled = ref(false)

// Fetch Navigation from CMS (Client only for stability)
const { data: navData } = await useFetch('http://localhost:3000/api/globals/navigation', {
  server: false,
  lazy: true
})

// Fallback if CMS is empty
const fallbackNav = [
  { label: 'Startseite', link: '/' },
  { label: 'News', link: '/news/aktuelles' },
  { 
    label: 'Verein', 
    link: '/verein',
    children: [
      { label: 'Mitglied werden', link: '/aufnahmeantrag' },
      { label: 'Liegeplatz beantragen', link: '/antrag-liegeplatz' },
      { label: 'Satzung & Gebühren', link: '/satzung' }
    ]
  },
  { label: 'Galerie', link: '/galerie' },
  { label: 'Kontakt', link: '/kontakt' },
]

const menuItems = computed(() => {
  if (navData.value?.items && navData.value.items.length > 0) {
    return navData.value.items
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
  if (!isMenuOpen.value) activeDropdown.value = null
  
  // Prevent scrolling when menu is open
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const toggleDropdown = (name: string) => {
  activeDropdown.value = activeDropdown.value === name ? null : name
}

const closeMenu = () => {
  isMenuOpen.value = false
  activeDropdown.value = null
  document.body.style.overflow = ''
}
</script>

<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled || isMenuOpen, 'is-open': isMenuOpen }">
    <div class="container header-content">
      <NuxtLink to="/" class="logo" @click="closeMenu">
        <img src="/logo.png" alt="WSC Kleve Logo" />
      </NuxtLink>

      <nav class="desktop-nav">
        <ul class="nav-list">
          <li v-for="item in menuItems" :key="item.label" class="nav-item">
            <template v-if="item.children && item.children.length > 0">
              <button class="nav-link dropdown-toggle" @click="toggleDropdown(item.label)">
                {{ item.label }}
                <ChevronDown :size="14" />
              </button>
              <Transition name="fade-slide">
                <ul v-if="activeDropdown === item.label" class="dropdown-menu glass">
                  <li v-for="child in item.children" :key="child.label">
                    <NuxtLink :to="child.link" class="dropdown-link" @click="closeMenu">
                      {{ child.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </Transition>
            </template>
            <NuxtLink v-else :to="item.link" class="nav-link">
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

    <!-- Mobile Navigation Overlay -->
    <Transition name="mobile-menu-fade">
      <nav v-if="isMenuOpen" class="mobile-nav">
        <div class="mobile-nav-container container">
          <ul class="mobile-nav-list">
            <li v-for="(item, index) in menuItems" :key="item.label" 
                class="mobile-nav-item" 
                :style="{ transitionDelay: `${index * 50}ms` }">
              
              <template v-if="item.children && item.children.length > 0">
                <div class="mobile-nav-parent" @click="toggleDropdown(item.label)">
                  <span>{{ item.label }}</span>
                  <ChevronDown :size="24" :class="{ rotated: activeDropdown === item.label }" />
                </div>
                <Transition name="expand">
                  <ul v-if="activeDropdown === item.label" class="mobile-sub-list">
                    <li v-for="child in item.children" :key="child.label">
                      <NuxtLink :to="child.link" class="mobile-sub-link" @click="closeMenu">
                        {{ child.label }}
                      </NuxtLink>
                    </li>
                  </ul>
                </Transition>
              </template>
              
              <NuxtLink v-else :to="item.link" class="mobile-nav-link" @click="closeMenu">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
          
          <div class="mobile-nav-footer">
            <NuxtLink to="/aufnahmeantrag" class="btn-cta full-width" @click="closeMenu">
              Jetzt Mitglied werden
            </NuxtLink>
          </div>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  z-index: 1000;
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

.nav-link, .dropdown-toggle {
  font-weight: 600;
  font-size: 0.95rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  background: none;
  border: none;
  color: white;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
}

.nav-link:hover, .dropdown-toggle:hover {
  opacity: 1;
  color: var(--color-accent);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  padding: 1rem 0;
  min-width: 240px;
  background: white;
  border-radius: 12px;
  margin-top: 1rem;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.dropdown-link {
  display: block;
  padding: 0.8rem 1.5rem;
  font-weight: 500;
  color: var(--color-primary);
  transition: all 0.2s ease;
}

.dropdown-link:hover {
  background: rgba(10, 36, 114, 0.05);
  color: var(--color-primary);
  padding-left: 1.8rem;
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
  padding-top: 100px;
  z-index: 1500;
  display: flex;
  flex-direction: column;
}

.mobile-nav-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
  overflow-y: auto;
}

.mobile-nav-list {
  list-style: none;
  margin-bottom: 2rem;
}

.mobile-nav-item {
  opacity: 1;
  transform: none;
}

.mobile-nav-link, .mobile-nav-parent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.mobile-nav-parent .rotated {
  transform: rotate(180deg);
}

.mobile-sub-list {
  background: rgba(255, 255, 255, 0.05);
  margin: 0 -1rem;
  padding: 0.5rem 1rem;
  overflow: hidden;
}

.mobile-sub-link {
  display: block;
  padding: 1rem 0;
  font-size: 1.2rem;
  font-weight: 500;
  opacity: 0.8;
  color: white;
}

.mobile-nav-footer {
  margin-top: auto;
  padding-top: 2rem;
}

.full-width {
  display: block;
  width: 100%;
}

@media (max-width: 992px) {
  .desktop-nav, .desktop-only { display: none; }
  .mobile-toggle { display: block; }
}

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.mobile-menu-fade-enter-active, .mobile-menu-fade-leave-active {
  transition: all 0.4s ease;
}
.mobile-menu-fade-enter-from, .mobile-menu-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 500px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
