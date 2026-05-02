<script setup lang="ts">
import CmsInlineEditor from '../components/CmsInlineEditor.vue'
</script>

<template>
  <div class="app-layout">
    <CmsBar />
    <CmsInlineEditor />
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
