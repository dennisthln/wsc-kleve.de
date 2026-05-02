<script setup lang="ts">
const route = useRoute()
const { currentPage, draftPage, editMode, syncPage } = usePayloadCms()

const slugPath = computed(() => {
  const slug = route.params.slug
  const segments = Array.isArray(slug) ? slug : [slug]
  return `/${segments.join('/')}`
})

const { data: page } = await useAsyncData(
  () => `cms-page:${slugPath.value}`,
  () => loadCmsPage(slugPath.value),
)

watch(
  () => page.value?.id,
  () => {
    if (page.value) {
      syncPage(page.value)
    }
  },
  { immediate: true },
)

const renderedPage = computed(() => (editMode.value ? draftPage.value : currentPage.value) ?? page.value)

if (!renderedPage.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Page not found: ${route.path}`,
  })
}
</script>

<template>
  <BlockRenderer :blocks="renderedPage?.layout" />
</template>
