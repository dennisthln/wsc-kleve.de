export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('animate-on-scroll', {
    // This runs on the server to prevent the crash
    getSSRProps() {
      return {}
    },
    // This runs on the client
    mounted(el, binding) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = binding.value?.delay || 0
            setTimeout(() => {
              el.classList.add('is-visible')
            }, delay)
            observer.unobserve(el)
          }
        })
      }, {
        threshold: 0.1
      })
      observer.observe(el)
    }
  })
})
