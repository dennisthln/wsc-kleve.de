<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Pencil, PanelsTopLeft, Settings, LogIn, RefreshCcw, Eye } from 'lucide-vue-next'

const route = useRoute()
const {
  authChecked,
  currentPage,
  draftPage,
  discardDraft,
  ensureCmsContext,
  editMode,
  fetchCurrentPage,
  hasDraftChanges,
  loginUrl,
  navigationAdminUrl,
  pageAdminUrl,
  saveDraft,
  saving,
  setEditMode,
  settingsAdminUrl,
  user,
} = usePayloadCms()

const isOpen = ref(false)
const isRefreshing = ref(false)

const isVisible = computed(() => authChecked.value && !!user.value)
const pageTitle = computed(() => currentPage.value?.title || 'Keine CMS-Seite')
const pageSlug = computed(() => currentPage.value?.slug || null)

const refreshPageContext = async () => {
  isRefreshing.value = true
  try {
    await fetchCurrentPage()
    await refreshNuxtData()
  } finally {
    isRefreshing.value = false
  }
}

onMounted(async () => {
  await ensureCmsContext()
})

watch(
  () => route.path,
  async () => {
    if (user.value) {
      await fetchCurrentPage()
    }
  },
)
</script>

<template>
  <div v-if="isVisible" class="cms-shell" :class="{ 'is-open': isOpen }">
    <button class="cms-toggle" type="button" @click="isOpen = !isOpen">
      <Eye :size="16" />
      <span>CMS</span>
    </button>

    <aside class="cms-panel glass">
      <div class="cms-head">
        <div>
          <div class="cms-kicker">Payload Live Bar</div>
          <strong>{{ pageTitle }}</strong>
          <p v-if="pageSlug">{{ pageSlug }}</p>
          <p v-else>Keine CMS-Zuordnung für diese Route</p>
        </div>
        <button class="cms-icon-btn" type="button" @click="refreshPageContext" :disabled="isRefreshing">
          <RefreshCcw :size="16" :class="{ spinning: isRefreshing }" />
        </button>
      </div>

      <div class="cms-links">
        <button class="cms-link primary" type="button" @click="setEditMode(!editMode)">
          <Pencil :size="16" />
          <span>{{ editMode ? 'Inline-Modus beenden' : 'Inline bearbeiten' }}</span>
        </button>
        <a v-if="pageAdminUrl" :href="pageAdminUrl" target="_blank" rel="noreferrer" class="cms-link primary">
          <Pencil :size="16" />
          <span>Diese Seite bearbeiten</span>
        </a>
        <a :href="navigationAdminUrl" target="_blank" rel="noreferrer" class="cms-link">
          <PanelsTopLeft :size="16" />
          <span>Navigation</span>
        </a>
        <a :href="settingsAdminUrl" target="_blank" rel="noreferrer" class="cms-link">
          <Settings :size="16" />
          <span>Site Settings</span>
        </a>
      </div>

      <div v-if="editMode" class="cms-draft">
        <span>{{ hasDraftChanges ? 'Ungespeicherte Änderungen' : 'Keine Änderungen' }}</span>
        <div class="cms-draft-actions">
          <button class="cms-mini-btn" type="button" @click="discardDraft" :disabled="!hasDraftChanges || saving">Verwerfen</button>
          <button class="cms-mini-btn primary" type="button" @click="saveDraft" :disabled="!hasDraftChanges || saving">
            {{ saving ? 'Speichert…' : 'Speichern' }}
          </button>
        </div>
      </div>

      <div class="cms-meta">
        <span>{{ user?.email }}</span>
        <a :href="loginUrl" target="_blank" rel="noreferrer" class="cms-login-link">
          <LogIn :size="14" />
          <span>Admin</span>
        </a>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.cms-shell {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2600;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.cms-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, #06153f, #0a2472);
  color: white;
  font: inherit;
  font-weight: 700;
  box-shadow: 0 12px 30px rgba(10, 36, 114, 0.28);
  cursor: pointer;
}

.cms-panel {
  width: min(24rem, calc(100vw - 2rem));
  padding: 1rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18);
  transform: translateX(calc(100% + 1rem));
  opacity: 0;
  pointer-events: none;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.cms-shell.is-open .cms-panel {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}

.cms-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.cms-head strong {
  display: block;
  margin-top: 0.2rem;
  color: var(--color-primary);
}

.cms-head p {
  margin-top: 0.2rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.cms-kicker {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-secondary);
}

.cms-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 999px;
  background: var(--color-bg-alt);
  color: var(--color-primary);
  cursor: pointer;
}

.cms-links {
  display: grid;
  gap: 0.65rem;
}

.cms-link {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 0.95rem;
  border-radius: 0.95rem;
  background: white;
  color: var(--color-primary);
  box-shadow: inset 0 0 0 1px rgba(10, 36, 114, 0.08);
}

.cms-link.primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
}

.cms-meta {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.cms-draft {
  margin-top: 1rem;
  padding: 0.85rem 0.95rem;
  border-radius: 0.95rem;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.cms-draft-actions {
  display: flex;
  gap: 0.5rem;
}

.cms-mini-btn {
  border: 0;
  border-radius: 999px;
  padding: 0.55rem 0.8rem;
  background: white;
  color: var(--color-primary);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.cms-mini-btn.primary {
  background: var(--color-primary);
  color: white;
}

.cms-mini-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cms-login-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-primary);
  font-weight: 700;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .cms-shell {
    top: auto;
    right: 0.75rem;
    bottom: 0.75rem;
    flex-direction: column-reverse;
    align-items: flex-end;
  }

  .cms-panel {
    transform: translateY(calc(100% + 1rem));
  }

  .cms-shell.is-open .cms-panel {
    transform: translateY(0);
  }
}
</style>
