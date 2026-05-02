<script setup lang="ts">
const route = useRoute()
const { currentPage, draftPage, editMode, syncPage } = usePayloadCms()

const slugPath = computed(() => {
  const slug = route.params.slug

  if (!slug) {
    return '/'
  }

  const segments = Array.isArray(slug) ? slug : [slug]
  return `/${segments.join('/')}`
})

const { data: page } = await useAsyncData(
  () => `cms-page:${slugPath.value}`,
  () => loadCmsPage(slugPath.value),
)

watchEffect(() => {
  if (page.value) {
    syncPage(page.value)
  }
})

const renderedPage = computed(() => (editMode.value ? draftPage.value : currentPage.value) ?? page.value)

if (!renderedPage.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Seite nicht gefunden',
  })
}
</script>

<template>
  <BlockRenderer :blocks="renderedPage?.layout" />
</template>
