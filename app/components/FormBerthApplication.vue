<template>
  <div class="berth-form-container" v-animate-on-scroll>
    <!-- Step Indicator -->
    <div class="steps-indicator" v-if="!success">
      <div 
        v-for="(step, idx) in steps" 
        :key="idx" 
        class="step-item"
        :class="{ 'active': currentStep === idx, 'completed': currentStep > idx }"
      >
        <div class="step-number">
          <Check v-if="currentStep > idx" :size="16" />
          <span v-else>{{ idx + 1 }}</span>
        </div>
        <span class="step-label">{{ step.title }}</span>
      </div>
    </div>

    <div class="form-card glass">
      <div v-if="success" class="success-state">
        <div class="success-icon-wrapper">
          <Check :size="48" />
        </div>
        <h2>Antrag erfolgreich gesendet!</h2>
        <p>Vielen Dank für Deinen Antrag auf einen Bootsliegeplatz. Wir haben Deine Daten erhalten und werden uns in Kürze bei Dir melden.</p>
        <button @click="resetForm" class="btn btn-primary mt-8">Neuen Antrag stellen</button>
      </div>

      <form v-else @submit.prevent="handleFinalSubmit" class="berth-form">
        
        <!-- STEP 1: ALLGEMEIN -->
        <div v-if="currentStep === 0" class="step-content">
          <header class="step-header">
            <Calendar class="step-icon" />
            <div>
              <h1>Allgemeine Angaben</h1>
              <p>Wähle das Jahr und den gewünschten Liegeplatztyp aus.</p>
            </div>
          </header>

          <div class="form-grid">
            <div class="form-group">
              <label>Für das Jahr</label>
              <input v-model="form.year" type="text" placeholder="z.B. 2026" required />
            </div>
            <div class="form-group">
              <label>Saisonzeitraum</label>
              <input type="text" value="01.04. bis 31.10." disabled class="input-readonly" />
            </div>
            <div class="form-group full-width">
              <label>Gewünschter Liegeplatz</label>
              <div class="custom-radio-group">
                <label class="custom-radio">
                  <input type="radio" v-model="form.berthType" value="water" required />
                  <span class="radio-box"></span>
                  <span class="radio-label-text">Im Wasser</span>
                </label>
                <label class="custom-radio">
                  <input type="radio" v-model="form.berthType" value="dinghy" required />
                  <span class="radio-box"></span>
                  <span class="radio-label-text">Auf dem Jollensteg</span>
                </label>
              </div>
            </div>
            <div class="form-group full-width">
              <label class="custom-checkbox">
                <input type="checkbox" v-model="form.powerConnection" />
                <span class="checkbox-box"></span>
                <span class="checkbox-label-text">Stromanschluss gewünscht (bestätige Einhaltung VDE-Vorschriften)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- STEP 2: ANTRAGSTELLER -->
        <div v-if="currentStep === 1" class="step-content">
          <header class="step-header">
            <User class="step-icon" />
            <div>
              <h1>Antragsteller</h1>
              <p>Wer stellt den Antrag? Bitte gib Deine persönlichen Daten an.</p>
            </div>
          </header>

          <div class="form-grid">
            <div class="form-group full-width">
              <label>Status</label>
              <div class="custom-radio-group">
                <label class="custom-radio">
                  <input type="radio" v-model="form.status" value="owner" required />
                  <span class="radio-box"></span>
                  <span class="radio-label-text">Bootseigner</span>
                </label>
                <label class="custom-radio">
                  <input type="radio" v-model="form.status" value="member" required />
                  <span class="radio-box"></span>
                  <span class="radio-label-text">Vereinsmitglied</span>
                </label>
                <label class="custom-radio">
                  <input type="radio" v-model="form.status" value="guest" required />
                  <span class="radio-box"></span>
                  <span class="radio-label-text">Gastlieger</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>Nachname</label>
              <input v-model="form.lastName" type="text" placeholder="Mustermann" required />
            </div>
            <div class="form-group">
              <label>Vorname</label>
              <input v-model="form.firstName" type="text" placeholder="Max" required />
            </div>
            <div class="form-group full-width">
              <label>Straße / Hausnummer</label>
              <input v-model="form.street" type="text" placeholder="Beispielweg 123" required />
            </div>
            <div class="form-group">
              <label>PLZ / Ort</label>
              <input v-model="form.zipCity" type="text" placeholder="47533 Kleve" required />
            </div>
            <div class="form-group">
              <label>Telefon</label>
              <input v-model="form.phone" type="tel" placeholder="+49..." required />
            </div>
            <div class="form-group">
              <label>Fax (optional)</label>
              <input v-model="form.fax" type="tel" placeholder="+49..." />
            </div>
            <div class="form-group">
              <label>E-Mail</label>
              <input v-model="form.email" type="email" placeholder="max@beispiel.de" required />
            </div>
            <div class="form-group">
              <label>Bootsführerschein/e</label>
              <input v-model="form.licenses" type="text" placeholder="z.B. SBF Binnen/See" />
            </div>
          </div>
        </div>

        <!-- STEP 3: FAHRZEUG -->
        <div v-if="currentStep === 2" class="step-content">
          <header class="step-header">
            <Ship class="step-icon" />
            <div>
              <h1>Wassersportfahrzeug</h1>
              <p>Details zu Deinem Boot für die Liegeplatzberechnung.</p>
            </div>
          </header>

          <div class="form-group full-width mb-6">
            <label class="custom-checkbox highlight">
              <input type="checkbox" v-model="form.boatSameAsLastYear" />
              <span class="checkbox-box"></span>
              <span class="checkbox-label-text">Daten wie im Vorjahr (keine Änderungen)</span>
            </label>
          </div>
          
          <div v-if="!form.boatSameAsLastYear" class="form-grid">
            <div class="form-group">
              <label>Name des Bootes</label>
              <input v-model="form.boat.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Art / Typ</label>
              <input v-model="form.boat.type" type="text" required />
            </div>
            <div class="form-group">
              <label>Bauwerkstoff Rumpf</label>
              <input v-model="form.boat.material" type="text" />
            </div>
            <div class="form-group">
              <label>Tiefgang (m)</label>
              <input v-model="form.boat.draft" type="number" step="0.01" />
            </div>
            <div class="form-group">
              <label>Größte Länge (m)</label>
              <input v-model="form.boat.length" type="number" step="0.01" required />
            </div>
            <div class="form-group">
              <label>Größte Breite (m)</label>
              <input v-model="form.boat.width" type="number" step="0.01" required />
            </div>
            <div class="form-group">
              <label>Segelfläche (m²)</label>
              <input v-model="form.boat.sailArea" type="number" step="0.1" />
            </div>
            <div class="form-group">
              <label>Amtl. Kennzeichen</label>
              <input v-model="form.boat.registration" type="text" />
            </div>
            <div class="form-group">
              <label>Motoren / Hersteller</label>
              <input v-model="form.boat.engine" type="text" />
            </div>
            <div class="form-group">
              <label>Leistung (PS o. KW)</label>
              <input v-model="form.boat.power" type="text" />
            </div>
            <div class="form-group">
              <label>Kraftstoff</label>
              <div class="select-wrapper">
                <select v-model="form.boat.fuel">
                  <option value="diesel">Diesel</option>
                  <option value="petrol">Benzin</option>
                </select>
                <ChevronDown class="select-icon" :size="18" />
              </div>
            </div>
            <div class="form-group">
              <label>Motorart</label>
              <div class="select-wrapper">
                <select v-model="form.boat.engineType">
                  <option value="inboard">Innenborder</option>
                  <option value="outboard">Außenborder</option>
                </select>
                <ChevronDown class="select-icon" :size="18" />
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 4: VERSICHERUNG & ARBEITSDIENST -->
        <div v-if="currentStep === 3" class="step-content">
          <header class="step-header">
            <ShieldCheck class="step-icon" />
            <div>
              <h1>Versicherung & Dienst</h1>
              <p>Haftpflicht-Nachweis und Arbeitsdienst-Beteiligung.</p>
            </div>
          </header>

          <div class="form-group full-width mb-6">
            <p class="info-note">Haftpflichtversicherung von mindestens € 1 Mio. ist zwingend erforderlich.</p>
            <label class="custom-checkbox highlight">
              <input type="checkbox" v-model="form.insuranceSameAsLastYear" />
              <span class="checkbox-box"></span>
              <span class="checkbox-label-text">Versicherungsdaten wie im Vorjahr</span>
            </label>
          </div>

          <div v-if="!form.insuranceSameAsLastYear" class="form-grid">
            <div class="form-group">
              <label>Versicherer / Agentur</label>
              <input v-model="form.insurance.carrier" type="text" required />
            </div>
            <div class="form-group">
              <label>Police-Nr.</label>
              <input v-model="form.insurance.policyNo" type="text" required />
            </div>
            <div class="form-group">
              <label>Gültig von</label>
              <input v-model="form.insurance.from" type="date" required />
            </div>
            <div class="form-group">
              <label>Gültig bis</label>
              <input v-model="form.insurance.to" type="date" required />
            </div>
          </div>

          <div class="form-group full-width mt-8">
            <label>Teilnahme am gemeinsamen Arbeitsdienst</label>
            <div class="custom-radio-group vertical">
              <label class="custom-radio">
                <input type="radio" v-model="form.serviceDuty" value="participate" required />
                <span class="radio-box"></span>
                <span class="radio-label-text">Ich nehme teil (5 Pflichtstunden je Saison)</span>
              </label>
              <label class="custom-radio">
                <input type="radio" v-model="form.serviceDuty" value="not_participate" required />
                <span class="radio-box"></span>
                <span class="radio-label-text">Ich nehme nicht teil</span>
              </label>
              <label class="custom-radio">
                <input type="radio" v-model="form.serviceDuty" value="exempt" required />
                <span class="radio-box"></span>
                <span class="radio-label-text">Befreit (Nachweis erforderlich)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- STEP 5: ZUSAMMENFASSUNG -->
        <div v-if="currentStep === 4" class="step-content">
          <header class="step-header">
            <Calculator class="step-icon" />
            <div>
              <h1>Zusammenfassung</h1>
              <p>Überprüfe Deine Angaben und die voraussichtlichen Kosten.</p>
            </div>
          </header>

          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Zeitraum:</span>
              <span class="summary-value">Saison {{ form.year }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Antragsteller:</span>
              <span class="summary-value">{{ form.firstName }} {{ form.lastName }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Boot:</span>
              <span class="summary-value">{{ form.boatSameAsLastYear ? 'Wie im Vorjahr' : form.boat.name }}</span>
            </div>
          </div>

          <!-- Kalkulation in Zusammenfassung -->
          <div class="calculation-box mt-8">
            <div v-if="calculation && calculation.details.length" class="calc-list">
              <div v-for="(item, idx) in calculation.details" :key="idx" class="calc-row">
                <span>{{ item.label }}</span>
                <span class="font-bold">{{ item.value.toFixed(2) }} €</span>
              </div>
              <div class="calc-total-row">
                <span>Gesamt (geschätzt)</span>
                <span>{{ calculation.total.toFixed(2) }} €</span>
              </div>
            </div>
            <div v-else class="calc-hint">
              <Info :size="18" />
              <p>Bitte vervollständige die Bootsmaße in Schritt 3 für eine Kostenschätzung.</p>
            </div>
          </div>

          <div class="confirmation-box mt-8">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="form.acceptedTerms" required />
              <span class="checkbox-box"></span>
              <span class="checkbox-label-text">
                Die Richtigkeit der Angaben wird versichert. Ich erkenne die Satzung-, Steg- und Gebührenordnung des WSCKL Kleve an.
              </span>
            </label>
          </div>
        </div>

        <!-- Form Navigation -->
        <div class="form-nav">
          <button 
            v-if="currentStep > 0" 
            type="button" 
            @click="prevStep" 
            class="btn btn-outline"
          >
            <ChevronLeft :size="20" class="mr-2" />
            Zurück
          </button>
          
          <button 
            v-if="currentStep < steps.length - 1" 
            type="button" 
            @click="nextStep" 
            class="btn btn-primary ml-auto"
          >
            Weiter
            <ChevronRight :size="20" class="ml-2" />
          </button>
          
          <button 
            v-else 
            type="submit" 
            class="btn btn-primary ml-auto btn-large" 
            :disabled="isSubmitting || !form.acceptedTerms"
          >
            <Loader2 v-if="isSubmitting" class="animate-spin mr-2" />
            Antrag jetzt einreichen
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Check, User, Ship, Calendar, 
  ShieldCheck, FileCheck, Loader2, 
  ChevronDown, Calculator, Info,
  ChevronRight, ChevronLeft
} from 'lucide-vue-next'

const success = ref(false)
const isSubmitting = ref(false)
const currentStep = ref(0)
const pricing = ref<any>({
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
})

const steps = [
  { title: 'Basis' },
  { title: 'Person' },
  { title: 'Boot' },
  { title: 'Details' },
  { title: 'Abschluss' }
]

onMounted(async () => {
  try {
    const { cmsUrl } = useCmsApi()
    const res = await $fetch(cmsUrl('/globals/site-settings')) as any
    if (res && res.pricing) pricing.value = res.pricing
  } catch (e) {
    console.warn('Verwende Standardpreise.')
  }
})

const initialFormState = {
  year: '2026',
  berthType: 'water',
  powerConnection: false,
  status: 'member',
  firstName: '',
  lastName: '',
  street: '',
  zipCity: '',
  phone: '',
  fax: '',
  email: '',
  licenses: '',
  boatSameAsLastYear: false,
  boat: {
    name: '', type: '', material: '', draft: '', length: '', width: '',
    sailArea: '', registration: '', engine: '', power: '', fuel: 'diesel', engineType: 'inboard'
  },
  insuranceSameAsLastYear: false,
  insurance: { carrier: '', policyNo: '', from: '', to: '' },
  serviceDuty: 'participate',
  acceptedTerms: false
}

const form = ref({ ...initialFormState })

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const calculation = computed(() => {
  if (!pricing.value) return null
  let total = 0
  const details = []
  const isGuest = form.value.status === 'guest'
  const statusKey = isGuest ? 'guest' : 'member'
  
  if (form.value.berthType === 'water') {
    const length = Number(form.value.boat.length) || 0
    const width = Number(form.value.boat.width) || 0
    if (length > 0 && width > 0) {
      let boxLength = length
      const configBoxLengths = pricing.value.box_lengths || [6, 8, 9]
      for (const bl of configBoxLengths) { if (length <= bl) { boxLength = bl; break; } }
      const calcArea = (width + 1) * boxLength
      const perM2 = pricing.value.berth.water[statusKey].per_m2
      const berthCost = calcArea * perM2
      details.push({ label: `Liegeplatz Wasser (${calcArea.toFixed(2)} m²)`, value: berthCost })
      total += berthCost
      if (isGuest && pricing.value.berth.water.guest.base_fee) {
        total += pricing.value.berth.water.guest.base_fee
        details.push({ label: 'Gastliegerbeitrag', value: pricing.value.berth.water.guest.base_fee })
      }
    }
  } else {
    const cost = pricing.value.berth.dinghy[statusKey].fixed
    details.push({ label: 'Jollensteg Pauschale', value: cost })
    total += cost
  }

  if (form.value.powerConnection && pricing.value.power) {
    total += (pricing.value.power.connection_fee + pricing.value.power.advance_payment)
    details.push({ label: 'Strom (Anschluss & Vorauszahlung)', value: pricing.value.power.connection_fee + pricing.value.power.advance_payment })
  }
  return { details, total }
})

const handleFinalSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      subject: `Antrag Liegeplatz ${form.value.year} - ${form.value.lastName}`,
      totalEstimate: calculation.value?.total || 0,
      ...form.value
    }
    await useApi().mail.sendContactMail(payload)
    success.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    alert('Fehler beim Senden.')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = { ...initialFormState }
  currentStep.value = 0
  success.value = false
}
</script>

