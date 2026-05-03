<script setup lang="ts">
import { Anchor, Ship, Waves, Users, Activity, ArrowRight, Phone, MapPin, Mail, ChevronRight, Cloud } from 'lucide-vue-next'
import PegelDisplay from './PegelDisplay.vue'
import WeatherDisplay from './WeatherDisplay.vue'
import EventsSection from './EventsSection.vue'
import NewsSection from './NewsSection.vue'

const props = defineProps<{
  blocks?: any[]
  indexMap?: number[]
}>()

// Fetch Board Members if board block is present
const { cmsUrl } = useCmsApi()
const hasBoardBlock = computed(() => props.blocks?.some(b => b.blockType === 'board'))
const { data: boardData } = await useFetch(() => cmsUrl('/board-members?sort=order'), {
  immediate: hasBoardBlock.value,
  watch: [hasBoardBlock]
})

const boardMembers = computed(() => boardData.value?.docs || [])

const { editMode, selectedBlockIndex, selectBlock, user } = usePayloadCms()

const blockLabel = (block: any) => {
  const labels: Record<string, string> = {
    hero: 'Hero',
    content: 'Textinhalt',
    features: 'Features/Teaser',
    imageGrid: 'Bilder-Raster',
    cta: 'Call to Action',
    info: 'Info-Boxen',
    pegel: 'Rheinpegel',
    person: 'Person/Vorstand',
    board: 'Vorstand-Liste',
    events: 'Termine',
    news: 'Neuigkeiten',
    contact: 'Kontaktformular',
    sponsors: 'Sponsoren'
  }
  return labels[block.blockType] || block.blockType
}

const resolveBlockIndex = (rendererIndex: number) => {
  return props.indexMap ? props.indexMap[rendererIndex] : rendererIndex
}

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    anchor: Anchor,
    ship: Ship,
    waves: Waves,
    users: Users,
    activity: Activity,
    sailing: Ship
  }
  return icons[iconName] || Anchor
}
</script>

