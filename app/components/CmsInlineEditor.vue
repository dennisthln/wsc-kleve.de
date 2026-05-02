<script setup lang="ts">
import { computed } from 'vue'

const {
  draftPage,
  editMode,
  saveDraft,
  saving,
  selectedBlock,
  selectedBlockIndex,
} = usePayloadCms()

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

const updateField = (key: string, value: any) => {
  if (!selectedBlock.value) {
    return
  }

  selectedBlock.value[key] = value
}

const updateArrayField = (arrayKey: string, index: number, key: string, value: any) => {
  const target = selectedBlock.value?.[arrayKey]?.[index]
  if (target) {
    target[key] = value
  }
}

const updateRichTextNode = (index: number, value: string) => {
  const children = selectedBlock.value?.text?.root?.children
  const node = children?.[index]
  if (!node?.children) {
    return
  }

  const textChild = node.children.find((child: any) => typeof child.text === 'string')
  if (textChild) {
    textChild.text = value
  }
}
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

    <div v-if="selectedBlock?.blockType === 'hero'" class="editor-fields">
      <label>
        <span>Titel</span>
        <input :value="selectedBlock.title || ''" @input="updateField('title', ($event.target as HTMLInputElement).value)" />
      </label>
      <label>
        <span>Untertitel</span>
        <textarea rows="3" :value="selectedBlock.subtitle || ''" @input="updateField('subtitle', ($event.target as HTMLTextAreaElement).value)" />
      </label>
    </div>

    <div v-else-if="selectedBlock?.blockType === 'pegel'" class="editor-fields">
      <label>
        <span>Titel</span>
        <input :value="selectedBlock.title || ''" @input="updateField('title', ($event.target as HTMLInputElement).value)" />
      </label>
      <label>
        <span>Station</span>
        <select :value="selectedBlock.station || 'EMMERICH'" @change="updateField('station', ($event.target as HTMLSelectElement).value)">
          <option value="EMMERICH">Emmerich</option>
          <option value="REES">Rees</option>
          <option value="DUESSELDORF">Düsseldorf</option>
        </select>
      </label>
    </div>

    <div v-else-if="selectedBlock?.blockType === 'features'" class="editor-fields">
      <label>
        <span>Überschrift</span>
        <input :value="selectedBlock.heading || ''" @input="updateField('heading', ($event.target as HTMLInputElement).value)" />
      </label>
      <label>
        <span>Unterzeile</span>
        <textarea rows="3" :value="selectedBlock.subheading || ''" @input="updateField('subheading', ($event.target as HTMLTextAreaElement).value)" />
      </label>
      <div v-for="(feature, index) in selectedBlock.features || []" :key="feature.id || index" class="editor-group">
        <strong>Feature {{ index + 1 }}</strong>
        <label>
          <span>Titel</span>
          <input :value="feature.title || ''" @input="updateArrayField('features', index, 'title', ($event.target as HTMLInputElement).value)" />
        </label>
        <label>
          <span>Beschreibung</span>
          <textarea rows="3" :value="feature.description || ''" @input="updateArrayField('features', index, 'description', ($event.target as HTMLTextAreaElement).value)" />
        </label>
        <label>
          <span>Icon</span>
          <select :value="feature.icon || 'anchor'" @change="updateArrayField('features', index, 'icon', ($event.target as HTMLSelectElement).value)">
            <option value="sailing">Sailing</option>
            <option value="anchor">Anchor</option>
            <option value="waves">Waves</option>
            <option value="users">Users</option>
          </select>
        </label>
      </div>
    </div>

    <div v-else-if="selectedBlock?.blockType === 'content'" class="editor-fields">
      <label v-for="(node, index) in selectedBlock.text?.root?.children || []" :key="node.id || index">
        <span>{{ node.type === 'heading' ? `Heading ${index + 1}` : `Text ${index + 1}` }}</span>
        <textarea
          rows="4"
          :value="node.children?.find((child: any) => typeof child.text === 'string')?.text || ''"
          @input="updateRichTextNode(index, ($event.target as HTMLTextAreaElement).value)"
        />
      </label>
    </div>

    <div v-else-if="selectedBlock?.blockType === 'cta'" class="editor-fields">
      <label>
        <span>Titel</span>
        <input :value="selectedBlock.title || ''" @input="updateField('title', ($event.target as HTMLInputElement).value)" />
      </label>
      <label>
        <span>Beschreibung</span>
        <textarea rows="3" :value="selectedBlock.description || ''" @input="updateField('description', ($event.target as HTMLTextAreaElement).value)" />
      </label>
      <label>
        <span>Button Text</span>
        <input :value="selectedBlock.buttonLabel || ''" @input="updateField('buttonLabel', ($event.target as HTMLInputElement).value)" />
      </label>
      <label>
        <span>Button Link</span>
        <input :value="selectedBlock.buttonLink || ''" @input="updateField('buttonLink', ($event.target as HTMLInputElement).value)" />
      </label>
    </div>

    <div v-else-if="selectedBlock?.blockType === 'info'" class="editor-fields">
      <label>
        <span>Überschrift</span>
        <input :value="selectedBlock.heading || ''" @input="updateField('heading', ($event.target as HTMLInputElement).value)" />
      </label>
      <div v-for="(item, index) in selectedBlock.items || []" :key="item.id || index" class="editor-group">
        <strong>Eintrag {{ index + 1 }}</strong>
        <label>
          <span>Label</span>
          <input :value="item.label || ''" @input="updateArrayField('items', index, 'label', ($event.target as HTMLInputElement).value)" />
        </label>
        <label>
          <span>Wert</span>
          <input :value="item.value || ''" @input="updateArrayField('items', index, 'value', ($event.target as HTMLInputElement).value)" />
        </label>
      </div>
    </div>

    <div v-else-if="selectedBlock?.blockType === 'person'" class="editor-fields">
      <label>
        <span>Rolle</span>
        <input :value="selectedBlock.role || ''" @input="updateField('role', ($event.target as HTMLInputElement).value)" />
      </label>
      <label>
        <span>Name</span>
        <input :value="selectedBlock.name || ''" @input="updateField('name', ($event.target as HTMLInputElement).value)" />
      </label>
      <label>
        <span>Adresse</span>
        <textarea rows="2" :value="selectedBlock.address || ''" @input="updateField('address', ($event.target as HTMLTextAreaElement).value)" />
      </label>
      <label>
        <span>Telefon</span>
        <input :value="selectedBlock.phone || ''" @input="updateField('phone', ($event.target as HTMLInputElement).value)" />
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
