import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    { 
      name: 'variant', 
      type: 'select', 
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Beautiful (Overlapping)', value: 'beautiful' }
      ],
      defaultValue: 'standard'
    },
  ],
}

export const BoardBlock: Block = {
  slug: 'board',
  labels: { singular: 'Vorstand-Liste', plural: 'Vorstand-Listen' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Unser Vorstand' },
    { name: 'subheading', type: 'text' },
  ]
}

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: { singular: 'Feature Section', plural: 'Feature Sections' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'subheading', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Standard Grid', value: 'standard' },
        { label: 'Beautiful Overlap', value: 'overlap' }
      ],
      defaultValue: 'standard'
    },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'link', type: 'text', label: 'Verlinkung (optional)' },
        { name: 'icon', type: 'select', options: [
          { label: 'Sailing', value: 'sailing' },
          { label: 'Anchor', value: 'anchor' },
          { label: 'Waves', value: 'waves' },
          { label: 'Users', value: 'users' }
        ]}
      ]
    }
  ]
}

export const ContentBlock: Block = {
  slug: 'content',
  fields: [
    { name: 'text', type: 'richText', required: true },
    { name: 'columns', type: 'select', options: [{ label: '1 Spalte', value: '1' }, { label: '2 Spalten', value: '2' }], defaultValue: '1' },
    { name: 'accent', type: 'checkbox', label: 'Hintergrund hervorheben' }
  ],
}

export const ImageGridBlock: Block = {
  slug: 'imageGrid',
  fields: [
    { name: 'images', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] }
  ]
}

export const CTABlock: Block = {
  slug: 'cta',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'text' },
    { name: 'buttonLabel', type: 'text' },
    { name: 'buttonLink', type: 'text' }
  ]
}

export const InfoBlock: Block = {
  slug: 'info',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'items', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'value', type: 'text' }] },
  ],
}

export const PegelBlock: Block = {
  slug: 'pegel',
  labels: { singular: 'Rheinpegel Stand', plural: 'Rheinpegel Stände' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Aktueller Rheinpegel' },
    { name: 'station', type: 'select', options: [
      { label: 'Emmerich', value: 'EMMERICH' },
      { label: 'Rees', value: 'REES' },
      { label: 'Düsseldorf', value: 'DUESSELDORF' }
    ], defaultValue: 'EMMERICH' }
  ]
}

export const PersonBlock: Block = {
  slug: 'person',
  labels: { singular: 'Vorstand/Person', plural: 'Vorstand/Personen' },
  fields: [
    { name: 'role', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'address', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ]
}

export const ContactBlock: Block = {
  slug: 'contact',
  labels: { singular: 'Kontaktformular', plural: 'Kontaktformulare' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Schreiben Sie uns' },
    { name: 'description', type: 'text', defaultValue: 'Haben Sie Fragen? Wir freuen uns auf Ihre Nachricht.' },
  ]
}

export const EventsBlock: Block = {
  slug: 'events',
  labels: { singular: 'Termine/Events', plural: 'Termine/Events' },
  fields: [
    { name: 'limit', type: 'number', defaultValue: 3, label: 'Anzahl Termine' },
  ]
}

export const NewsBlock: Block = {
  slug: 'news',
  labels: { singular: 'Neuigkeiten (Grid)', plural: 'Neuigkeiten (Grid)' },
  fields: [
    { name: 'limit', type: 'number', defaultValue: 3, label: 'Anzahl News' },
  ]
}