<template>
  <div class="blocks-renderer">
    <div v-for="(block, index) in blocks" :key="index" class="cms-block-shell"
         :class="{ 'is-editable': editMode && user, 'is-selected': selectedBlockIndex === resolveBlockIndex(index) }"
         @click="user && selectBlock(resolveBlockIndex(index))">
      
      <div v-if="editMode && user" class="cms-block-label">
        {{ blockLabel(block) }}
      </div>

      <!-- HERO BLOCK -->
      <section v-if="block.blockType === 'hero'" 
               class="hero-section" 
               :class="{ 'is-beautiful': block.variant === 'beautiful' }">
        <div class="hero-bg" :style="{ backgroundImage: `url(${block.backgroundImage?.url || '/sportboot.png'})` }"></div>
        <div class="hero-overlay"></div>
        <div class="container hero-container" v-animate-on-scroll="{ animation: 'zoom-out', duration: 1200 }">
          <CmsEditableText
            tag="h1"
            class="hero-title"
            :block-index="resolveBlockIndex(index)"
            :path="['title']"
            :value="block.title || 'WSCKL'"
          />
          <CmsEditableText
            tag="p"
            class="hero-subtitle"
            :block-index="resolveBlockIndex(index)"
            :path="['subtitle']"
            :value="block.subtitle || ''"
            multiline
          />
        </div>
      </section>

      <!-- BOARD BLOCK -->
      <section v-else-if="block.blockType === 'board'" class="vorstand-section section">
        <div class="container">
          <header class="section-header text-center" v-animate-on-scroll="{ animation: 'fade-up' }">
            <CmsEditableText
              tag="h2"
              class="section-title"
              :block-index="resolveBlockIndex(index)"
              :path="['heading']"
              :value="block.heading || 'Unser Vorstand'"
            />
            <CmsEditableText
              tag="p"
              class="section-subtitle"
              :block-index="resolveBlockIndex(index)"
              :path="['subheading']"
              :value="block.subheading || ''"
              multiline
            />
          </header>

          <div class="vorstand-grid" v-if="boardMembers.length">
            <div v-for="(person, pIdx) in boardMembers" :key="person.id" 
                 class="vorstand-card glass hover-lift" v-animate-on-scroll="{ animation: 'fade-up', delay: pIdx * 100 }">
              <div class="vorstand-img-container">
                <img v-if="person.image" :src="person.image.url" :alt="person.name" class="vorstand-img" />
                <img v-else src="/logo.png" :alt="person.name" class="vorstand-img placeholder" />
                <div class="img-overlay"></div>
              </div>
              <div class="vorstand-info">
                <span class="role">{{ person.role }}</span>
                <h3>{{ person.name }}</h3>
                <p class="vorstand-desc">{{ person.description }}</p>
                
                <div class="vorstand-contact">
                  <div v-if="person.address" class="contact-item">
                    <MapPin :size="16" class="contact-icon" />
                    <span>{{ person.address }}</span>
                  </div>
                  <div v-if="person.phone" class="contact-item">
                    <Phone :size="16" class="contact-icon" />
                    <a :href="'tel:' + person.phone.replace(/\s/g, '')" class="contact-link">{{ person.phone }}</a>
                  </div>
                  <div v-if="person.email" class="contact-item">
                    <Mail :size="16" class="contact-icon" />
                    <a :href="'mailto:' + person.email" class="contact-link">{{ person.email }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EVENTS BLOCK -->
      <EventsSection v-else-if="block.blockType === 'events'" :limit="block.limit" />

      <!-- NEWS BLOCK -->
      <NewsSection v-else-if="block.blockType === 'news'" :limit="block.limit" />

      <!-- PEGEL & WETTER BLOCK -->
      <section v-else-if="block.blockType === 'pegel'" class="pegel-section section">
        <div class="container">
          <div class="pegel-weather-grid">
            <!-- Pegel Card -->
            <div class="pegel-card glass hover-lift" v-animate-on-scroll="{ animation: 'fade-right' }">
              <div class="pegel-info">
                <Activity class="pegel-icon" />
                <div>
                  <h3>{{ block.title }}</h3>
                  <p>Station: {{ block.station }} (Rhein)</p>
                </div>
              </div>
              <PegelDisplay :station="block.station" />
            </div>

            <!-- Weather Card -->
            <div class="pegel-card weather-card glass hover-lift" v-animate-on-scroll="{ animation: 'fade-left', delay: 150 }">
              <div class="pegel-info">
                <Cloud class="pegel-icon weather-icon" />
                <div>
                  <h3>Aktuelles Wetter</h3>
                  <p>Standort: Kleve am Altrhein</p>
                </div>
              </div>
              <WeatherDisplay />
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURES BLOCK -->
      <section v-else-if="block.blockType === 'features'" 
               class="features-section section"
               :class="{ 'is-overlap': block.variant === 'overlap' }">
        <div class="container">
          <header v-if="block.variant !== 'overlap'" class="section-header" v-animate-on-scroll="{ animation: 'fade-up' }">
            <CmsEditableText
              tag="h2"
              class="section-title"
              :block-index="resolveBlockIndex(index)"
              :path="['heading']"
              :value="block.heading || ''"
            />
            <CmsEditableText
              tag="p"
              class="section-subtitle"
              :block-index="resolveBlockIndex(index)"
              :path="['subheading']"
              :value="block.subheading || ''"
              multiline
            />
          </header>
          <div :class="block.variant === 'overlap' ? 'teaser-grid' : 'features-grid'" v-if="block.features">
            <component 
              :is="feature.link ? 'NuxtLink' : 'div'"
              v-for="(feature, fIndex) in block.features" :key="fIndex" 
              :to="feature.link"
              class="feature-card hover-lift" 
              :class="{ 'is-link': feature.link, 'glass': block.variant === 'overlap' }"
              v-animate-on-scroll="{ animation: 'fade-up', delay: fIndex * 100 }"
            >
              <div class="feature-icon-wrapper">
                <component :is="getIcon(feature.icon)" :size="32" class="feature-icon" />
              </div>
              <CmsEditableText
                tag="h3"
                :block-index="resolveBlockIndex(index)"
                :path="['features', fIndex, 'title']"
                :value="feature.title || ''"
              />
              <CmsEditableText
                tag="p"
                :block-index="resolveBlockIndex(index)"
                :path="['features', fIndex, 'description']"
                :value="feature.description || ''"
                multiline
              />
              <div v-if="feature.link" class="feature-link-indicator">
                <span>{{ block.variant === 'overlap' ? 'Mehr erfahren' : 'Entdecken' }}</span>
                <ArrowRight v-if="block.variant !== 'overlap'" :size="16" />
                <ChevronRight v-else :size="20" />
              </div>
            </component>
          </div>
        </div>
      </section>

      <!-- CONTENT BLOCK -->
      <section v-else-if="block.blockType === 'content'" class="content-section section" :class="{ 'bg-accent': block.accent }">
        <div class="container">
          <div class="content-card" :class="{ 'two-cols': block.columns === '2' }" v-animate-on-scroll="{ animation: 'fade-up' }">
            <div class="rich-text-wrapper">
               <div v-if="block.text && block.text.root">
                 <div v-for="(node, nIdx) in block.text.root.children" :key="nIdx" class="rich-node">
                   <CmsEditableText
                     v-if="node.type === 'heading'"
                     :tag="node.tag || 'h2'"
                     class="mb-4"
                     :class="{ 'mt-8': node.tag === 'h2', 'mt-6': node.tag === 'h3' }"
                     :block-index="resolveBlockIndex(index)"
                     :path="['text', 'root', 'children', nIdx, 'children', 0, 'text']"
                     :value="node.children?.find((child: any) => child.text)?.text || ''"
                     multiline
                   />

                   <CmsEditableText
                     v-else-if="node.type === 'paragraph'"
                     tag="p"
                     class="mb-4"
                     :block-index="resolveBlockIndex(index)"
                     :path="['text', 'root', 'children', nIdx, 'children', 0, 'text']"
                     :value="node.children?.find((child: any) => child.text)?.text || ''"
                     multiline
                   />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA BLOCK -->
      <section v-else-if="block.blockType === 'cta'" class="cta-section section">
        <div class="container">
          <div class="cta-card glass hover-lift" v-animate-on-scroll="{ animation: 'zoom-in' }">
            <CmsEditableText
              tag="h2"
              :block-index="resolveBlockIndex(index)"
              :path="['title']"
              :value="block.title || ''"
            />
            <CmsEditableText
              tag="p"
              class="mb-8 block opacity-90"
              :block-index="resolveBlockIndex(index)"
              :path="['description']"
              :value="block.description || ''"
              multiline
            />
            <NuxtLink v-if="block.buttonLink" :to="block.buttonLink" class="btn btn-primary">
              <CmsEditableText
                tag="span"
                :block-index="resolveBlockIndex(index)"
                :path="['buttonLabel']"
                :value="block.buttonLabel || ''"
              />
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- INFO BLOCK -->
      <section v-else-if="block.blockType === 'info'" class="info-section section">
        <div class="container">
          <div class="info-grid">
            <div class="info-intro" v-animate-on-scroll="{ animation: 'fade-right' }">
              <CmsEditableText
                tag="h2"
                class="section-title"
                :block-index="resolveBlockIndex(index)"
                :path="['heading']"
                :value="block.heading || ''"
              />
            </div>
            <div class="info-items" v-if="block.items">
              <div v-for="(item, iIdx) in block.items" :key="iIdx" 
                   class="info-card-item hover-lift" v-animate-on-scroll="{ animation: 'fade-left', delay: iIdx * 100 }">
                <CmsEditableText
                  tag="span"
                  class="info-label"
                  :block-index="resolveBlockIndex(index)"
                  :path="['items', iIdx, 'label']"
                  :value="item.label || ''"
                />
                <CmsEditableText
                  tag="span"
                  class="info-value"
                  :block-index="resolveBlockIndex(index)"
                  :path="['items', iIdx, 'value']"
                  :value="item.value || ''"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PERSON BLOCK -->
      <section v-else-if="block.blockType === 'person'" class="person-section section">
        <div class="container">
          <div class="person-card glass hover-lift" v-animate-on-scroll="{ animation: 'fade-up' }">
            <div class="person-img-wrapper" v-if="block.image">
              <img :src="block.image.url" :alt="block.name" class="person-img" />
            </div>
            <div class="person-info">
              <span class="person-role">
                <CmsEditableText
                  tag="span"
                  :block-index="resolveBlockIndex(index)"
                  :path="['role']"
                  :value="block.role || ''"
                />
              </span>
              <CmsEditableText
                tag="h3"
                class="person-name"
                :block-index="resolveBlockIndex(index)"
                :path="['name']"
                :value="block.name || ''"
              />
              <div class="person-details">
                <p v-if="block.address || editMode" class="person-detail">
                  <span>📍 </span>
                  <CmsEditableText
                    tag="span"
                    :block-index="resolveBlockIndex(index)"
                    :path="['address']"
                    :value="block.address || ''"
                    multiline
                  />
                </p>
                <p v-if="block.phone || editMode" class="person-detail">
                  <span>📞 </span>
                  <CmsEditableText
                    tag="span"
                    :block-index="resolveBlockIndex(index)"
                    :path="['phone']"
                    :value="block.phone || ''"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTACT BLOCK -->
      <section v-else-if="block.blockType === 'contact'" class="contact-section section">
        <div class="container">
          <header class="section-header text-center" v-animate-on-scroll="{ animation: 'fade-up' }">
            <CmsEditableText
              tag="h2"
              class="section-title"
              :block-index="resolveBlockIndex(index)"
              :path="['title']"
              :value="block.title || 'Schreiben Sie uns'"
            />
            <CmsEditableText
              tag="p"
              class="section-subtitle"
              :block-index="resolveBlockIndex(index)"
              :path="['description']"
              :value="block.description || 'Haben Sie Fragen? Wir freuen uns auf Ihre Nachricht.'"
              multiline
            />
          </header>
          <div class="max-w-2xl mx-auto" v-animate-on-scroll="{ animation: 'fade-up', delay: 200 }">
            <FormContact />
          </div>
        </div>
      </section>

      <!-- SPONSORS BLOCK -->
      <section v-else-if="block.blockType === 'sponsors'" class="sponsors-section section">
        <div class="container">
          <header class="section-header text-center" v-animate-on-scroll="{ animation: 'fade-up' }">
            <CmsEditableText
              tag="h2"
              class="section-title"
              :block-index="resolveBlockIndex(index)"
              :path="['heading']"
              :value="block.heading || 'Unsere Partner & Sponsoren'"
            />
          </header>
          <div class="sponsors-grid" v-if="block.sponsors">
            <component 
              :is="sponsor.link ? 'a' : 'div'"
              v-for="(sponsor, sIdx) in block.sponsors" :key="sIdx"
              :href="sponsor.link || undefined"
              target="_blank"
              class="sponsor-item"
              :class="{ 'is-link': sponsor.link }"
              v-animate-on-scroll="{ animation: 'zoom-in', delay: sIdx * 80 }"
            >
              <img v-if="sponsor.logo" :src="sponsor.logo.url" :alt="sponsor.name" class="sponsor-logo" />
              <span v-else class="sponsor-name-fallback">{{ sponsor.name }}</span>
            </component>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.cms-block-shell {
  position: relative;
}

.cms-block-shell.is-editable {
  cursor: pointer;
}

.cms-block-shell.is-editable::after {
  content: '';
  position: absolute;
  inset: 0.4rem;
  border: 2px dashed rgba(0, 119, 190, 0.18);
  border-radius: 1.2rem;
  pointer-events: none;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.cms-block-shell.is-editable:hover::after,
.cms-block-shell.is-selected::after {
  border-color: rgba(0, 119, 190, 0.75);
  background: rgba(0, 235, 255, 0.06);
}

.cms-block-label {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 20;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: rgba(6, 21, 63, 0.92);
  color: white;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  pointer-events: none;
}

.pegel-section { position: relative;
  z-index: 20;
  margin-top: -180px; padding: 4rem 0 !important;    margin-bottom: -60px; }
.pegel-weather-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.pegel-card { background: white; padding: 1.5rem 2rem; border-radius: var(--radius-md); display: flex; flex-direction: column; justify-content: center; box-shadow: var(--shadow-sm); border-left: 4px solid var(--color-accent); }
.weather-card { border-left-color: var(--color-secondary); }
.pegel-info { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.pegel-section { position: relative;
  z-index: 20;
  margin-top: -120px; padding: 2.5rem 0 !important;    margin-bottom: -30px; }
.pegel-weather-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.pegel-card { background: white; padding: 1.25rem 1.75rem; border-radius: 12px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 4px solid var(--color-accent); }
.weather-card { border-left-color: var(--color-secondary); }
.pegel-info { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.pegel-icon { color: var(--color-accent); width: 28px; height: 28px; flex-shrink: 0; }
.weather-icon { color: var(--color-secondary); }
.pegel-info h3 { margin-bottom: 0; font-size: 1rem; font-weight: 700; }
.pegel-info p { color: var(--color-text-muted); font-size: 0.75rem; margin: 0; }

.hero-section { position: relative; height: 70vh; min-height: 500px; display: flex; align-items: center; overflow: hidden; color: white; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.hero-section.is-beautiful { height: 60vh; min-height: 500px; margin-bottom: -60px; text-align: center; }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; background-attachment: fixed; background-color: var(--color-primary); }

@media (max-width: 1024px) {
  .hero-bg { background-attachment: scroll; }
}
.hero-section.is-beautiful .hero-bg { transform: scale(1.05); }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10, 36, 114, 0.6), rgba(10, 36, 114, 0.9)); }
.hero-section.is-beautiful .hero-overlay { background: linear-gradient(135deg, rgba(10, 36, 114, 0.85) 0%, rgba(0, 119, 190, 0.65) 100%); }
.hero-container { position: relative; z-index: 10; text-align: center; width: 100%; }
.hero-section.is-beautiful .hero-container { max-width: 800px; }
.hero-title {
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  line-height: 1.1;
  color: white; 
  word-wrap: break-word; 
  overflow-wrap: break-word; 
  hyphens: auto;
  max-width: 900px;
  margin: 0 auto 1rem;
}
.hero-section.is-beautiful .hero-title { 
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  text-shadow: 0 4px 20px rgba(0,0,0,0.3); 
}
.hero-subtitle { font-size: clamp(1.1rem, 1.8vw, 1.4rem); max-width: 800px; margin: 0 auto; opacity: 0.9; }
.hero-section.is-beautiful .hero-subtitle { font-size: clamp(1rem, 1.8vw, 1.2rem); text-shadow: 0 2px 10px rgba(0,0,0,0.2); }

/* Vorstand Styles */
.vorstand-section { background: white; padding-top: 6rem; padding-bottom: 6rem; position: relative; z-index: 10; }
.vorstand-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 3.5rem; }
.vorstand-card { border-radius: 16px; overflow: hidden; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); height: 100%; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,0.03); }
.vorstand-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(10, 36, 114, 0.1); }
.vorstand-img-container { position: relative; height: 220px; overflow: hidden; background: var(--color-bg-alt); }
.vorstand-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.vorstand-img.placeholder { object-fit: contain; padding: 2.5rem; opacity: 0.1; filter: grayscale(1); }
.vorstand-card:hover .vorstand-img { transform: scale(1.1); }
.vorstand-info { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
.role { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--color-secondary); margin-bottom: 0.5rem; display: block; }
.vorstand-info h3 { font-size: 1.25rem; margin-bottom: 0.75rem; color: var(--color-primary); font-weight: 700; }
.vorstand-desc { font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.5; margin-bottom: 1.25rem; flex: 1; }
.vorstand-contact { padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 0.5rem; }
.contact-item { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.85rem; color: var(--color-text); }
.contact-icon { color: var(--color-secondary); flex-shrink: 0; margin-top: 0.2rem; }
.contact-link { font-weight: 600; color: var(--color-primary); transition: color 0.3s ease; }
.contact-link:hover { color: var(--color-secondary); }