<style scoped>
.berth-form-container {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 5rem;
}

/* Step Indicator */
.steps-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
  padding: 0 1rem;
}

.steps-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 3rem;
  right: 3rem;
  height: 2px;
  background: var(--color-bg-alt);
  z-index: 1;
}

.step-item {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 80px;
}

.step-number {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid var(--color-bg-alt);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: var(--color-text-muted);
  transition: var(--transition);
}

.step-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-muted);
  text-align: center;
}

.step-item.active .step-number {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
  box-shadow: 0 0 0 5px rgba(0, 119, 190, 0.1);
}

.step-item.active .step-label {
  color: var(--color-secondary);
}

.step-item.completed .step-number {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
  color: white;
}

/* Form Card */
.form-card {
  padding: 4rem;
  border-radius: var(--radius-lg);
  background: white;
  box-shadow: var(--shadow-md);
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-bg-alt);
}

.step-icon {
  width: 48px;
  height: 48px;
  color: var(--color-secondary);
  background: var(--color-bg-alt);
  padding: 10px;
  border-radius: 12px;
}

.step-header h1 { font-size: 1.8rem; margin-bottom: 0.25rem; }
.step-header p { color: var(--color-text-muted); font-size: 0.95rem; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.full-width { grid-column: span 2; }

.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--color-primary); opacity: 0.8; }

