<script setup lang="ts">
import { Anchor, Ship, Waves, Users, Activity } from 'lucide-vue-next'
import PegelDisplay from './PegelDisplay.vue'

const props = defineProps<{
  blocks?: any[]
  indexMap?: number[]
}>()

const { editMode, selectedBlockIndex, selectBlock, user } = usePayloadCms()

const blockLabel = (block: any) => {
  const labels: Record<string, string> = {
    hero: 'Hero',
    pegel: 'Pegel',
    features: 'Features',
    content: 'Content',
    cta: 'CTA',
    info: 'Info',
    person: 'Person',
  }

  return labels[block.blockType] || block.blockType || 'Block'
}

const resolveBlockIndex = (index: number) => props.indexMap?.[index] ?? index

const selectEditableBlock = (index: number, event: MouseEvent) => {
  if (editMode.value && user.value) {
    event.preventDefault()
    event.stopPropagation()
    selectBlock(resolveBlockIndex(index))
  }
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'sailing': return Ship
    case 'anchor': return Anchor
    case 'waves': return Waves
    case 'users': return Users
    default: return Anchor
  }
}
</script>

<template>
  <div class="blocks-wrapper" v-if="blocks && blocks.length">
    <div v-for="(block, index) in blocks" :key="index">
      <div
        class="cms-block-shell"
        :class="{ 'is-editable': editMode && user, 'is-selected': selectedBlockIndex === resolveBlockIndex(index) }"
        @click="selectEditableBlock(index, $event)"
      >
        <div v-if="editMode && user" class="cms-block-label">
          {{ blockLabel(block) }}
        </div>

      <!-- HERO BLOCK -->
      <section v-if="block.blockType === 'hero'" class="hero-section">
        <div class="hero-bg" :style="{ backgroundImage: `url(${block.backgroundImage?.url || '/sportboot.png'})` }"></div>
        <div class="hero-overlay"></div>
        <div class="container hero-container" v-animate-on-scroll>
          <h1 class="hero-title">{{ block.title || 'WSCKL' }}</h1>
          <p class="hero-subtitle">{{ block.subtitle }}</p>
        </div>
      </section>

      <!-- PEGEL BLOCK -->
      <section v-else-if="block.blockType === 'pegel'" class="pegel-section section">
        <div class="container">
          <div class="pegel-card glass" v-animate-on-scroll>
            <div class="pegel-info">
              <Activity class="pegel-icon" />
              <div>
                <h3>{{ block.title }}</h3>
                <p>Station: {{ block.station }} (Rhein)</p>
              </div>
            </div>
            <PegelDisplay :station="block.station" />
          </div>
        </div>
      </section>

      <!-- FEATURES BLOCK -->
      <section v-else-if="block.blockType === 'features'" class="features-section section">
        <div class="container">
          <header class="section-header" v-animate-on-scroll>
            <h2 class="section-title">{{ block.heading }}</h2>
            <p class="section-subtitle">{{ block.subheading }}</p>
          </header>
          <div class="features-grid" v-if="block.features">
            <div v-for="(feature, fIndex) in block.features" :key="fIndex" 
                 class="feature-card" v-animate-on-scroll="{ delay: fIndex * 100 }">
              <div class="feature-icon-wrapper">
                <component :is="getIcon(feature.icon)" :size="32" class="feature-icon" />
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTENT BLOCK -->
      <section v-else-if="block.blockType === 'content'" class="content-section section" :class="{ 'bg-accent': block.accent }">
        <div class="container">
          <div class="content-card" :class="{ 'two-cols': block.columns === '2' }" v-animate-on-scroll>
            <div class="rich-text-wrapper">
               <div v-if="block.text && block.text.root">
                 <div v-for="(node, nIdx) in block.text.root.children" :key="nIdx" class="rich-node">
                   <component 
                     v-if="node.type === 'heading'" 
                     :is="node.tag" 
                     class="mb-4"
                     :class="{ 'mt-8': node.tag === 'h2', 'mt-6': node.tag === 'h3' }"
                   >
                     <template v-for="(child, cIdx) in node.children" :key="cIdx">
                        <span v-if="child.text">{{ child.text }}</span>
                     </template>
                   </component>

                   <p v-else-if="node.type === 'paragraph'" class="mb-4">
                     <template v-for="(child, cIdx) in node.children" :key="cIdx">
                       <br v-if="child.type === 'linebreak'" />
                       <span v-else-if="child.text" style="white-space: pre-line;">{{ child.text }}</span>
                     </template>
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA BLOCK -->
      <section v-else-if="block.blockType === 'cta'" class="cta-section section">
        <div class="container">
          <div class="cta-card glass" v-animate-on-scroll>
            <h2>{{ block.title }}</h2>
            <p>{{ block.description }}</p>
            <NuxtLink v-if="block.buttonLink" :to="block.buttonLink" class="btn btn-primary">
              {{ block.buttonLabel }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- INFO BLOCK -->
      <section v-else-if="block.blockType === 'info'" class="info-section section">
        <div class="container">
          <div class="info-grid">
            <div class="info-intro" v-animate-on-scroll>
              <h2 class="section-title">{{ block.heading }}</h2>
            </div>
            <div class="info-items" v-if="block.items">
              <div v-for="(item, iIdx) in block.items" :key="iIdx" 
                   class="info-card-item" v-animate-on-scroll="{ delay: iIdx * 100 }">
                <span class="info-label">{{ item.label }}</span>
                <span class="info-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PERSON BLOCK -->
      <section v-else-if="block.blockType === 'person'" class="person-section section">
        <div class="container">
          <div class="person-card glass" v-animate-on-scroll>
            <div class="person-img-wrapper" v-if="block.image">
              <img :src="block.image.url" :alt="block.name" class="person-img" />
            </div>
            <div class="person-info">
              <span class="person-role">{{ block.role }}</span>
              <h3 class="person-name">{{ block.name }}</h3>
              <div class="person-details">
                <p v-if="block.address" class="person-detail">📍 {{ block.address }}</p>
                <p v-if="block.phone" class="person-detail">📞 {{ block.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
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

.pegel-section { background: var(--color-bg); }
.pegel-card { background: white; padding: 2.5rem; border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-md); border-left: 6px solid var(--color-accent); }
.pegel-info { display: flex; align-items: center; gap: 1.5rem; }
.pegel-icon { color: var(--color-accent); width: 40px; height: 40px; }
.pegel-info h3 { margin-bottom: 0.25rem; }
.pegel-info p { color: var(--color-text-muted); font-size: 0.9rem; }

.hero-section { position: relative; height: 90vh; display: flex; align-items: center; overflow: hidden; color: white; }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; background-attachment: fixed; background-color: var(--color-primary); }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10, 36, 114, 0.6), rgba(10, 36, 114, 0.9)); }
.hero-container { position: relative; z-index: 10; text-align: center; width: 100%; }
.hero-title { font-size: clamp(3rem, 8vw, 6rem); line-height: 1; margin-bottom: 1.5rem; color: white; }
.hero-subtitle { font-size: clamp(1.2rem, 2vw, 1.8rem); max-width: 800px; margin: 0 auto; opacity: 0.9; }

