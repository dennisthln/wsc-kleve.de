export const useCmsApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase.replace(/\/+$/, '')

  const cmsUrl = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${apiBase}${normalizedPath}`
  }

  return {
    apiBase,
    cmsUrl,
  }
}
