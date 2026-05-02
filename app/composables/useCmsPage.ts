type CmsPageResult = {
  docs?: Array<Record<string, any>>
}

const fetchCmsPageBySlug = async (slug: string) => {
  return await $fetch<CmsPageResult>('/api/pages', {
    query: {
      'where[slug][equals]': slug,
    },
  })
}

export const loadCmsPage = async (slug: string) => {
  const normalizedSlug = slug === '/' ? '/' : slug.replace(/\/+$/, '')
  if (normalizedSlug === '/') {
    const pages = await $fetch<CmsPageResult>('/api/pages', {
      query: {
        limit: 100,
      },
    })

    return pages.docs?.find((page) => page.slug === '/' || page.slug === 'home') ?? null
  }

  const candidates = [normalizedSlug, normalizedSlug.replace(/^\//, '')]

  for (const candidate of candidates) {
    const page = await fetchCmsPageBySlug(candidate)

    if (page.docs?.[0]) {
      return page.docs[0]
    }
  }

  return null
}
