<script setup lang="ts">
const route = useRoute()
const { currentPage, draftPage, editMode, syncPage } = usePayloadCms()

const slugPath = computed(() => {
  const slug = route.params.slug
  if (!slug || (Array.isArray(slug) && slug.length === 0)) {
    return '/'
  }
  const segments = Array.isArray(slug) ? slug : [slug]
  return `/${segments.filter(Boolean).join('/')}`
})

if (import.meta.server) {
  console.log(`[[...slug].vue] Rendering path: "${route.path}", slugPath: "${slugPath.value}"`)
}

if (route.path.startsWith('/api/')) {
  throw createError({
    statusCode: 404,
    statusMessage: `Page not found: ${route.path}`,
  })
}

const { data: page, error: asyncError, pending } = await useAsyncData(
  `cms-page:${slugPath.value}`,
  () => loadCmsPage(slugPath.value),
)

// Provide SEO meta data
watchEffect(() => {
  if (page.value) {
    const title = page.value.seo?.metaTitle || page.value.title
    const description = page.value.seo?.metaDescription || 'Wassersport am Niederrhein - Segeln, Motorboot und Gemeinschaft beim WSC Kleve.'
    const image = page.value.seo?.ogImage?.url

    useSeoMeta({
      title: `${title} | WSCKL - Wassersportclub Kleve e.V.`,
      ogTitle: title,
      description: description,
      ogDescription: description,
      ogImage: image,
      twitterCard: 'summary_large_image',
    })
  }
})

if (import.meta.server) {
  if (asyncError.value) {
    console.error(`[[...slug].vue] useAsyncData error for "${slugPath.value}":`, asyncError.value.message || asyncError.value)
  } else {
    console.log(`[[...slug].vue] useAsyncData loaded page: "${page.value?.title || 'null'}"`)
  }
}

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

if (!renderedPage.value && !pending.value) {
  if (import.meta.server) {
    console.warn(`[[...slug].vue] No renderedPage for "${slugPath.value}", throwing 404`)
  }
  throw createError({
    statusCode: 404,
    statusMessage: `Page not found: ${route.path}`,
  })
}
</script>

<template>
  <BlockRenderer :blocks="renderedPage?.layout" />
</template>
