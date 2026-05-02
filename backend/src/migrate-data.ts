import { getPayload } from 'payload'
import config from './payload.config'

const migrate = async () => {
  const payload = await getPayload({ config })

  console.log('Starting Data Migration...')

  // 1. Suche alle Seiten
  const pages = await payload.find({
    collection: 'pages',
  })

  for (const page of pages.docs) {
    console.log(`Migrating page: ${page.slug}`)

    // Prüfen, ob die Seite noch das alte Format hat (hero existiert, layout ist leer)
    // Hinweis: Da wir das Schema geändert haben, sind die alten Daten noch in der DB, 
    // aber Payload filtert sie normalerweise im Typ-System. Wir greifen über das Dokument zu.
    
    const oldHero = (page as any).hero
    const oldContent = (page as any).content
    const currentLayout = (page as any).layout

    if (!currentLayout || currentLayout.length === 0) {
      const newLayout = []

      // Alten Hero in Hero-Block umwandeln
      if (oldHero) {
        newLayout.push({
          blockType: 'hero',
          title: oldHero.title || page.title,
          subtitle: oldHero.subtitle || '',
          backgroundImage: oldHero.image || null,
        })
      }

      // Alten Content in Content-Block umwandeln
      if (oldContent) {
        newLayout.push({
          blockType: 'content',
          text: oldContent,
          columns: '1',
        })
      }

      if (newLayout.length > 0) {
        await payload.update({
          collection: 'pages',
          id: page.id,
          data: {
            layout: newLayout,
            // Wir setzen die alten Felder auf null, um die DB sauber zu halten
            hero: null,
            content: null,
          } as any,
        })
        console.log(`✅ Successfully migrated ${page.slug} to blocks.`)
      } else {
        console.log(`ℹ️ No data to migrate for ${page.slug}.`)
      }
    } else {
      console.log(`⏭️ Page ${page.slug} already has a layout. Skipping.`)
    }
  }

  console.log('Migration finished.')
  process.exit(0)
}

migrate()
