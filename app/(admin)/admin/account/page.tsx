'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Profile form
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        setFullName(user.user_metadata?.full_name || user.user_metadata?.name || '')
        setEmail(user.email || '')
      }
      setLoading(false)
    })
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMessage(null)

    try {
      const supabase = createClient()

      // Update user metadata (display name)
      const { error: metaError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      })

      if (metaError) {
        setProfileMessage({ type: 'error', text: metaError.message })
        return
      }

      // Update email if changed
      if (email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email })
        if (emailError) {
          setProfileMessage({ type: 'error', text: emailError.message })
          return
        }
        setProfileMessage({
          type: 'success',
          text: 'Profil ažuriran. Provjerite novi email za potvrdu promjene adrese.',
        })
      } else {
        setProfileMessage({ type: 'success', text: 'Profil uspješno ažuriran.' })
      }

      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      if (updatedUser) setUser(updatedUser)
    } catch {
      setProfileMessage({ type: 'error', text: 'Došlo je do greške. Pokušajte ponovno.' })
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSaving(true)
    setPasswordMessage(null)

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Nova lozinka mora imati najmanje 6 znakova.' })
      setPasswordSaving(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Nove lozinke se ne podudaraju.' })
      setPasswordSaving(false)
      return
    }

    try {
      const supabase = createClient()

      // Verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      })

      if (signInError) {
        setPasswordMessage({ type: 'error', text: 'Trenutna lozinka nije ispravna.' })
        setPasswordSaving(false)
        return
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setPasswordMessage({ type: 'error', text: error.message })
        return
      }

      setPasswordMessage({ type: 'success', text: 'Lozinka uspješno promijenjena.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setPasswordMessage({ type: 'error', text: 'Došlo je do greške. Pokušajte ponovno.' })
    } finally {
      setPasswordSaving(false)
    }
  }

  const initial = (fullName || email || 'K').charAt(0).toUpperCase()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--admin-green)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Moj račun</h1>
        <p className="mt-1 text-sm text-gray-500">Upravljajte svojim profilom i sigurnosnim postavkama</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile card with avatar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-[var(--admin-green-dark)] flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">{initial}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{fullName || 'Korisnik'}</h2>
              <p className="text-sm text-gray-500">{email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Član od {user?.created_at ? new Date(user.created_at).toLocaleDateString('hr-HR', { year: 'numeric', month: 'long' }) : '—'}
              </p>
            </div>
          </div>

          {/* Profile form */}
          <form onSubmit={handleProfileSave}>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Osobni podaci</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ime i prezime
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vaše ime i prezime"
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email adresa
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vas@email.com"
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)]"
                />
                {email !== user?.email && (
                  <p className="mt-1.5 text-xs text-amber-600">
                    Promjena emaila zahtijeva potvrdu na novoj adresi.
                  </p>
                )}
              </div>
            </div>

            {profileMessage && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                profileMessage.type === 'success'
                  ? 'bg-[var(--admin-green-light)] text-[var(--admin-green-dark)]'
                  : 'bg-red-50 text-red-700'
              }`}>
                {profileMessage.text}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={profileSaving}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors disabled:opacity-50"
              >
                {profileSaving ? 'Spremanje...' : 'Spremi promjene'}
              </button>
            </div>
          </form>
        </div>

        {/* Password change */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Promjena lozinke</h3>
          <p className="text-sm text-gray-500 mb-6">Ažurirajte svoju lozinku za prijavu</p>

          <form onSubmit={handlePasswordChange}>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Trenutna lozinka
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)]"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nova lozinka
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)]"
                />
                <p className="mt-1.5 text-xs text-gray-400">Minimalno 6 znakova</p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Potvrdite novu lozinku
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)]"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">Lozinke se ne podudaraju</p>
                )}
              </div>
            </div>

            {passwordMessage && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                passwordMessage.type === 'success'
                  ? 'bg-[var(--admin-green-light)] text-[var(--admin-green-dark)]'
                  : 'bg-red-50 text-red-700'
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors disabled:opacity-50"
              >
                {passwordSaving ? 'Spremanje...' : 'Promijeni lozinku'}
              </button>
            </div>
          </form>
        </div>

        {/* Session info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Informacije o sesiji</h3>
          <p className="text-sm text-gray-500 mb-4">Detalji trenutne prijave</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <span className="text-sm text-gray-500">Korisnik ID</span>
              <span className="text-sm font-mono text-gray-700">{user?.id?.slice(0, 8)}...{user?.id?.slice(-4)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <span className="text-sm text-gray-500">Posljednja prijava</span>
              <span className="text-sm text-gray-700">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString('hr-HR')
                  : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <span className="text-sm text-gray-500">Način prijave</span>
              <span className="text-sm text-gray-700">
                {user?.app_metadata?.provider === 'email' ? 'Email / lozinka' : user?.app_metadata?.provider || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
