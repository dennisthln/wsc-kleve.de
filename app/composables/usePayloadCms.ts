type PayloadUserResponse = {
  user?: {
    id: number | string
    email?: string
  } | null
}

type CmsPageDoc = {
  id: number | string
  title?: string
  slug?: string
  layout?: any[]
}

const clonePage = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export const usePayloadCms = () => {
  const route = useRoute()
  const { apiBase, cmsFetch } = useCmsApi()

  const user = useState<PayloadUserResponse['user']>('payload-cms-user', () => null)
  const authChecked = useState<boolean>('payload-cms-auth-checked', () => false)
  const currentPage = useState<CmsPageDoc | null>('payload-cms-current-page', () => null)
  const pageChecked = useState<boolean>('payload-cms-page-checked', () => false)
  const originalPage = useState<CmsPageDoc | null>('payload-cms-original-page', () => null)
  const draftPage = useState<CmsPageDoc | null>('payload-cms-draft-page', () => null)
  const editMode = useState<boolean>('payload-cms-edit-mode', () => false)
  const selectedBlockIndex = useState<number | null>('payload-cms-selected-block-index', () => null)
  const saving = useState<boolean>('payload-cms-saving', () => false)

  const adminBase = apiBase.replace(/\/api$/, '') + '/admin'

  const fetchUser = async () => {
    try {
      const response = await cmsFetch<PayloadUserResponse>('/users/me')
      user.value = response.user ?? null
    } catch {
      user.value = null
    } finally {
      authChecked.value = true
    }
  }

  const fetchCurrentPage = async () => {
    if (!user.value) {
      currentPage.value = null
      originalPage.value = null
      draftPage.value = null
      pageChecked.value = true
      return
    }

    const page = await loadCmsPage(route.path)
    currentPage.value = page
    originalPage.value = page ? clonePage(page) : null
    draftPage.value = page ? clonePage(page) : null
    selectedBlockIndex.value = null
    pageChecked.value = true
  }

  const ensureCmsContext = async () => {
    if (!authChecked.value) {
      await fetchUser()
    }

    await fetchCurrentPage()
  }

  const syncPage = (page: CmsPageDoc | null | undefined) => {
    currentPage.value = page ? clonePage(page) : null
    originalPage.value = page ? clonePage(page) : null
    draftPage.value = page ? clonePage(page) : null
    selectedBlockIndex.value = null
    pageChecked.value = true
  }

  const selectedBlock = computed(() => {
    if (selectedBlockIndex.value === null) {
      return null
    }

    return draftPage.value?.layout?.[selectedBlockIndex.value] ?? null
  })

  const hasDraftChanges = computed(() => {
    if (!draftPage.value || !originalPage.value) {
      return false
    }

    return JSON.stringify(draftPage.value) !== JSON.stringify(originalPage.value)
  })

  const selectBlock = (index: number | null) => {
    selectedBlockIndex.value = index
  }

  const setEditMode = (value: boolean) => {
    editMode.value = value
    if (!value) {
      selectedBlockIndex.value = null
    }
  }

  const discardDraft = () => {
    draftPage.value = originalPage.value ? clonePage(originalPage.value) : null
    selectedBlockIndex.value = null
  }

  const updateDraftPage = (updater: (page: CmsPageDoc) => void) => {
    if (!draftPage.value) {
      return
    }

    const nextDraft = clonePage(draftPage.value)
    updater(nextDraft)
    draftPage.value = nextDraft
  }

  const updateSelectedBlockField = (key: string, value: any) => {
    if (selectedBlockIndex.value === null) {
      return
    }

    updateDraftPage((page) => {
      const block = page.layout?.[selectedBlockIndex.value!]
      if (block) {
        block[key] = value
      }
    })
  }

  const updateSelectedBlockArrayField = (arrayKey: string, index: number, key: string, value: any) => {
    if (selectedBlockIndex.value === null) {
      return
    }

    updateDraftPage((page) => {
      const target = page.layout?.[selectedBlockIndex.value!]?.[arrayKey]?.[index]
      if (target) {
        target[key] = value
      }
    })
  }

  const updateSelectedBlockRichTextNode = (index: number, value: string) => {
    if (selectedBlockIndex.value === null) {
      return
    }

    updateDraftPage((page) => {
      const children = page.layout?.[selectedBlockIndex.value!]?.text?.root?.children
      const node = children?.[index]
      if (!node?.children) {
        return
      }

      const textChild = node.children.find((child: any) => typeof child.text === 'string')
      if (textChild) {
        textChild.text = value
      }
    })
  }

  const replaceSelectedBlock = (block: any) => {
    if (selectedBlockIndex.value === null) {
      return
    }

    updateDraftPage((page) => {
      if (!page.layout) {
        return
      }

      page.layout[selectedBlockIndex.value!] = clonePage(block)
    })
  }

  const saveDraft = async () => {
    if (!draftPage.value?.id) {
      return
    }

    saving.value = true
    try {
      const updated = await cmsFetch<CmsPageDoc>(`/pages/${draftPage.value.id}`, {
        method: 'PATCH',
        body: {
          title: draftPage.value.title,
          slug: draftPage.value.slug,
          layout: draftPage.value.layout,
        },
      })

      currentPage.value = clonePage(updated)
      originalPage.value = clonePage(updated)
      draftPage.value = clonePage(updated)
    } finally {
      saving.value = false
    }
  }

  const pageAdminUrl = computed(() => {
    if (!currentPage.value?.id) {
      return null
    }

    return `${adminBase}/collections/pages/${currentPage.value.id}`
  })

  const navigationAdminUrl = `${adminBase}/globals/navigation`
  const settingsAdminUrl = `${adminBase}/globals/site-settings`
  const loginUrl = `${adminBase}/login`

  return {
    adminBase,
    authChecked,
    currentPage,
    ensureCmsContext,
    editMode,
    fetchCurrentPage,
    fetchUser,
    draftPage,
    discardDraft,
    hasDraftChanges,
    loginUrl,
    navigationAdminUrl,
    pageAdminUrl,
    pageChecked,
    replaceSelectedBlock,
    saveDraft,
    saving,
    selectedBlock,
    selectedBlockIndex,
    selectBlock,
    setEditMode,
    settingsAdminUrl,
    syncPage,
    updateSelectedBlockArrayField,
    updateSelectedBlockField,
    updateSelectedBlockRichTextNode,
    user,
  }
}
