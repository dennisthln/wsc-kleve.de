import type { CollectionConfig } from 'payload'
import { HeroBlock, ContentBlock, InfoBlock, FeaturesBlock, ImageGridBlock, CTABlock, PegelBlock, PersonBlock, BoardBlock, EventsBlock, NewsBlock, SponsorsBlock } from '../blocks/Sections'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroBlock,
        ContentBlock,
        FeaturesBlock,
        ImageGridBlock,
        CTABlock,
        InfoBlock,
        PegelBlock,
        PersonBlock,
        BoardBlock,
        EventsBlock,
        NewsBlock,
        SponsorsBlock,
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO / Suchmaschinen',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Seitentitel (SEO)' },
        { name: 'metaDescription', type: 'textarea', label: 'Seitenbeschreibung (SEO)' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Vorschaubild (Social Media)' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
