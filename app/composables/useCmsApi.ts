export const useCmsApi = () => {
  const config = useRuntimeConfig()
  const publicBase = config.public.apiBase.replace(/\/+$/, '')
  const internalBase = (config.apiBaseInternal || publicBase).replace(/\/+$/, '')

  let apiBase = publicBase

  if (import.meta.dev) {
    apiBase = 'http://localhost:3000/api'
  } else if (import.meta.server) {
    apiBase = internalBase
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
