export default defineNuxtPlugin((nuxtApp) => {
  const mail = {
    sendContactMail: (fields: any) => {
      return $fetch('https://cs.kleverweb.de/api/send-message', {
        method: 'POST',
        body: {
          access_key: 'JgtBeIoziA1LgXE2opDcYzPy',
          ...fields,
        },
      })
    },
  }

  return {
    provide: {
      api: {
        mail,
      },
    },
  }
})