.features-section { background: white; }
.section-header { text-align: center; margin-bottom: 5rem; }
.section-subtitle { color: var(--color-text-muted); font-size: 1.2rem; max-width: 600px; margin: 1.5rem auto 0; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2.5rem; }
.feature-card { padding: 3rem 2rem; background: var(--color-bg); border-radius: var(--radius-lg); transition: var(--transition); text-align: center; }
.feature-card:hover { transform: translateY(-10px); background: white; box-shadow: var(--shadow-md); }
.feature-icon-wrapper { width: 70px; height: 70px; background: var(--color-primary); color: var(--color-accent); display: flex; align-items: center; justify-content: center; border-radius: 20px; margin: 0 auto 2rem; transform: rotate(-5deg); transition: var(--transition); }

.content-section { background: white; }
.content-card { max-width: 900px; margin: 0 auto; font-size: 1.25rem; }
.bg-accent { background-color: var(--color-accent); color: var(--color-primary); }

.cta-section { background: var(--color-bg); }
.cta-card { padding: 5rem; border-radius: var(--radius-lg); text-align: center; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); color: white; }
.cta-card h2 { color: white; font-size: 3rem; margin-bottom: 1.5rem; }

.info-section { background: var(--color-bg-alt); }
.info-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 4rem; align-items: center; }
.info-items { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
.info-card-item { background: white; padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); transition: var(--transition); border-bottom: 4px solid transparent; }
.info-label { display: block; font-size: 0.8rem; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.5rem; }
.info-value { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--color-primary); }

.person-card { display: flex; align-items: center; gap: 2.5rem; padding: 3rem; background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); max-width: 900px; margin: 0 auto; }
.person-img-wrapper { width: 150px; height: 150px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 4px solid var(--color-bg-alt); }
.person-img { width: 100%; height: 100%; object-fit: cover; }
.person-role { display: inline-block; color: var(--color-secondary); font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.5rem; }
.person-name { font-size: 2.2rem; margin-bottom: 1.5rem; }
.person-details { display: grid; gap: 0.5rem; }
.person-detail { font-size: 1.1rem; color: var(--color-text-muted); }

@media (max-width: 768px) {
  .pegel-card { flex-direction: column; text-align: center; gap: 2rem; }
  .pegel-info { flex-direction: column; }
  .person-card { flex-direction: column; text-align: center; padding: 2rem; }
  .info-grid { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
}
</style>
