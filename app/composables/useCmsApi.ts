export const useCmsApi = () => {
  const config = useRuntimeConfig()
  const apiBase = (import.meta.server ? config.apiBaseInternal : config.public.apiBase).replace(/\/+$/, '')

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