.section-header { text-align: center; margin-bottom: 10px; }
.section-subtitle { color: var(--color-text-muted); font-size: 1.1rem; max-width: 600px; margin: 1.25rem auto 0; }
.features-section.is-overlap { position: relative; z-index: 20; padding-bottom: 4rem; margin-top: -120px; }
.teaser-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.feature-card.glass { padding: 2.5rem 2rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 10px 30px rgba(10, 36, 114, 0.08); border-radius: 16px; }
.feature-card.glass:hover { transform: translateY(-10px); box-shadow: 0 25px 50px rgba(10, 36, 114, 0.15); background: white; }
.feature-card.glass .feature-icon-wrapper { width: 65px; height: 65px; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); color: white; border-radius: 18px; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.feature-card.glass:hover .feature-icon-wrapper { transform: rotate(0deg) scale(1.05); }
.feature-card.glass h3 { font-size: 1.4rem; margin-bottom: 0.75rem; color: var(--color-primary); }
.feature-card.glass .feature-link-indicator { opacity: 1; transform: none; margin-top: 1.75rem; color: var(--color-secondary); font-size: 1rem; }
.feature-card.glass:hover .feature-link-indicator { gap: 0.75rem; color: var(--color-primary); }

.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; margin-top: 25px; }
.feature-card { padding: 1.5rem; background: var(--color-bg); border-radius: 16px; transition: var(--transition); text-align: center; color: inherit; }
.feature-card.is-link:hover { transform: translateY(-8px); background: white; box-shadow: 0 8px 25px rgba(0,0,0,0.05); }
.feature-icon-wrapper { width: 60px; height: 60px; background: var(--color-primary); color: var(--color-accent); display: flex; align-items: center; justify-content: center; border-radius: 16px; margin: 0 auto 1.5rem; transform: rotate(-5deg); transition: var(--transition); }
.feature-link-indicator { margin-top: 1.25rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: var(--color-secondary); font-weight: 700; font-size: 0.85rem; opacity: 0; transform: translateY(10px); transition: var(--transition); }
.feature-card.is-link:hover .feature-link-indicator { opacity: 1; transform: translateY(0); }

