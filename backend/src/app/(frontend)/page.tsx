import React from 'react'
import Link from 'next/link'

export default function Page() {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#f4f7f6'
    }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#003366' }}>WSCKL Backend (Payload CMS)</h1>
        <p style={{ margin: '1.5rem 0', fontSize: '1.1rem', color: '#666' }}>
          Dieses Backend stellt die Daten für deine <strong>Vue/Nuxt Webseite</strong> bereit.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <a href="http://localhost:3001" style={{ 
            padding: '0.8rem 1.5rem', 
            background: '#0077be', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '6px',
            fontWeight: 'bold'
          }}>
            Zur Vue Webseite (Port 3001)
          </a>
          
          <Link href="/admin" style={{ 
            padding: '0.8rem 1.5rem', 
            background: '#333', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '6px',
            fontWeight: 'bold'
          }}>
            Zum Admin Panel
          </Link>
        </div>
        
        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#999' }}>
          Hinweis: Die Admin-Oberfläche basiert auf Next.js, deine Webseite auf Nuxt/Vue.
        </p>
      </div>
    </div>
  )
}
