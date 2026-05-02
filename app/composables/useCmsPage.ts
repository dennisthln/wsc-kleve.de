type CmsPageResult = {
  docs?: Array<Record<string, any>>
}

const fetchCmsPageBySlug = async (slug: string) => {
  const { cmsUrl } = useCmsApi()

  return await $fetch<CmsPageResult>(cmsUrl('/pages'), {
    query: {
      'where[slug][equals]': slug,
    },
  })
}

export const loadCmsPage = async (slug: string) => {
  const normalizedSlug = slug === '/' ? '/' : slug.replace(/\/+$/, '')
  const candidates =
    normalizedSlug === '/'
      ? ['/', 'home']
      : [normalizedSlug, normalizedSlug.replace(/^\//, '')]

  for (const candidate of candidates) {
    const page = await fetchCmsPageBySlug(candidate)

    if (page.docs?.[0]) {
      return page.docs[0]
    }
  }

  return null
}
