<script setup lang="ts">
import { computed } from 'vue'
import { Check, Pencil } from 'lucide-vue-next'

const {
  editMode,
  hasDraftChanges,
  pageAdminUrl,
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

const visible = computed(() => editMode.value)
const blockTitle = computed(() => {
  if (!selectedBlock.value) {
    return 'Block waehlen'
  }

  return blockTypeLabels[selectedBlock.value.blockType] || selectedBlock.value.blockType || 'Block'
})
</script>

<template>
  <Transition name="cms-inline-chip">
    <aside v-if="visible" class="cms-inline-editor">
      <div class="inline-chip">
        <div class="chip-icon">
          <Pencil :size="15" />
        </div>

        <div class="chip-copy">
          <strong>{{ blockTitle }}</strong>
          <span v-if="selectedBlockIndex !== null">Direkt im Inhalt bearbeitbar</span>
          <span v-else>Block auf der Seite anklicken</span>
        </div>

        <div class="chip-actions">
          <button class="chip-save" type="button" @click="saveDraft" :disabled="!hasDraftChanges || saving">
            <Check :size="14" />
            <span>{{ saving ? 'Speichert…' : 'Speichern' }}</span>
          </button>
          <a v-if="pageAdminUrl" :href="pageAdminUrl" target="_blank" rel="noreferrer" class="chip-link">
            Admin
          </a>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.cms-inline-editor {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  z-index: 2550;
  max-width: calc(100vw - 2rem);
}

.inline-chip {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 0.9rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(100, 116, 139, 0.18);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(10px);
}

.chip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: rgba(10, 36, 114, 0.08);
  color: var(--color-primary);
  flex: 0 0 auto;
}

.chip-copy {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
}

.chip-copy strong {
  font-size: 0.92rem;
  color: var(--color-primary);
}

.chip-copy span {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.chip-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.chip-save,
.chip-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 0.9rem;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 700;
}

.chip-save {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  cursor: pointer;
}

.chip-save:disabled {
  opacity: 0.55;
  cursor: default;
}

.chip-link {
  background: var(--color-bg-alt);
  color: var(--color-primary);
}

.cms-inline-chip-enter-active,
.cms-inline-chip-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.cms-inline-chip-enter-from,
.cms-inline-chip-leave-to {
  transform: translateY(8px);
  opacity: 0;
}

@media (max-width: 768px) {
  .cms-inline-editor {
    left: 0.75rem;
    right: 0.75rem;
    bottom: 0.75rem;
  }

  .inline-chip {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  .chip-actions {
    grid-column: 1 / -1;
    margin-left: 0;
  }
}
</style>
