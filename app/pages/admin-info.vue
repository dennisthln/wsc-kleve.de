<script setup lang="ts">
const { data: settings } = await useFetch('http://localhost:3000/api/globals/site-settings')
</script>

<template>
  <div class="admin-dashboard container section">
    <div class="dashboard-card">
      <div class="logo-area">
        <span class="payload-logo">P</span>
        <h2>WSCKL CMS Dashboard</h2>
      </div>
      
      <div class="user-status">
        <p>Status: <span class="status-badge">Verbunden mit Payload CMS</span></p>
        <p v-if="settings">Wartungsmodus: <strong>{{ settings.maintenanceMode ? 'AN' : 'AUS' }}</strong></p>
      </div>

      <div class="actions">
        <a href="http://localhost:3000/admin" target="_blank" class="btn btn-primary">
          Zum Admin Panel (Inhalte bearbeiten)
        </a>
        <NuxtLink to="/" class="btn btn-outline">Zurück zur Webseite</NuxtLink>
      </div>

      <div class="info-footer">
        <p>Dokumentation: <a href="https://payloadcms.com/docs" target="_blank">payloadcms.com/docs</a></p>
        <p class="file-path">Diese Ansicht wird verwaltet in: <code>app/pages/admin-info.vue</code></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.dashboard-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.logo-area {
  margin-bottom: 2rem;
}

.payload-logo {
  display: inline-block;
  background: #000;
  color: #fff;
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.user-status {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--color-bg-alt);
  border-radius: 8px;
}

.status-badge {
  color: #28a745;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-outline {
  border: 1px solid #ddd;
  color: #666;
}

.info-footer {
  margin-top: 3rem;
  font-size: 0.85rem;
  color: #999;
}

.file-path {
  margin-top: 1rem;
  font-family: monospace;
}
</style>
