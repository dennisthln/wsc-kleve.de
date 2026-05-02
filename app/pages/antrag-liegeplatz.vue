<template>
  <div class="antrag-page">
    <section class="page-header">
      <div class="container" v-animate-on-scroll>
        <h1 class="section-title">Liegeplatz beantragen</h1>
        <p class="section-subtitle">
          Hier kannst Du Deinen Antrag für einen Bootsliegeplatz im WSCKL bequem online ausfüllen und einreichen.
        </p>
      </div>
    </section>

    <section class="form-section">
      <div class="container">
        <FormBerthApplication />
      </div>
    </section>
  </div>
</template>

<style scoped>
.antrag-page {
  background-color: var(--color-bg);
}

.page-header {
  padding: 8rem 0 6rem;
  background: linear-gradient(to bottom, var(--color-bg-alt), var(--color-bg));
  text-align: center;
}

.section-subtitle {
  color: var(--color-text-muted);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 1.5rem auto 0;
  line-height: 1.6;
}

.form-section {
  margin-top: -4rem;
  position: relative;
  z-index: 10;
  padding-bottom: 5rem;
}

@media (max-width: 768px) {
  .page-header {
    padding: 6rem 0 5rem;
  }
  .form-section {
    margin-top: -3rem;
  }
}
</style>