input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], select {
  padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid rgba(10,36,114,0.1); background: var(--color-bg); font-family: inherit; font-size: 1rem; transition: var(--transition);
}

input:focus, select:focus { outline: none; border-color: var(--color-secondary); background: white; box-shadow: 0 0 0 4px rgba(0,119,190,0.1); }
.input-readonly { background: var(--color-bg-alt) !important; color: var(--color-text-muted); cursor: not-allowed; }

.select-wrapper { position: relative; display: flex; align-items: center; }
.select-wrapper select { width: 100%; appearance: none; padding-right: 3rem; }
.select-icon { position: absolute; right: 1.25rem; color: var(--color-secondary); pointer-events: none; }

/* Custom Inputs */
.custom-radio-group { display: flex; gap: 2rem; margin-top: 0.5rem; }
.custom-radio-group.vertical { flex-direction: column; gap: 1rem; }
.custom-radio, .custom-checkbox { display: flex; align-items: center; gap: 1rem; cursor: pointer; position: relative; transition: var(--transition); }
.custom-radio input, .custom-checkbox input { position: absolute; opacity: 0; cursor: pointer; }

.radio-box, .checkbox-box { width: 24px; height: 24px; border: 2px solid rgba(10,36,114,0.2); background: white; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
.radio-box { border-radius: 50%; }
.checkbox-box { border-radius: 6px; }

.radio-box::after { content: ''; width: 12px; height: 12px; border-radius: 50%; background: var(--color-accent); transform: scale(0); transition: var(--transition); }
.checkbox-box::after { content: '✓'; color: var(--color-accent); font-weight: 800; font-size: 14px; transform: scale(0); transition: var(--transition); }

.custom-radio:hover .radio-box, .custom-checkbox:hover .checkbox-box { border-color: var(--color-secondary); }
.custom-radio input:checked + .radio-box, .custom-checkbox input:checked + .checkbox-box { border-color: var(--color-primary); background: var(--color-primary); }
.custom-radio input:checked + .radio-box::after, .custom-checkbox input:checked + .checkbox-box::after { transform: scale(1); }

.radio-label-text, .checkbox-label-text { font-size: 1rem; color: var(--color-text); font-weight: 500; }
.custom-checkbox.highlight { background: var(--color-bg-alt); padding: 1rem; border-radius: var(--radius-md); }

/* Summary & Calc */
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; background: var(--color-bg-alt); padding: 2rem; border-radius: var(--radius-md); }
.summary-item { display: flex; flex-direction: column; gap: 0.25rem; }
.summary-label { font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700; }
.summary-value { font-weight: 600; color: var(--color-primary); }

