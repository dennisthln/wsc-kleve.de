<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const {
  editMode,
  currentPage,
  discardDraft,
  hasDraftChanges,
  replaceSelectedBlock,
  saveDraft,
  saving,
  selectedBlock,
  selectedBlockIndex,
} = usePayloadCms()

const cloneValue = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const blockTypeLabels: Record<string, string> = {
  hero: 'Hero',
  pegel: 'Pegel',
  features: 'Features',
  content: 'Content',
  cta: 'CTA',
  info: 'Info',
  person: 'Person',
}

const visible = computed(() => editMode.value && selectedBlockIndex.value !== null && !!selectedBlock.value)
const blockTitle = computed(() => {
  if (!selectedBlock.value) {
    return null
  }

  return blockTypeLabels[selectedBlock.value.blockType] || selectedBlock.value.blockType || 'Block'
})

const blockDraft = ref<any | null>(null)
const isSyncingLocalDraft = ref(false)

watch(
  () => [currentPage.value?.id, selectedBlockIndex.value],
  () => {
    isSyncingLocalDraft.value = true
    blockDraft.value = selectedBlock.value ? cloneValue(selectedBlock.value) : null
    queueMicrotask(() => {
      isSyncingLocalDraft.value = false
    })
  },
  { immediate: true },
)

watch(
  blockDraft,
  (value) => {
    if (isSyncingLocalDraft.value || !value || selectedBlockIndex.value === null) {
      return
    }

    replaceSelectedBlock(value)
  },
  { deep: true },
)
</script>

<template>
  <aside v-if="visible" class="cms-inline-editor glass">
    <div class="editor-head">
      <div>
        <div class="editor-kicker">Inline Editor</div>
        <strong>{{ blockTitle }}</strong>
      </div>
      <button class="editor-save" type="button" @click="saveDraft" :disabled="saving">
        {{ saving ? 'Speichert…' : 'Speichern' }}
      </button>
    </div>

    <div v-if="blockDraft?.blockType === 'hero'" class="editor-fields">
      <label>
        <span>Titel</span>
        <input v-model="blockDraft.title" />
      </label>
      <label>
        <span>Untertitel</span>
        <textarea v-model="blockDraft.subtitle" rows="3" />
      </label>
    </div>

    <div v-else-if="blockDraft?.blockType === 'pegel'" class="editor-fields">
      <label>
        <span>Titel</span>
        <input v-model="blockDraft.title" />
      </label>
      <label>
        <span>Station</span>
        <select v-model="blockDraft.station">
          <option value="EMMERICH">Emmerich</option>
          <option value="REES">Rees</option>
          <option value="DUESSELDORF">Düsseldorf</option>
        </select>
      </label>
    </div>

    <div v-else-if="blockDraft?.blockType === 'features'" class="editor-fields">
      <label>
        <span>Überschrift</span>
        <input v-model="blockDraft.heading" />
      </label>
      <label>
        <span>Unterzeile</span>
        <textarea v-model="blockDraft.subheading" rows="3" />
      </label>
      <div v-for="(feature, index) in blockDraft.features || []" :key="feature.id || index" class="editor-group">
        <strong>Feature {{ index + 1 }}</strong>
        <label>
          <span>Titel</span>
          <input v-model="feature.title" />
        </label>
        <label>
          <span>Beschreibung</span>
          <textarea v-model="feature.description" rows="3" />
        </label>
        <label>
          <span>Icon</span>
          <select v-model="feature.icon">
            <option value="sailing">Sailing</option>
            <option value="anchor">Anchor</option>
            <option value="waves">Waves</option>
            <option value="users">Users</option>
          </select>
        </label>
      </div>
    </div>

    <div v-else-if="blockDraft?.blockType === 'content'" class="editor-fields">
      <label v-for="(node, index) in blockDraft.text?.root?.children || []" :key="node.id || index">
        <span>{{ node.type === 'heading' ? `Heading ${index + 1}` : `Text ${index + 1}` }}</span>
        <textarea
          v-model="node.children.find((child: any) => typeof child.text === 'string').text"
          rows="4"
        />
      </label>
    </div>

    <div v-else-if="blockDraft?.blockType === 'cta'" class="editor-fields">
      <label>
        <span>Titel</span>
        <input v-model="blockDraft.title" />
      </label>
      <label>
        <span>Beschreibung</span>
        <textarea v-model="blockDraft.description" rows="3" />
      </label>
      <label>
        <span>Button Text</span>
        <input v-model="blockDraft.buttonLabel" />
      </label>
      <label>
        <span>Button Link</span>
        <input v-model="blockDraft.buttonLink" />
      </label>
    </div>

    <div v-else-if="blockDraft?.blockType === 'info'" class="editor-fields">
      <label>
        <span>Überschrift</span>
        <input v-model="blockDraft.heading" />
      </label>
      <div v-for="(item, index) in blockDraft.items || []" :key="item.id || index" class="editor-group">
        <strong>Eintrag {{ index + 1 }}</strong>
        <label>
          <span>Label</span>
          <input v-model="item.label" />
        </label>
        <label>
          <span>Wert</span>
          <input v-model="item.value" />
        </label>
      </div>
    </div>

    <div v-else-if="blockDraft?.blockType === 'person'" class="editor-fields">
      <label>
        <span>Rolle</span>
        <input v-model="blockDraft.role" />
      </label>
      <label>
        <span>Name</span>
        <input v-model="blockDraft.name" />
      </label>
      <label>
        <span>Adresse</span>
        <textarea v-model="blockDraft.address" rows="2" />
      </label>
      <label>
        <span>Telefon</span>
        <input v-model="blockDraft.phone" />
      </label>
    </div>

    <div v-else class="editor-fields">
      <p>Nicht spezifizierter Blocktyp. Admin-Link aus der CMS-Bar verwenden.</p>
    </div>
  </aside>
</template>

<style scoped>
.cms-inline-editor {
  position: fixed;
  top: 5.5rem;
  right: 1rem;
  z-index: 2550;
  width: min(28rem, calc(100vw - 2rem));
  max-height: calc(100vh - 7rem);
  overflow: auto;
  padding: 1rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
}

.editor-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.editor-kicker {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-secondary);
}

.editor-save {
  border: 0;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.editor-save:disabled {
  opacity: 0.6;
  cursor: wait;
}

.editor-fields {
  display: grid;
  gap: 0.9rem;
}

.editor-fields label,
.editor-group {
  display: grid;
  gap: 0.4rem;
}

.editor-group {
  padding: 0.85rem;
  border-radius: 0.9rem;
  background: var(--color-bg);
}

.editor-fields span,
.editor-group strong {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.editor-fields input,
.editor-fields textarea,
.editor-fields select {
  width: 100%;
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 0.8rem;
  padding: 0.75rem 0.85rem;
  background: white;
  font: inherit;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .cms-inline-editor {
    top: auto;
    bottom: 4.5rem;
    right: 0.75rem;
    max-height: 55vh;
  }
}
</style>
