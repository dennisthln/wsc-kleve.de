<template>
  <div class="member-form-container" v-animate-on-scroll>
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
        <p>Vielen Dank für Deinen Aufnahmeantrag. Wir haben Deine Daten erhalten und werden uns in Kürze bei Dir melden.</p>
        <button @click="resetForm" class="btn btn-primary mt-8">Neuen Antrag stellen</button>
      </div>

      <form v-else @submit.prevent="handleFinalSubmit" class="member-form">
        
        <!-- STEP 1: MITGLIEDSCHAFTSTYP -->
        <div v-if="currentStep === 0" class="step-content">
          <header class="step-header">
            <UserPlus class="step-icon" />
            <div>
              <h1>Aufnahmeantrag</h1>
              <p>Wähle bitte aus, welche Art der Mitgliedschaft Du beantragen möchtest.</p>
            </div>
          </header>

          <div class="form-group full-width">
            <label>Antrag als:</label>
            <div class="custom-radio-group vertical">
              <label class="custom-radio">
                <input type="radio" v-model="form.memberType" value="active" required />
                <span class="radio-box"></span>
                <span class="radio-label-text">Aktives Mitglied</span>
              </label>
              <label class="custom-radio">
                <input type="radio" v-model="form.memberType" value="spouse" required />
                <span class="radio-box"></span>
                <span class="radio-label-text">Aktives Anschlussmitglied</span>
              </label>
              <label class="custom-radio">
                <input type="radio" v-model="form.memberType" value="training" required />
                <span class="radio-box"></span>
                <span class="radio-label-text">Aktives Mitglied in Ausbildung (Nachweis erforderlich)</span>
              </label>
              <label class="custom-radio">
                <input type="radio" v-model="form.memberType" value="passive" required />
                <span class="radio-box"></span>
                <span class="radio-label-text">Passives Mitglied</span>
              </label>
              <label class="custom-radio">
                <input type="radio" v-model="form.memberType" value="youth" required />
                <span class="radio-box"></span>
                <span class="radio-label-text">Jugendliches Mitglied (bis 19 Jahre)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- STEP 2: PERSÖNLICHE ANGABEN -->
        <div v-if="currentStep === 1" class="step-content">
          <header class="step-header">
            <User class="step-icon" />
            <div>
              <h1>Persönliche Angaben</h1>
              <p>Bitte fülle Deine Daten vollständig aus.</p>
            </div>
          </header>

          <div class="form-grid">
            <div class="form-group">
              <label>Nachname</label>
              <input v-model="form.lastName" type="text" placeholder="Mustermann" required />
            </div>
            <div class="form-group">
              <label>Vorname</label>
              <input v-model="form.firstName" type="text" placeholder="Max" required />
            </div>
            <div class="form-group">
              <label>Staatsangehörigkeit</label>
              <input v-model="form.nationality" type="text" placeholder="Deutsch" required />
            </div>
            <div class="form-group">
              <label>Beruf</label>
              <input v-model="form.profession" type="text" required />
            </div>
            <div class="form-group full-width">
              <label>Straße / Hausnummer</label>
              <input v-model="form.street" type="text" required />
            </div>
            <div class="form-group">
              <label>PLZ</label>
              <input v-model="form.zip" type="text" required />
            </div>
            <div class="form-group">
              <label>Ort</label>
              <input v-model="form.city" type="text" required />
            </div>
            <div class="form-group">
              <label>Geburtsdatum</label>
              <input v-model="form.dob" type="date" required />
            </div>
            <div class="form-group">
              <label>Geburtsort</label>
              <input v-model="form.birthplace" type="text" required />
            </div>
            <div class="form-group">
              <label>Telefon</label>
              <input v-model="form.phone" type="tel" required />
            </div>
            <div class="form-group">
              <label>E-Mail</label>
              <input v-model="form.email" type="email" required />
            </div>
            <div class="form-group full-width">
              <label>Bootsführerscheine</label>
              <input v-model="form.licenses" type="text" placeholder="z.B. SBF Binnen, See" />
            </div>
          </div>
        </div>

        <!-- STEP 3: LASTSCHRIFT -->
        <div v-if="currentStep === 2" class="step-content">
          <header class="step-header">
            <CreditCard class="step-icon" />
            <div>
              <h1>SEPA-Lastschriftmandat</h1>
              <p>Ermächtigung zum Einzug von Beiträgen und Gebühren.</p>
            </div>
          </header>

          <div class="info-box mb-8">
            <p>Ich ermächtige den WSCKL widerruflich, die von mir zu entrichtenden Zahlungen für Beiträge und Gebühren bei Fälligkeit zu Lasten meines Kontos durch Lastschrift einzuziehen.</p>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label>Kontoinhaber</label>
              <input v-model="form.bank.accountHolder" type="text" required />
            </div>
            <div class="form-group full-width">
              <label>Name der Bank</label>
              <input v-model="form.bank.bankName" type="text" required />
            </div>
            <div class="form-group">
              <label>IBAN</label>
              <input v-model="form.bank.iban" type="text" placeholder="DE..." required />
            </div>
            <div class="form-group">
              <label>BIC</label>
              <input v-model="form.bank.bic" type="text" required />
            </div>
          </div>
        </div>

        <!-- STEP 4: ABSCHLUSS -->
        <div v-if="currentStep === 3" class="step-content">
          <header class="step-header">
            <FileCheck class="step-icon" />
            <div>
              <h1>Abschluss</h1>
              <p>Überprüfe Deine Angaben und bestätige den Antrag.</p>
            </div>
          </header>

          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Mitgliedschaft:</span>
              <span class="summary-value">{{ getMemberTypeLabel(form.memberType) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Antragsteller:</span>
              <span class="summary-value">{{ form.firstName }} {{ form.lastName }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">E-Mail:</span>
              <span class="summary-value">{{ form.email }}</span>
            </div>
          </div>

          <div class="confirmation-box mt-12">
            <p class="text-sm opacity-80 mb-6">Hinweis: Bei Jugendlichen ist die Zustimmung der Erziehungsberechtigten erforderlich. Durch das Absenden dieses Online-Formulars bestätigst Du die Richtigkeit Deiner Angaben.</p>
            <label class="custom-checkbox">
              <input type="checkbox" v-model="form.acceptedTerms" required />
              <span class="checkbox-box"></span>
              <span class="checkbox-label-text">
                Ich erkenne die Satzung des WSCKL an und verpflichte mich zur Zahlung der festgesetzten Beiträge.
              </span>
            </label>
          </div>
        </div>

        <!-- Navigation -->
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
import { ref } from 'vue'
import { 
  Check, User, UserPlus, CreditCard,
  ChevronRight, ChevronLeft, Loader2, FileCheck
} from 'lucide-vue-next'

const success = ref(false)
const isSubmitting = ref(false)
const currentStep = ref(0)

const steps = [
  { title: 'Typ' },
  { title: 'Daten' },
  { title: 'Zahlung' },
  { title: 'Abschluss' }
]

const initialFormState = {
  memberType: 'active',
  firstName: '',
  lastName: '',
  nationality: '',
  profession: '',
  street: '',
  zip: '',
  city: '',
  dob: '',
  birthplace: '',
  phone: '',
  email: '',
  licenses: '',
  bank: {
    accountHolder: '',
    bankName: '',
    iban: '',
    bic: ''
  },
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

const getMemberTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    active: 'Aktives Mitglied',
    spouse: 'Aktives Anschlussmitglied',
    training: 'Aktives Mitglied in Ausbildung',
    passive: 'Passives Mitglied',
    youth: 'Jugendliches Mitglied'
  }
  return labels[type] || type
}

const handleFinalSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      subject: `Aufnahmeantrag: ${form.value.firstName} ${form.value.lastName}`,
      ...form.value
    }
    await useApi().mail.sendContactMail(payload)
    success.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    alert('Fehler beim Senden des Antrags.')
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
.member-form-container {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 5rem;
}

/* Duplicated from Berth Form for consistency - in a real project these would be global styles */
.steps-indicator { display: flex; justify-content: space-between; margin-bottom: 3rem; position: relative; padding: 0 1rem; }
.steps-indicator::before { content: ''; position: absolute; top: 20px; left: 3rem; right: 3rem; height: 2px; background: var(--color-bg-alt); z-index: 1; }
.step-item { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 80px; }
.step-number { width: 40px; height: 40px; background: white; border: 2px solid var(--color-bg-alt); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--color-text-muted); transition: var(--transition); }
.step-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); text-align: center; }
.step-item.active .step-number { border-color: var(--color-secondary); color: var(--color-secondary); box-shadow: 0 0 0 5px rgba(0, 119, 190, 0.1); }
.step-item.active .step-label { color: var(--color-secondary); }
.step-item.completed .step-number { background: var(--color-secondary); border-color: var(--color-secondary); color: white; }

