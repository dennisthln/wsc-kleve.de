export const defaultSiteSettings = {
  maintenanceMode: false,
  maintenanceNotice: 'Die Internetseite wird gerade aktualisiert.',
  pricing: {
    berth: {
      water: {
        member: { per_m2: 10.2 },
        guest: { per_m2: 15.3, base_fee: 149.0 },
      },
      dinghy: {
        member: { fixed: 51.0 },
        guest: { fixed: 95.0 },
      },
    },
    power: {
      connection_fee: 10.0,
      advance_payment: 51.0,
    },
    box_lengths: [6, 8, 9],
  },
}

export const defaultNavigation = {
  items: [
    { label: 'Startseite', link: '/' },
    { label: 'News', link: '/news/aktuelles' },
    {
      label: 'Verein',
      link: '/verein',
      children: [
        { label: 'Mitglied werden', link: '/aufnahmeantrag' },
        { label: 'Liegeplatz beantragen', link: '/antrag-liegeplatz' },
        { label: 'Satzung & Gebühren', link: '/satzung' },
      ],
    },
    { label: 'Galerie', link: '/galerie' },
    { label: 'Kontakt', link: '/kontakt' },
  ],
}
