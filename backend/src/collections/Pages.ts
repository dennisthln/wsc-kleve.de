import type { CollectionConfig } from 'payload'
import { HeroBlock, ContentBlock, InfoBlock, FeaturesBlock, ImageGridBlock, CTABlock, PegelBlock, PersonBlock, BoardBlock } from '../blocks/Sections'

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
      ],
    },
  ],
}
