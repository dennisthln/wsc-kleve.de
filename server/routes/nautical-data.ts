export default defineCachedEventHandler(async (event) => {
  console.log('[Server API] Fetching fresh nautical data (Pegel & Weather)...')
  
  const results = {
    pegel: null,
    weather: null,
    timestamp: new Date().toISOString()
  }

  // 1. Fetch Pegel (Emmerich)
  try {
    const pegelRes = await $fetch<any>('https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/EMMERICH/W.json?includeCurrentMeasurement=true')
    if (pegelRes) {
      results.pegel = {
        station: pegelRes.shortname,
        value: pegelRes.currentMeasurement.value,
        timestamp: pegelRes.currentMeasurement.timestamp,
        trend: pegelRes.currentMeasurement.trend,
        stateMnwMhw: pegelRes.currentMeasurement.stateMnwMhw
      }
    }
  } catch (e) {
    console.error('Error fetching Pegel:', e)
  }

  // 2. Fetch Weather (Kleve)
  try {
    const weatherRes = await $fetch<any>('https://api.open-meteo.com/v1/forecast?latitude=51.78&longitude=6.13&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=Europe%2FBerlin')
    if (weatherRes && weatherRes.current) {
      results.weather = weatherRes.current
    }
  } catch (e) {
    console.error('Error fetching Weather:', e)
  }

  return results
}, {
  maxAge: 3600, // 1 hour in seconds
  name: 'nautical-data-cache',
  getKey: () => 'global'
})
