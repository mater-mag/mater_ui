'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('Pogrešan email ili lozinka')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Došlo je do greške. Pokušajte ponovno.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 bg-background rounded-lg border border-border shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold">Matermag CMS</h1>
          <p className="text-muted-foreground mt-2">Prijavite se u administraciju</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vas@email.com"
            required
          />

          <Input
            label="Lozinka"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Prijava...' : 'Prijavi se'}
          </Button>
        </form>
      </div>
    </div>
  )
}
