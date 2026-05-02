import { getPayload } from 'payload'
import config from './payload.config'

const seed = async () => {
  const payload = await getPayload({ config })

  console.log('Seed started (Advanced Block Version)...')

  // 1. Site Settings
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      maintenanceMode: false,
      maintenanceNotice: 'Die Internetseite wird gerade aktualisiert.',
      pricing: {
        berth: {
          water: {
            member: { per_m2: 10.20 },
            guest: { per_m2: 15.30, base_fee: 149.00 }
          },
          dinghy: {
            member: { fixed: 51.00 },
            guest: { fixed: 95.00 }
          }
        },
        power: {
          connection_fee: 10.00,
          advance_payment: 51.00
        },
        box_lengths: [6, 8, 9]
      }
    },
  })

  // 2. Clear existing data
  const existingPages = await payload.find({ collection: 'pages' })
  for (const page of existingPages.docs) {
    await payload.delete({ collection: 'pages', id: page.id })
  }
  
  const existingNews = await payload.find({ collection: 'news' })
  for (const n of existingNews.docs) {
    await payload.delete({ collection: 'news', id: n.id })
  }

  const existingEvents = await payload.find({ collection: 'events' })
  for (const e of existingEvents.docs) {
    await payload.delete({ collection: 'events', id: e.id })
  }

  // ... (Pages created here) ...

  // 9. Create News
  await payload.create({
    collection: 'news',
    data: {
      title: 'Erfolgreiches Ansegeln 2026',
      category: 'verein',
      status: 'published',
      publishDate: new Date('2026-04-15').toISOString(),
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Bei strahlendem Sonnenschein und einer leichten Brise haben wir am vergangenen Wochenende die Segelsaison 2026 eröffnet. Über 20 Boote nahmen an der traditionellen Geschwaderfahrt teil.', type: 'text' }]
            }
          ]
        }
      } as any,
    }
  })

  await payload.create({
    collection: 'news',
    data: {
      title: 'Jugendtraining startet im Mai',
      category: 'jugend',
      status: 'published',
      publishDate: new Date('2026-04-20').toISOString(),
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ text: 'Unser Jugendwart freut sich, den Start der Trainingseinheiten für unsere jüngsten Mitglieder bekannt zu geben. Ab dem 4. Mai treffen wir uns jeden Samstag um 10 Uhr am Jollensteg.', type: 'text' }]
            }
          ]
        }
      } as any,
    }
  })

  // 10. Create Events
  await payload.create({
    collection: 'events',
    data: {
      title: 'Sommerfest & Grillabend',
      date: new Date('2026-07-12T18:00:00Z').toISOString(),
      location: 'Vereinshaus am Altrhein',
      description: 'Wir laden alle Mitglieder und Freunde des WSCKL zum großen Sommerfest ein. Für Grillgut und Getränke ist gesorgt.',
    }
  })

  await payload.create({
    collection: 'events',
    data: {
      title: 'Herbst-Regatta 2026',
      date: new Date('2026-09-05T09:00:00Z').toISOString(),
      location: 'Altrhein / De Bijland',
      description: 'Die traditionelle Herbst-Regatta für alle Bootsklassen. Anmeldung ab sofort beim Sportwart möglich.',
    }
  })

  // 3. Create Home Page with Advanced Blocks
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Startseite',
      slug: 'home',
      layout: [
        {
          blockType: 'hero',
          title: 'Wassersportclub Kleve e.V.',
          subtitle: 'Segeln, Gemeinschaft und Abenteuer am Niederrhein seit 1970.',
        },
        {
          blockType: 'pegel',
          title: 'Aktueller Rheinpegel (Emmerich)',
          station: 'EMMERICH',
        },
        {
          blockType: 'features',
          heading: 'Was uns auszeichnet',
          subheading: 'Entdecken Sie die Vorzüge unseres Vereins und der idyllischen Lage am Griethausener Altrhein.',
          features: [
            { 
              title: 'Segeln & Surfen', 
              description: 'Ideale Bedingungen auf dem Altrhein und dem nahegelegenen Wassersportzentrum "de Bijland".',
              icon: 'sailing'
            },
            { 
              title: 'Tolle Gemeinschaft', 
              description: 'Ein aufnahmebereiter, freundlicher Verein für Jung und Alt.',
              icon: 'users'
            },
            { 
              title: 'Natur pur', 
              description: 'Eingebettet in die idyllische und naturgeschützte Niederrheinlandschaft.',
              icon: 'waves'
            },
            { 
              title: 'Zentrale Lage', 
              description: 'Nur 4 km von der Stadt Kleve entfernt über den Spoykanal erreichbar.',
              icon: 'anchor'
            }
          ]
        },
        {
          blockType: 'content',
          columns: '1',
          accent: true,
          text: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Unser Hafen bietet ein ruhiges Plätzchen in einem verträumten-gemütlichen Revier. Ob als Gast oder als zukünftiges Mitglied – bei uns sind Sie immer herzlich willkommen.', type: 'text' }],
                }
              ],
            }
          } as any,
        },
        {
          blockType: 'cta',
          title: 'Werden Sie Teil unserer Crew!',
          description: 'Haben Sie Interesse an einer Mitgliedschaft oder möchten Sie uns als Gast besuchen?',
          buttonLabel: 'Kontakt aufnehmen',
          buttonLink: '/kontakt',
        },
        {
          blockType: 'info',
          heading: 'Vereinsdaten',
          items: [
            { label: 'Gegründet', value: '17. Februar 1970' },
            { label: 'Heimathafen', value: 'Griethausener Altrhein' },
            { label: 'Stadt', value: 'Kleve' },
          ],
        }
      ],
    },
  })

  console.log('✅ Advanced Home Page created')

  // 4. Create Impressum Page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Impressum',
      slug: 'impressum',
      layout: [
        {
          blockType: 'hero',
          title: 'Impressum',
          subtitle: 'Rechtliche Informationen zum Wassersportclub Kleve e.V.',
        },
        {
          blockType: 'content',
          columns: '1',
          text: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  tag: 'h2',
                  children: [{ text: 'Angaben gemäß § 5 TMG:', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Wassersportclub Kleve e. V.\nJahnstrasse 19a\n47533 Kleve', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h3',
                  children: [{ text: 'Vertreten durch:', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Josef Uwara', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h3',
                  children: [{ text: 'Kontakt:', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Telefon: +49 176 23363705\nE-Mail: info@wsckl.de', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h3',
                  children: [{ text: 'Registereintrag:', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Eintragung im Vereinsregister.\nRegistergericht: Amtsgericht Kleve\nRegisterblatt: VR-336', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h3',
                  children: [{ text: 'Umsatzsteuer-ID:', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:\nDE 116/5746/0394', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h3',
                  children: [{ text: 'Hinweis auf EU-Streitschlichtung', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: http://ec.europa.eu/consumers/odr\nUnsere E-Mail-Adresse finden sie oben im Impressum.', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Quelle: www.e-recht24.de', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h2',
                  children: [{ text: 'Haftungsausschluss (Disclaimer)', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h3',
                  children: [{ text: 'Haftung für Inhalte', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h3',
                  children: [{ text: 'Haftung für Links', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h3',
                  children: [{ text: 'Urheberrecht', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.', type: 'text' }],
                }
              ],
            }
          } as any,
        }
      ],
    },
  })
  console.log('✅ Impressum Page created')

  // 5. Create Datenschutz Page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Datenschutz',
      slug: 'datenschutz',
      layout: [
        {
          blockType: 'hero',
          title: 'Datenschutzerklärung',
          subtitle: 'Informationen zum Umgang mit Ihren Daten.',
        },
        {
          blockType: 'content',
          columns: '1',
          text: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Seite informiert Sie über die Erhebung und Speicherung von Daten.', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Sollten Sie Fragen zum Datenschutz haben, wenden Sie sich bitte an unseren Vorstand.', type: 'text' }],
                }
              ],
            }
          } as any,
        }
      ],
    },
  })
  // 6. Create 'Der Verein' Page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Der Verein',
      slug: 'verein',
      layout: [
        {
          blockType: 'hero',
          title: 'Der Verein',
          subtitle: 'Tradition und Leidenschaft am Griethausener Altrhein.',
        },
        {
          blockType: 'content',
          columns: '1',
          text: {
            root: {
              type: 'root',
              children: [{ type: 'paragraph', children: [{ text: 'Unser Vorstand setzt sich aus engagierten Mitgliedern zusammen, die den WSCKL mit Herzblut leiten.', type: 'text' }] }],
            }
          } as any,
        },
        {
          blockType: 'person',
          role: '1. Vorsitzender',
          name: 'Josef Uwara',
          address: 'Jahnstrasse 19a, 47533 Kleve',
          phone: '+49 176 23363705',
        },
        {
          blockType: 'person',
          role: '2. Vorsitzender',
          name: 'Olaf Derks',
          phone: '+49 174 3864991',
        },
        {
          blockType: 'person',
          role: 'Geschäftsführer',
          name: 'Dominik Bucksteeg',
          address: 'Nassauer Allee 120, 47533 Kleve',
          phone: '+49 157 82442742',
        },
        {
          blockType: 'person',
          role: 'Kassenwartin',
          name: 'Ute Stockhorst',
          phone: '+49 176 78217771',
        },
        {
          blockType: 'person',
          role: 'Takelwart / Hafenmeister',
          name: 'Frank Schmidt',
          phone: '+49 178 9051404',
        }
      ],
    },
  })
  console.log('✅ Merged Verein Page created')

  // 8. Create 'Satzung & Ordnungen' Page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Satzung & Ordnungen',
      slug: 'satzung',
      layout: [
        {
          blockType: 'hero',
          title: 'Satzung & Ordnungen',
          subtitle: 'Rechtliche Grundlagen und Regelungen des WSCKL.',
        },
        {
          blockType: 'content',
          columns: '1',
          text: {
            root: {
              type: 'root',
              children: [
                { type: 'paragraph', children: [{ text: 'Überarbeitete Fassung Stand 01.04.2010', type: 'text' }] },
                { type: 'heading', tag: 'h2', children: [{ text: 'Satzung des WSCKL', type: 'text' }] },
                { type: 'heading', tag: 'h3', children: [{ text: 'A. Name, Sitz, Zweck und Abzeichen des Vereins', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 1 Name und Sitz', type: 'text' }] },
                { type: 'paragraph', children: [{ text: 'Der am 17. Februar 1970 gegründete Verein führt den Namen „Wassersportclub“ Kleve e. V.“ (WSCKL). Er hat seinen Sitz in Kleve und ist in das Vereinsregister beim Amtsgericht Kleve eingetragen. Er ist Mitglied des Deutschen Seglerverbandes und des Deutschen Motoryachtverbandes.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 2 Vereinszweck', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Der Verein bezweckt die Pflege und Förderung des Wassersports mit Segel-, Motor- und anderen Sportbooten auf Grundlage des Amateurgedankens und der Gemeinnützigkeit, sowie die Förderung des Jugendsports. Weiter unterstützt der Verein die Ausübung des Wassersportes nach den Regeln des DSV und des DMYV. In diesem Zusammenhang fördert der Club das Betreiben des Wassersports als Breitensport zur körperlichen Ertüchtigung, die praktische und theoretische Weiterbildung seiner Mitglieder mit dem Ziel, das seemännische Können und damit die Sicherheit auf dem Wasser ständig zu verbessern. Der Verein ist um eine loyale Zusammenarbeit der Teilnehmer am Wassersport und mit der Berufsschifffahrt bemüht. Er verfolgt den Vereinszweck ausschließlich und unmittelbar durch Förderung sportlicher Übungen und Leistungen gemeinnütziger Zwecke im Sinne des Abschnitts "Steuerbegünstigte Zwecke der Abgabenordnung." Zur Erreichung dieser Ziele unterhält der Verein regelmäßigen Trainingsbetrieb in den Bereichen Segelsport, Knotenkunde und Seemannschaftslehre und nimmt an Sportwettkämpfen mit anderen Vereinen teil.\n(2) Der Verein ist selbstlos tätig; er verfolgt nicht in erster Linie eigenwirtschaftliche Zwecke.\n(3) Mittel des Vereins dürfen nur für die satzungsmäßigen Zwecke verwendet werden. Die Mitglieder erhalten keine Zuwendungen aus Mitteln des Vereins.\n(4) Es darf keine Person durch Ausgaben, die dem Zweck der Körperschaft fremd sind, oder durch unverhältnismäßig hohe Vergütung begünstigt werden.\n(5) Mitglieder erhalten bei ihrem Ausscheiden oder bei Auflösung des Vereins nicht mehr als ihre eingezahlten Kapitalanteile und den gemeinen Wert ihrer Sacheinlagen zurück.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 3 Vereinszeichen', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Der Clubstander zeigt auf weißgerandetem blauen Grund einen weißen Schwan. Die Mitgliedsnadel (Clubabzeichen) entspricht dem Clubstander.\n(2) Die Vereinsabzeichen sind nicht übertragbar. Ihre missbräuchliche Verwendung wird gerichtlich verfolgt.', type: 'text' }] },

                { type: 'heading', tag: 'h3', children: [{ text: 'B. Erwerb und Beendigung der Mitgliedschaft', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 4 Vereinsmitglieder', type: 'text' }] },
                { type: 'paragraph', children: [{ text: 'Der Verein besteht aus:\na) aktiven Mitgliedern,\nb) passiven Mitgliedern,\nc) jugendlichen Mitgliedern,\nd) Ehrenmitgliedern.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 5 Erwerb der Mitgliedschaft', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Aktives Mitglied kann werden, wer das 18. Lebensjahr vollendet hat, zu sportlich aktiver Betätigung bereit und schwimmbefähigt ist oder – unter den gleichen Voraussetzungen – Ehegatte eines aktiven Mitglieds ist. Als Nachweis wird das Schwimmabzeichen Bronze bzw. Freischwimmer akzeptiert. Jugendliche Mitglieder werden mit Vollendung des 18. Lebensjahres aktive Mitglieder.\n(2) Natürliche oder juristische Personen, die an der Förderung des Vereinszwecks interessiert sind, können passive Mitglieder werden.\n(3) Wer das 18. Lebensjahr noch nicht vollendet hat und im Besitz des Freischwimmerzeugnisses bzw. des Schwimmabzeichens Bronze ist, kann als jugendliches Mitglied aufgenommen werden.\n(4) Wer die Mitgliedschaft erwerben will, hat an den Vorstand ein schriftliches Aufnahmegesuch unter Angabe seiner vollständigen Personalien zu richten. Das Aufnahmegesuch muss von mindestens zwei aktiven Mitgliedern unterstützt werden. Minderjährige bedürfen außerdem der schriftlichen Zustimmung ihres gesetzlichen Vertreters.\n(5) Jeder Antrag wird vom Vorstand eingehend geprüft. Der Vorstand entscheidet darüber, ob der Antragsteller zur nächsten Mitgliederversammlung zur Vorstellung eingeladen wird. Die Aufnahme von Jugendlichen entscheidet der Vorstand in pflichtgemäßem Ermessen. Die Aufnahme von Jugendlichen und Ehegatten von aktiven Mitgliedern entscheidet der Vorstand im pflichtgemäßen Ermessen.\n(6) Die Mitgliederversammlung beschließt mit einfacher Mehrheit der anwesenden stimmberechtigten Mitglieder über das Aufnahmegesuch, nachdem dem Bewerber Gelegenheit zur persönlichen Vorstellung vor der Mitgliederversammlung gegeben wurde. Auf Antrag eines stimmberechtigten Mitgliedes kann die Entscheidung vertagt werden. Die nächste Mitgliederversammlung entscheidet sodann endgültig.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 6 Ehrenmitglieder', type: 'text' }] },
                { type: 'paragraph', children: [{ text: 'Zu Ehrenmitgliedern können auf Antrag des Vorstandes solche Personen ernannt werden, die sich besondere Verdienste um das Vereinswohl oder um die Förderung des Sports erworben haben. Die Ernennung muss in einer Hauptversammlung mit 4/5-Stimmenmehrheit der anwesenden stimmberechtigten Mitglieder erfolgen. Ehrenmitglieder haben die Rechte der aktiven Mitglieder; sie sind von der Pflicht zur Zahlung der Vereinsbeiträge befreit.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 7 Beendigung der Mitgliedschaft', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Die Mitgliedschaft endet durch den Tod, durch freiwilligen Austritt, durch Streichung von der Mitgliederliste oder durch Ausschluss aus dem Verein. Bei juristischen Personen endet die Mitgliedschaft durch deren Auflösung und somit dem Verlust der Rechtsfähigkeit.\n(2) Der freiwillige Austritt kann jederzeit - jedoch spätestens bis zum 31. Oktober für das folgende Kalenderjahr (Geschäftsjahr) - durch schriftliche Anzeige an den Vorstand erfolgen, doch bleibt die Verpflichtung zur Zahlung der Vereinsbeiträge für das laufende Jahr (Geschäftsjahr) bestehen.\n(3) Ein Mitglied kann durch Beschluss des Vorstandes von der Mitgliederliste gestrichen werden, wenn es trotz zweimaliger Mahnung mit der Zahlung des Beitrages in Rückstand ist. Die Streichung darf erst beschlossen werden, wenn seit der Absendung des zweiten Mahnschreibens als eingeschriebener Brief, in dem auf diese Folge hingewiesen ist, mehr als drei Monate vergangen sind. Die erfolgte Streichung ist dem bisherigen Mitglied schriftlich mitzuteilen.\n(4) Der Ausschluss ist zulässig,\n1. wenn ein Mitglied der Vereinssatzung oder den Beschlüssen der Mitgliederversammlung schuldhaft zuwiderhandelt,\n2. wenn ein Mitglied durch sein Verhalten das Ansehen oder die Interessen des Vereins grob fahrlässig oder vorsätzlich schädigt,\n3. bei unehrenhaftem Verhalten des Mitglieds,\n4. wenn ein Mitglied rechtmäßigen Anordnungen der Vereinsorgane oder ihrer Beauftragten beharrlich zuwiderhandelt.\n(5) Über den Ausschluss entscheidet die Mitgliederversammlung auf Vorschlag des Vorstandes nach Anhörung des Ehrenrates ohne Aussprache mit 3/4-Mehrheit der anwesenden stimmberechtigten Mitglieder.', type: 'text' }] },

                { type: 'heading', tag: 'h3', children: [{ text: 'C. Rechte und Pflichten der Mitglieder', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 8 Mitgliedesrechte', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Die Mitglieder haben nach Maßgabe dieser Satzung das Recht, an allen Vereinsveranstaltungen teilzunehmen, die Vereinseinrichtungen zu nutzen, Vereinsämter zu bekleiden sowie Anträge an die Mitgliederversammlung oder den Vorstand zu richten.\n(2) Stimmrecht in der Mitgliederversammlung haben allein die aktiven Mitglieder. Sie sind vorrangig berechtigt, die Vereinseinrichtungen zu nutzen, soweit diese nicht der Vereinsjugend vorbehalten sind.\n(3) Jedes Mitglied hat das Recht, Gäste einzuführen. Von Gästen wird erwartet, dass sie dem Verein keinen Schaden zufügen. Das Mitglied haftet gegebenenfalls wie für eigenes Verschulden. Ausgeschlossene oder von der Mitgliederliste gestrichene frühere Mitglieder können nicht als Gäste eingeführt werden.\n(4) Mitgliedsrechte müssen persönlich wahrgenommen werden. Sie sind nicht übertragbar. Bei Beschlüssen, die in eigener Sache eines Mitglieds gefasst werden sollen, steht diesem kein Stimmrecht zu.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 9 Angelegenheiten der Vereinsjugend', type: 'text' }] },
                { type: 'paragraph', children: [{ text: 'Die Mitglieder bis zum vollendeten 18. Lebensjahr sind in der Mitgliederversammlung nicht stimmberechtigt. Sie bilden die Vereinsjugend. Mit Vollendung des 18. Lebensjahres werden sie aktive Mitglieder. Die Angelegenheiten der Vereinsjugend regelt die von der Mitgliederversammlung besonders beschlossene Jugendordnung.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 10 Allgemeine Pflichten', type: 'text' }] },
                { type: 'paragraph', children: [{ text: 'Die Vereinsmitglieder verpflichten sich zu sportlicher, kameradschaftlicher Haltung untereinander und gegenüber allen Wassersporttreibenden unter Wahrung der anerkannten Yachtgebräuche. Fairness und Hilfsbereitschaft sind selbstverständlich Pflicht. Jedes Mitglied ist verpflichtet, sein Verhalten so einzurichten, dass der Verein weder in seinen Interessen geschädigt noch in seinem Ansehen beeinträchtigt wird.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 11 Beiträge und Gebühren', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Art und Höhe der Beitrags- und Gebührensätze werden von der Hauptversammlung beschlossen. Sie gelten bis zur Neufestsetzung unverändert weiter.\n(2) Zahlungen sind innerhalb von 4 Wochen nach Zustellung der Rechnung zu leisten. Auf begründeten Antrag ist der Kassenwart berechtigt, Teilzahlungen einzuräumen.', type: 'text' }] },

                { type: 'heading', tag: 'h3', children: [{ text: 'D. Vereinseinrichtungen', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 12 Steganlagen', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Der Anspruch auf einen ständigen Bootsliegeplatz am vereinseigenen Bootssteg steht nur aktiven Mitgliedern zu, die das Stegrecht erworben haben.\n(2) Für begrenzte Dauer können freie Liegeplätze Gastliegern gegen Zahlung einer Gebühr zur Verfügung gestellt werden. Auf § 30 wird verwiesen.\n(3) Die Benutzung der Steganlagen wird durch die von der Mitgliederversammlung zu erlassende Stegordnung geregelt.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 13 Yachtregister', type: 'text' }] },
                { type: 'paragraph', children: [{ text: 'Der Verein führt über die den Mitgliedern gehörenden Boote ein Verzeichnis. Für die Eintragung sind die Bestimmungen des Deutschen Seglerverbandes und des Deutschen Motoryachtverbandes maßgebend. Erst nach Aufnahme in das Register gilt ein Sportboot als Clubyacht und muss den Clubnamen führen.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 14 Clubstander', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Die Führung des Clubstanders (§ 3) ist nur Vereinsmitgliedern für die ihnen gehörenden Sportboote, die keinen gewerblichen Zwecken dienen dürfen, gestattet.\n(2) Für nicht sportgerecht gehaltene Fahrzeuge kann der Vorstand die Berechtigung zur Führung des Clubstanders nach vorheriger Verwarnung entziehen.', type: 'text' }] },

                { type: 'heading', tag: 'h3', children: [{ text: 'E. Organe des Vereins', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 15 Vereinsorgane', type: 'text' }] },
                { type: 'paragraph', children: [{ text: 'Die Vereinsorgane sind:\n1.) die Mitgliederversammlung,\n2.) der Vorstand\n3.) der erweiterte Vorstand,\n4.) die Kommissionen,\n5.) der Jugendausschuss,\n6.) der Ehrenrat', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 16 Amtsdauer der Vereinsorgane', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Die Vereinsorgane werden für die Dauer von zwei Jahren, vom Tage der Wahl an gerechnet, von der Hauptversammlung gewählt; sie bleiben jedoch bis zur ihrer Neuwahl im Amt. Jedes Organmitglied ist einzeln zu wählen. Wählbar sind nur Mitglieder. Die Bestimmungen der Jugendordnung bezüglich der Wahl des Jugendausschusses bleiben unberührt.\n(2) Mitglieder der Vereinsorgane können jederzeit einzeln oder geschlossen von ihrem Amt zurücktreten. Abs. 1 - Satz 1, 2. Halbsatz gilt entsprechend. Innerhalb von zwei Monaten ist in einer Hauptversammlung über ihre Entlastung zu beschließen und die Neuwahl vorzunehmen. Die Amtsdauer der nachgewählten Organmitglieder endet, abweichend von Abs. 1, mit der allgemeinen Neuwahl in der betreffenden Jahreshauptversammlung.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 17 Die Mitgliederversammlung', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Die Mitgliederversammlung ist oberstes Vereinsorgan. Sie entscheidet über alle Vereinsangelegenheiten, soweit die Entscheidung durch diese Satzung nicht anderen Vereinsorganen übertragen ist oder im Einzelfalle durch ihren Beschluss übertragen wird. Sie ist insbesondere zuständig für...\n(2) Die Mitgliederversammlung findet als Jahreshauptversammlung im ersten Quartal eines jeden Jahres statt...\n(3) Der Vorsitzende kann in dringenden Fällen eine außerordentliche Hauptversammlung einberufen...\n(4) Die außerordentliche Hauptversammlung ist befugt, über alle Vereinsangelegenheiten zu beschließen...\n(5) Sonstige Mitgliederversammlungen werden vom Vorsitzenden einberufen...\n(6) Der Kassenprüfer wird für die Dauer eines Geschäftsjahres gewählt...\n(7) Die Mitgliederversammlung ist nicht öffentlich.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 18 Anträge', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Anträge an die Mitgliederversammlung müssen mindestens zwei Wochen vor dem Versammlungstermin schriftlich beim Vorstand zu Händen des Vorsitzenden eingebracht worden sein...\n(2) Nicht ordnungsgemäß eingebrachte Anträge können von der Mitgliederversammlung behandelt werden...\n(3) Zu Gegenständen der Tagesordnung kann bis zu ihrer Abstimmung jedes Mitglied Anträge stellen.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 19 Beschlussfähigkeit, Abstimmungen und Wahlen', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Mitgliederversammlungen sind ohne Rücksicht auf die Anzahl der anwesenden Mitglieder beschlussfähig.\n(2) Bei der Beschlussfassung wird offen abgestimmt, sofern nicht geheime Abstimmung durch Abgabe von Stimmzetteln beantragt wird.\n(3) Bei Abstimmungen entscheidet die einfache Stimmenmehrheit...\n(4) Wahlen werden, wenn niemand widerspricht, durch Zuruf oder offene Abstimmung, sonst durch Abgabe von Stimmzetteln vollzogen. Der Vorstand (§ 21) wird stets mit Stimmzetteln gewählt.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 20 Niederschriften', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Über alle Mitgliederversammlungen ist eine Niederschrift aufzunehmen...\n(2) Allen Mitgliedern sind die Beschlüsse als Auszug aus der Niederschrift zuzuleiten oder im Bootshaus am schwarzen Brett auszuhängen.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 21 Der Vorstand', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Der Vorstand besteht aus dem Vorsitzenden, dem stellvertretenden Vorsitzenden, dem Geschäftsführer, dem Kassenwart und dem Takelwart...\n(2) Der Verein wird gerichtlich oder außergerichtlich durch den Vorsitzenden oder den stellvertretenden Vorsitzenden vertreten. Sie sind jeweils allein vertretungsberechtigt.\n(3) Der Vorstand tritt auf Einberufung durch den Vorsitzenden zusammen...\n(4) Mitglieder des Vorstandes können weder freie Mitarbeiter noch Angestellte des Wassersportclub Kleve e.V. sein.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 22 Der erweiterte Vorstand', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Der erweiterte Vorstand besteht aus: dem Vorstand, dem Bootsmann, dem Jugendobmann, dem Vorsitzenden der Sportkommission, dem Vorsitzenden der Kommission zur Pflege des Vereinslebens.\n(2) Der erweiterte Vorstand tritt mindestens zweimal jährlich zusammen...\n(4) Den Mitgliedern des erweiterten Vorstands sind entstandene notwendige Kosten zu erstatten...\n(5) Der erweiterte Vorstand ist zuständig für die Bewilligung von Ausgaben über € 5000...', type: 'text' }] },

                { type: 'heading', tag: 'h3', children: [{ text: 'F. Wahrnehmung der Vereinsangelegenheiten', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '§ 23 Aufgaben des Vorstandes\n§ 24 Aufgaben des erweiterten Vorstandes\n§ 25 Vorsitzender\n§ 26 Stellvertretender Vorsitzender\n§ 27 Geschäftsführer\n§ 28 Kassenwart\n§ 29 Kassenprüfer\n§ 30 Takelwart\n§ 31 Bootsmann\n§ 32 Jugendobmann\n§ 33 Kommissionen\n§ 34 Sportkommission\n§ 35 Kommission zur Pflege des Vereinslebens\n§ 36 Vereinsjugendausschuss\n§ 37 Ehrenrat\n§ 38 Technische Satzungsänderungen', type: 'text' }] },

                { type: 'heading', tag: 'h3', children: [{ text: 'G. Schlussbestimmungen', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 39 Änderungen von Vereinsrecht', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Die Satzung sowie Beschlüsse der Mitgliederversammlung können nur durch eine Hauptversammlung aufgehoben, geändert oder ergänzt werden...\n(2) Zur Abänderung der Satzung ist eine 3/4- Mehrheit erforderlich.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 40 Auflösung des Vereins', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Der Verein wird aufgelöst, wenn eine Hauptversammlung dies mit 3/4-Mehrheit beschließt...\n(2) Bei Auflösung fällt das Vermögen an die Deutsche Gesellschaft zur Rettung Schiffbrüchiger.', type: 'text' }] },
                { type: 'heading', tag: 'h4', children: [{ text: '§ 41 Inkrafttreten', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '(1) Diese Satzung ersetzt die bisherige Vereinssatzung vom 17.02.1970.\n(2) Diese Satzung tritt mit ihrer Eintragung ins Vereinsregister in Kraft.\n(3) Soweit diese Satzung nichts anderes vorschreibt, gelten die Vorschriften §§ 21-79 BGB.', type: 'text' }] },

                { type: 'heading', tag: 'h2', children: [{ text: 'Jugendordnung der Jugendabteilung', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '§ 1 Mitgliedschaft und Verwaltung\n§ 2 Aufgaben der Jugendabteilung\n§ 3 Organe\n§ 4 Der Vereinsjugendtag\n§ 5 Vereinsjugendausschuss\n§ 6 Änderungen der Jugendordnung', type: 'text' }] },

                { type: 'heading', tag: 'h2', children: [{ text: 'Stegordnung', type: 'text' }] },
                { type: 'heading', tag: 'h3', children: [{ text: '1. Verhalten am Steg', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '1.1 Halte Kameradschaft und sei hilfsbereit!\n1.2 Der Takelwart ist für Sicherheit und Ordnung verantwortlich!\n1.3 Halte das Wasser sauber!\n1.4 Halte dich an die gesetzlichen Bestimmungen!\n1.5 Denke an Deine Sicherheit!\n1.6 Nimm Rücksicht auf Deine Kameraden!\n1.7 Halte dich an die anerkannten Yachtgebräuche', type: 'text' }] },
                { type: 'heading', tag: 'h3', children: [{ text: '2. Nutzung der Anlage', type: 'text' }] },
                { type: 'paragraph', children: [{ text: '2.1 Allgemeines\n2.2 Stegrecht\n2.3 Vergabe der Liegeplätze\n2.4 Liegeplatzgebühr\n2.5 Stegunterhalt\n2.6 Nutzung der Anlagen\n2.7 Haftung\n2.8 Verstöße gegen die Stegordnung', type: 'text' }] }
              ],
            }
          } as any,
        }
      ],
    },
  })
  console.log('✅ Satzung Page created')


  // 7. Create 'Steganlage' Page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Unsere Steganlage',
      slug: 'steganlage',
      layout: [
        {
          blockType: 'hero',
          title: 'Unsere Steganlage',
          subtitle: 'Ein sicherer Hafen am Niederrhein.',
        },
        {
          blockType: 'features',
          heading: 'Ausstattung & Kapazität',
          subheading: 'Moderne Technik und geschützte Lage für Ihr Boot.',
          features: [
            { title: '68 Liegeplätze', description: 'Im Wasser für Segel- und Motorboote bis 11 Meter Länge.', icon: 'waves' },
            { title: '5 Jollenplätze', description: 'Spezielle Plätze für kleinere Jollen auf dem Jollensteg.', icon: 'anchor' },
            { title: 'Voll erschlossen', description: 'Aluminiumsteg mit eigener Strom- und Wasserversorgung an jedem Platz.', icon: 'sailing' },
            { title: 'Vereinshaus', description: 'Gemütliches Clubhaus mit modernen Sanitäreinrichtungen nach Umweltrichtlinien.', icon: 'users' },
          ]
        },
        {
          blockType: 'content',
          columns: '1',
          text: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Ein Bootssteg ist der wesentliche und wichtigste Teil eines Yachthafens. Ihm vertrauen die Wassersportler ihr liebstes Sportgerät an, und dabei steht der materielle Wert eines Schiffes für seinen Eigner in der Regel an zweiter Stelle.\n\nAbgesehen von den ideellen Werten liegen an Bootsstegen aber selbstverständlich auch beträchtliche materielle Werte - bei uns nicht ganz so viel wie in den Yachthäfen von Nizza oder Monte Carlo. Wie dem auch sei, nicht nur die Eigner großer Schiffe, sondern natürlich auch der Besitzer einer kleineren Jolle erwartet, dass sein Boot im Hafen sicher liegt und keinen Schaden nimmt.', type: 'text' }],
                },
                {
                  type: 'heading',
                  tag: 'h3',
                  children: [{ text: 'Sicherheit durch Qualität', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'Halt und Schutz geben kann ein Bootssteg nur, wenn er solide gebaut und selber gut verankert ist. Und genau an diesem Punkt setzt die Verantwortung für den Betreiber einer Steganlage ein. Der Wassersportclub Kleve als gemeinnütziger eingetragener Verein hat sich dieser Verantwortung gestellt und den im Jahre 1990 neu errichteten Aluminiumsteg als Elementbau unsinkbar bis heute in einen tadelllosen Zustand gehalten.', type: 'text' }],
                },
                {
                  type: 'paragraph',
                  children: [{ text: 'In vielen Stunden durch Eigenleistung der Mitglieder ist die gesamte Anlage in einem technisch einwandfreien Zustand mit Stromversorgung für jeden Liegeplatz gehalten worden. Unser Hafen hat, nicht zuletzt durch seine geschützte Lage, bis heute keine wesentlichen Schäden durch Umwelteinflüsse erhalten.', type: 'text' }],
                }
              ],
            }
          } as any,
        },
        {
          blockType: 'cta',
          title: 'Interesse an einem Liegeplatz?',
          description: 'Egal ob als Vereinsmitglied oder als Gast für die Saison (01.04. bis 31.10.) – wir freuen uns auf Dich.',
          buttonLabel: 'Jetzt online beantragen',
          buttonLink: '/antrag-liegeplatz',
        }
      ],
    },
  })
  console.log('✅ Steganlage Page created')

  console.log('Seed finished successfully!')
  process.exit(0)
}

seed()
