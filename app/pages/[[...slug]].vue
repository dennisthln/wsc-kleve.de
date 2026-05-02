<script setup lang="ts">
const route = useRoute()

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

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Seite nicht gefunden',
  })
}
</script>

<template>
  <BlockRenderer :blocks="page?.layout" />
</template>
