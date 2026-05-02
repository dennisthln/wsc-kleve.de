type CmsPageResult = {
  docs?: Array<Record<string, any>>
}

const fetchCmsPageBySlug = async (slug: string) => {
  const { cmsFetch } = useCmsApi()

  try {
    const result = await cmsFetch<CmsPageResult>('/pages', {
      query: {
        'where[slug][equals]': slug,
      },
    })
    
    if (import.meta.server) {
      console.log(`[useCmsPage] Fetched "${slug}": ${result.docs?.length || 0} docs found`)
    }
    
    return result
  } catch (error: any) {
    if (error?.statusCode === 404) {
      return { docs: [] }
    }

    throw error
  }
}

export const loadCmsPage = async (slug: string) => {
  const normalizedSlug = slug === '/' ? '/' : slug.replace(/\/+$/, '')
  const candidates =
    normalizedSlug === '/'
      ? ['/', 'home']
      : [normalizedSlug, normalizedSlug.replace(/^\//, '')]

  if (import.meta.server) {
    console.log(`[useCmsPage] Loading page for slug: "${slug}", candidates: ${JSON.stringify(candidates)}`)
  }

  for (const candidate of candidates) {
    const page = await fetchCmsPageBySlug(candidate)

    if (page.docs?.[0]) {
      if (import.meta.server) {
        console.log(`[useCmsPage] Found page for candidate: "${candidate}"`)
      }
      return page.docs[0]
    }
  }

  if (import.meta.server) {
    console.warn(`[useCmsPage] No page found for slug: "${slug}"`)
  }
  return null
}
