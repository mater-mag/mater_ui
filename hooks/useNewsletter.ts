import { useState } from 'react'

interface UseNewsletterReturn {
  email: string
  setEmail: (email: string) => void
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
  subscribe: (e: React.FormEvent) => Promise<void>
}

export function useNewsletter(): UseNewsletterReturn {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(data.error)
        return
      }

      setStatus('success')
      setMessage('Hvala na prijavi! Provjerite svoj inbox.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Došlo je do greške. Molimo pokušajte ponovno.')
    }
  }

  return { email, setEmail, status, message, subscribe }
}