.calculation-box { background: var(--color-primary); color: white; padding: 2.5rem; border-radius: var(--radius-md); }
.calc-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); opacity: 0.9; }
.calc-total-row { display: flex; justify-content: space-between; margin-top: 1.5rem; padding-top: 1.5rem; font-size: 1.5rem; font-weight: 800; color: var(--color-accent); }
.calc-hint { display: flex; align-items: center; gap: 1rem; opacity: 0.7; font-style: italic; }

.confirmation-box { padding: 1.5rem; border-left: 4px solid var(--color-secondary); background: var(--color-bg-alt); border-radius: 0 var(--radius-md) var(--radius-md) 0; }

.form-nav { margin-top: auto; padding-top: 3rem; display: flex; }
.btn-outline { border: 2px solid var(--color-bg-alt); color: var(--color-text-muted); background: transparent; padding: 0.75rem 2rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: var(--transition); display: flex; align-items: center; }
.btn-outline:hover { border-color: var(--color-secondary); color: var(--color-secondary); }

.success-state { text-align: center; padding: 4rem 2rem; }
.success-icon-wrapper { width: 100px; height: 100px; background: #f0fdf4; color: #22c55e; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto 2.5rem; }

.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .form-card { padding: 2rem 1.25rem; }
  .form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
  .steps-indicator { display: none; }
  
  .step-header { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 1rem; 
    margin-bottom: 2rem;
  }
  
  .custom-radio-group { 
    flex-direction: column; 
    gap: 1rem; 
  }

  .form-nav {
    flex-direction: column;
    gap: 1rem;
  }

  .form-nav .btn {
    width: 100%;
    justify-content: center;
  }

  .form-nav .btn.ml-auto {
    margin-left: 0;
  }
  
  .calculation-box {
    padding: 1.5rem;
  }

  .calc-total-row {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .form-card { padding: 1.5rem 1rem; }
  .step-header h1 { font-size: 1.5rem; }
  .berth-form-container { padding: 0 0.5rem 3rem; }
}
</style>
