export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('animate-on-scroll', {
    getSSRProps() {
      return {}
    },
    mounted(el, binding) {
      const options = {
        animation: binding.value?.animation || 'fade-up',
        delay: binding.value?.delay || 0,
        duration: binding.value?.duration || 800,
        threshold: binding.value?.threshold || 0.1,
        once: binding.value?.once !== false
      }

      // Add base animation class
      el.classList.add('reveal-base')
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add(`reveal-${options.animation}`)
              el.classList.add('is-revealed')
              
              if (options.duration !== 800) {
                el.style.transitionDuration = `${options.duration}ms`
              }
            }, options.delay)

            if (options.once) {
              observer.unobserve(el)
            }
          } else if (!options.once) {
            el.classList.remove('is-revealed')
            el.classList.remove(`reveal-${options.animation}`)
          }
        })
      }, {
        threshold: options.threshold
      })
      
      observer.observe(el)
    }
  })
})
