import { getPayload } from 'payload'
import config from './payload.config'

const mergePages = async () => {
  const payload = await getPayload({ config })

  // 1. Get Steganlage Content
  const steganlagePage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'steganlage' } }
  })
  
  if (steganlagePage.docs.length === 0) {
    console.log('Steganlage page not found')
    process.exit(1)
  }
  
  const steganlageBlocks = steganlagePage.docs[0].layout

  // 2. Get Verein Page
  const vereinPage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'verein' } }
  })
  
  if (vereinPage.docs.length === 0) {
    console.log('Verein page not found')
    process.exit(1)
  }

  const existingVereinBlocks = vereinPage.docs[0].layout
  
  // 3. Filter existing blocks to keep it clean (remove old person blocks if needed, or keep them)
  // Let's create a fresh layout structure
  const newLayout = [
    existingVereinBlocks[0], // Hero
    existingVereinBlocks[1], // Intro
    // Add Steganlage Section Header
    {
      blockType: 'content',
      columns: '1',
      accent: true,
      text: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h2',
              children: [{ text: 'Unsere Steganlage', type: 'text' }],
            },
            {
              type: 'paragraph',
              children: [{ text: 'Unsere moderne Steganlage bietet alles, was das Wassersportler-Herz begehrt. Ein Aluminiumsteg mit Strom- und Wasserversorgung an jedem Platz sowie ein gemütliches Vereinshaus mit modernen Sanitäreinrichtungen stehen unseren Mitgliedern und Gästen zur Verfügung.', type: 'text' }],
            }
          ],
        }
      }
    },
    ...steganlageBlocks.filter(b => b.blockType !== 'hero'), // Add all steganlage blocks except hero
    // Keep Vorstand info (if it was there)
    ...existingVereinBlocks.filter(b => b.blockType === 'person' || b.blockType === 'info')
  ]

  // 4. Update Verein Page
  await payload.update({
    collection: 'pages',
    id: vereinPage.docs[0].id,
    data: {
      layout: newLayout
    }
  })

  // 5. Delete Steganlage Page
  await payload.delete({
    collection: 'pages',
    id: steganlagePage.docs[0].id
  })

  // 6. Update Navigation
  const nav = await payload.findGlobal({ slug: 'navigation' })
  const newNavItems = nav.items.filter(item => item.label !== 'Steganlage')
  
  await payload.updateGlobal({
    slug: 'navigation',
    data: { items: newNavItems }
  })

  console.log('✅ Verein and Steganlage merged successfully')
  process.exit(0)
}

mergePages()
