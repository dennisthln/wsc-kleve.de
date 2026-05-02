type CmsPageResult = {
  docs?: Array<Record<string, any>>
}

const fetchCmsPageBySlug = async (slug: string, cmsFetch: any) => {
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
    if (import.meta.server) {
      console.error(`[useCmsPage] Error fetching "${slug}":`, error.statusCode || error.status, error.message || error)
    }
    
    if (error?.statusCode === 404) {
      return { docs: [] }
    }

    throw error
  }
}

/**
 * Robustly load a page by its slug, trying multiple candidates (with/without slashes)
 */
export const loadCmsPage = async (slug: string) => {
  // Call composable immediately to capture Nuxt context before any awaits
  const { cmsFetch } = useCmsApi()
  
  const normalizedSlug = slug === '/' ? '/' : slug.replace(/\/+$/, '')
  const candidates =
    normalizedSlug === '/'
      ? ['home', '/']
      : [normalizedSlug.replace(/^\//, ''), normalizedSlug, `/${normalizedSlug.replace(/^\//, '')}`]

  // Remove duplicates
  const uniqueCandidates = [...new Set(candidates)]

  if (import.meta.server) {
    console.log(`[useCmsPage] Loading page for slug: "${slug}", unique candidates: ${JSON.stringify(uniqueCandidates)}`)
  }

  for (const candidate of uniqueCandidates) {
    const page = await fetchCmsPageBySlug(candidate, cmsFetch)

    if (page.docs?.[0]) {
      if (import.meta.server) {
        console.log(`[useCmsPage] Found page for candidate: "${candidate}"`)
      }
      return page.docs[0]
    }
  }

  if (import.meta.server) {
    console.warn(`[useCmsPage] No page found for slug: "${slug}" after trying all candidates.`)
  }
  return null
}
