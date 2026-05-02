<script setup lang="ts">
const { cmsUrl } = useCmsApi()
const { currentPage, draftPage, editMode, syncPage } = usePayloadCms()
const { data: homepage } = await useAsyncData('home-page', () => loadCmsPage('/'))

const { data: settings } = await useAsyncData('site-settings', async () => {
  try {
    return await $fetch<any>(cmsUrl('/globals/site-settings'))
  } catch (error: any) {
    if (error?.statusCode === 404) {
      return null
    }

    throw error
  }
})

/*if (!homepage.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Startseite nicht gefunden',
  })
}*/

watchEffect(() => {
  if (homepage.value) {
    syncPage(homepage.value)
  }
})

const renderedPage = computed(() => (editMode.value ? draftPage.value : currentPage.value) ?? homepage.value)
const leadingBlocks = computed(() => renderedPage.value?.layout?.filter((block: any) => block.blockType === 'hero' || block.blockType === 'pegel') ?? [])
const leadingIndexMap = computed(() =>
  renderedPage.value?.layout
    ?.map((block: any, index: number) => ({ block, index }))
    .filter(({ block }: any) => block.blockType === 'hero' || block.blockType === 'pegel')
    .map(({ index }: any) => index) ?? [],
)
const trailingBlocks = computed(() => renderedPage.value?.layout?.filter((block: any) => block.blockType !== 'hero' && block.blockType !== 'pegel') ?? [])
const trailingIndexMap = computed(() =>
  renderedPage.value?.layout
    ?.map((block: any, index: number) => ({ block, index }))
    .filter(({ block }: any) => block.blockType !== 'hero' && block.blockType !== 'pegel')
    .map(({ index }: any) => index) ?? [],
)
</script>

<template>
  <div class="homepage">
    <!-- HERO SECTION (From Blocks) -->
    <template v-if="renderedPage?.layout">
      <!-- We find the hero and pegel blocks to show them first -->
      <BlockRenderer :blocks="leadingBlocks" :index-map="leadingIndexMap" />
    </template>

    <!-- DYNAMIC EVENTS SECTION -->
    <EventsSection />

    <!-- REMAINING BLOCKS (Excluding hero and pegel) -->
    <template v-if="renderedPage?.layout">
      <BlockRenderer :blocks="trailingBlocks" :index-map="trailingIndexMap" />
    </template>

    <!-- DYNAMIC NEWS SECTION -->
    <NewsSection />

    <!-- Maintenance Banner -->
    <div v-if="settings?.maintenanceMode" class="maintenance-banner glass">
      <div class="container">
        <p><strong>⚓ Hinweis:</strong> {{ settings.maintenanceNotice || 'Die Internetseite befindet sich im Wartungsmodus.' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maintenance-banner {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 1rem 2rem;
  border-radius: 100px;
  background: rgba(10, 36, 114, 0.9);
  color: white;
  border: 1px solid var(--color-accent);
  white-space: nowrap;
}
</style>
