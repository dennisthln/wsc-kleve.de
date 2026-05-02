export const useCmsApi = () => {
  const config = useRuntimeConfig()
  const publicBase = config.public.apiBase.replace(/\/+$/, '')
  
  // Use internal base if provided, otherwise use public base
  // We check if apiBaseInternal was specifically set or if we should use publicBase
  let apiBase = publicBase

  if (import.meta.dev) {
    apiBase = 'http://localhost:3000/api'
  } else if (import.meta.server) {
    if (config.apiBaseInternal && config.apiBaseInternal !== publicBase) {
      apiBase = config.apiBaseInternal.replace(/\/+$/, '')
    } else if (publicBase.startsWith('http')) {
      apiBase = publicBase
    } else {
      // If publicBase is relative (e.g. /api), we need an absolute URL on server
      // Default to the internal port 3000 where Payload is running
      apiBase = 'http://localhost:3000/api'
    }
  }

  const cmsUrl = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const url = `${apiBase}${normalizedPath}`
    
    // Log API request URL for debugging
    if (import.meta.server) {
      console.log(`[SSR API Request]: ${url}`)
    } else {
      console.log(`[Client API Request]: ${url}`)
    }
    
    return url
  }

  const cmsFetch = async <T>(path: string, options: Record<string, any> = {}) => {
    const url = cmsUrl(path)
    try {
      return await $fetch<T>(url, {
        credentials: 'include',
        ...options,
      })
    } catch (error: any) {
      if (import.meta.server) {
        console.error(`[SSR API Error] ${url}:`, error.message || error)
      }
      throw error
    }
  }

  return {
    apiBase,
    cmsFetch,
    cmsUrl,
  }
}
