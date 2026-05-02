import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true, update: () => true,
  },
  fields: [
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      label: 'Wartungsmodus aktivieren',
      defaultValue: true,
    },
    {
      name: 'maintenanceNotice',
      type: 'text',
      label: 'Wartungshinweis Text',
      defaultValue: 'Die Internetseite befindet sich derzeit im Wartungsmodus.',
    },
    {
      name: 'footerText',
      type: 'textarea',
      label: 'Footer Beschreibung',
    },
    {
      name: 'pricing',
      type: 'json',
      label: 'Preise & Gebühren (JSON)',
      admin: {
        description: 'Hier können die Preise für Liegeplätze und Gebühren verwaltet werden.',
      },
    },
  ],
}