.form-card { padding: 4rem; border-radius: var(--radius-lg); background: white; box-shadow: var(--shadow-md); min-height: 500px; display: flex; flex-direction: column; }
.step-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 3rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-bg-alt); }
.step-icon { width: 48px; height: 48px; color: var(--color-secondary); background: var(--color-bg-alt); padding: 10px; border-radius: 12px; }
.step-header h1 { font-size: 1.8rem; margin-bottom: 0.25rem; }
.step-header p { color: var(--color-text-muted); font-size: 0.95rem; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.full-width { grid-column: span 2; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--color-primary); opacity: 0.8; }

input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], select {
  padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid rgba(10,36,114,0.1); background: var(--color-bg); font-family: inherit; font-size: 1rem; transition: var(--transition);
}
input:focus { outline: none; border-color: var(--color-secondary); background: white; box-shadow: 0 0 0 4px rgba(0,119,190,0.1); }

.info-box { background: var(--color-bg-alt); padding: 1.5rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-accent); font-style: italic; color: var(--color-text-muted); }

/* Custom Inputs */
.custom-radio-group { display: flex; gap: 1.5rem; margin-top: 0.5rem; }
.custom-radio-group.vertical { flex-direction: column; gap: 1rem; }
.custom-radio, .custom-checkbox { display: flex; align-items: center; gap: 1rem; cursor: pointer; position: relative; transition: var(--transition); }
.custom-radio input, .custom-checkbox input { position: absolute; opacity: 0; cursor: pointer; }
.radio-box, .checkbox-box { flex-shrink: 0; width: 24px; height: 24px; border: 2px solid rgba(10,36,114,0.2); background: white; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
.radio-box { border-radius: 50%; }
.checkbox-box { border-radius: 6px; }
.radio-box::after { content: ''; width: 12px; height: 12px; border-radius: 50%; background: var(--color-accent); transform: scale(0); transition: var(--transition); }
.checkbox-box::after { content: '✓'; color: var(--color-accent); font-weight: 800; font-size: 14px; transform: scale(0); transition: var(--transition); }
.custom-radio input:checked + .radio-box, .custom-checkbox input:checked + .checkbox-box { border-color: var(--color-primary); background: var(--color-primary); }
.custom-radio input:checked + .radio-box::after, .custom-checkbox input:checked + .checkbox-box::after { transform: scale(1); }
.radio-label-text, .checkbox-label-text { font-size: 1rem; color: var(--color-text); font-weight: 500; }

.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; background: var(--color-bg-alt); padding: 2rem; border-radius: var(--radius-md); }
.summary-label { font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700; }
.summary-value { font-weight: 600; color: var(--color-primary); display: block; margin-top: 0.25rem; }

.confirmation-box { padding: 1.5rem; border-left: 4px solid var(--color-secondary); background: var(--color-bg-alt); border-radius: 0 var(--radius-md) var(--radius-md) 0; }

.form-nav { margin-top: auto; padding-top: 3rem; display: flex; }
.btn-outline { border: 2px solid var(--color-bg-alt); color: var(--color-text-muted); background: transparent; padding: 0.75rem 2rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: var(--transition); display: flex; align-items: center; }

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
}

@media (max-width: 480px) {
  .form-card { padding: 1.5rem 1rem; }
  .step-header h1 { font-size: 1.5rem; }
  .member-form-container { padding: 0 0.5rem 3rem; }
}
</style>
