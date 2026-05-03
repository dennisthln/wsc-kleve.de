<template>
  <div class="form-contact-container" v-animate-on-scroll>
    <div class="form-card glass">
      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <div class="input-wrapper">
              <User class="input-icon" :size="20" />
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="Vor- und Nachname" 
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group full-width">
            <div class="input-wrapper">
              <Mail class="input-icon" :size="20" />
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="E-Mail-Adresse" 
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group full-width">
            <textarea 
              v-model="form.message" 
              placeholder="Deine Nachricht" 
              required
              class="form-textarea"
            ></textarea>
          </div>
        </div>

        <p class="privacy-note">
          Mit dem Absenden dieses Formulars erklärst du dich einverstanden, dass wir die im Kontaktformular eingegebenen
          Daten für die Beantwortung deiner Anfrage, Angebotserstellung bzw. Kontaktaufnahme speichern und verarbeiten
          dürfen. Weitere Informationen kannst du der
          <NuxtLink to="/datenschutz" target="_blank">Datenschutzerklärung</NuxtLink>
          entnehmen.
        </p>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">Wird gesendet...</span>
            <span v-else>Nachricht absenden</span>
          </button>
        </div>
        
        <transition name="fade">
          <div v-if="success" class="success-message">
            <div class="success-icon-wrapper">
              <Check :size="32" />
            </div>
            <h3>Nachricht gesendet!</h3>
            <p>Vielen Dank für Deine Nachricht! Wir antworten Dir schnellstmöglich.</p>
            <button @click="success = false" class="btn-text">Weitere Nachricht senden</button>
          </div>
        </transition>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Mail, Check } from 'lucide-vue-next'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const success = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    await useApi().mail.sendContactMail(form.value)
    
    success.value = true
    form.value = { name: '', email: '', message: '' }
    
  } catch (error) {
    console.error('Fehler beim Senden:', error)
    alert('Es gab einen Fehler beim Senden der Nachricht. Bitte versuche es später erneut.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-contact-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-card {
  padding: 4rem;
  border-radius: var(--radius-lg);
  background: white;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.full-width {
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1.25rem;
  color: var(--color-secondary);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem 3.5rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(10, 36, 114, 0.1);
  background: var(--color-bg);
  font-family: inherit;
  font-size: 1rem;
  transition: var(--transition);
}

.form-textarea {
  width: 100%;
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(10, 36, 114, 0.1);
  background: var(--color-bg);
  font-family: inherit;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
  transition: var(--transition);
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-secondary);
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 119, 190, 0.1);
}

.privacy-note {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.privacy-note a {
  color: var(--color-secondary);
  text-decoration: underline;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.btn-primary {
  padding: 1.25rem 4rem;
  font-size: 1.1rem;
}

.success-message {
  position: absolute;
  inset: 0;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  z-index: 20;
}

.success-icon-wrapper {
  width: 80px;
  height: 80px;
  background: #f0fdf4;
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 2rem;
}

.success-message h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.success-message p {
  color: var(--color-text-muted);
  max-width: 400px;
  margin-bottom: 2rem;
}

.btn-text {
  background: none;
  border: none;
  color: var(--color-secondary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .form-card {
    padding: 2rem 1.25rem;
  }
  .btn-primary {
    width: 100%;
    padding: 1rem 2rem;
  }
}

@media (max-width: 480px) {
  .form-card {
    padding: 1.5rem 1rem;
  }
}
</style>
