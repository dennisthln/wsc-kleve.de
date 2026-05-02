export const useCmsApi = () => {
  const config = useRuntimeConfig()
  const publicBase = config.public.apiBase.replace(/\/+$/, '')

  let apiBase = publicBase

  if (import.meta.dev) {
    apiBase = 'http://localhost:3000/api'
  } else if (import.meta.server) {
    const explicitInternalBase = process.env.NUXT_API_BASE_INTERNAL?.replace(/\/+$/, '')

    if (explicitInternalBase) {
      apiBase = explicitInternalBase
    } else if (/^https?:\/\//.test(publicBase)) {
      apiBase = publicBase
    } else {
      const requestUrl = useRequestURL()
      apiBase = `${requestUrl.origin}${publicBase.startsWith('/') ? publicBase : `/${publicBase}`}`
    }
  }

  const cmsUrl = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${apiBase}${normalizedPath}`
  }

  const cmsFetch = <T>(path: string, options: Record<string, any> = {}) => {
    return $fetch<T>(cmsUrl(path), {
      credentials: 'include',
      ...options,
    })
  }

  return {
    apiBase,
    cmsFetch,
    cmsUrl,
  }
}
