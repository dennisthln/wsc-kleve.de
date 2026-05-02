import { getPayload } from 'payload'
import config from './payload.config'
import { defaultNavigation, defaultSiteSettings } from './seed-defaults'
import { seed } from './seed'

// The SQLite adapter only auto-creates schema outside production.
// We use a dedicated one-off init process before the production servers start.
process.env.NODE_ENV = 'development'

const dockerInit = async () => {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    limit: 1,
    depth: 0,
  })

  const navigation = await payload.findGlobal({
    slug: 'navigation',
    depth: 0,
  })

  const hasPages = pages.totalDocs > 0
  const hasNavigation = Array.isArray(navigation?.items) && navigation.items.length > 0

  if (!hasNavigation) {
    await payload.updateGlobal({
      slug: 'navigation',
      data: defaultNavigation,
    })
    console.log('Initialized navigation global')
  }

  if (!hasPages) {
    console.log('Database is empty, running initial seed')
    await seed()
    return
  }

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
  })

  if (!siteSettings) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: defaultSiteSettings,
    })
  }

  console.log('Database already initialized, skipping seed')
}

dockerInit()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Docker init failed', error)
    process.exit(1)
  })