.content-section { background: white; padding: 4rem 0 !important; }
.content-card { max-width: 800px; margin: 0 auto; font-size: 1.15rem; }
.bg-accent { background-color: var(--color-accent); color: var(--color-primary); }

.cta-section { background: var(--color-bg); padding: 4rem 0 !important; }
.cta-card { padding: 2.5rem 2rem; border-radius: 20px; text-align: center; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); color: white; }
.cta-card h2 { color: white; font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 1.25rem; }
.cta-card p { font-size: clamp(1rem, 2.5vw, 1.25rem); margin-bottom: 2rem; }
.cta-card .btn { margin-top: 0.5rem; }

.info-section { background: var(--color-bg-alt); padding: 4rem 0 !important; }
.info-grid { display: grid; grid-template-columns: 1fr 2.5fr; gap: 3rem; align-items: center; }
.info-items { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; }
.info-card-item { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); transition: var(--transition); border-bottom: 4px solid transparent; }
.info-label { display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.4rem; letter-spacing: 1px; }
.info-value { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: var(--color-primary); }

.person-card { display: flex; align-items: center; gap: 2rem; padding: 2rem; background: white; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 800px; margin: 0 auto; }
.person-img-wrapper { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 3px solid var(--color-bg-alt); }
.person-img { width: 100%; height: 100%; object-fit: cover; }
.person-role { display: inline-block; color: var(--color-secondary); font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.4rem; }
.person-name { font-size: 1.8rem; margin-bottom: 1rem; }
.person-details { display: grid; gap: 0.4rem; }
.person-detail { font-size: 1rem; color: var(--color-text-muted); }

.contact-section { background: white; padding: 5rem 0 !important; }
.max-w-2xl { max-width: 42rem; }
.mx-auto { margin-left: auto; margin-right: auto; }

/* Sponsors Styles */
.sponsors-section { padding: 5rem 0 !important; }
.sponsors-grid { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 3rem; margin-top: 3.5rem; }
.sponsor-item { display: block; max-width: 160px; transition: all 0.3s ease; filter: grayscale(1); opacity: 0.5; }
.sponsor-item:hover { filter: grayscale(0); opacity: 1; transform: scale(1.05); }
.sponsor-logo { width: 100%; height: auto; object-fit: contain; max-height: 60px; }
.sponsor-name-fallback { font-weight: 700; font-size: 1.1rem; color: var(--color-primary); }

@media (max-width: 992px) {
  .pegel-weather-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .pegel-card { padding: 1.5rem; }
}

@media (max-width: 768px) {
  .pegel-card { text-align: center; }
  .pegel-info { flex-direction: column; text-align: center; gap: 0.75rem; }
  .person-card { flex-direction: column; text-align: center; padding: 1.5rem; }
  .info-grid { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
}
</style>
