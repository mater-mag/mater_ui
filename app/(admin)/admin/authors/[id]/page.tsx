'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { MediaLibraryModal } from '@/components/admin'
import { createClient } from '@/lib/supabase/client'

interface Author {
  id: string
  name: string
  email: string | null
  bio: string | null
  avatar: string | null
}

export default function EditAuthorPage() {
  const router = useRouter()
  const params = useParams()
  const authorId = params.id as string

  const [loading, setLoading] = useState(true)
  const [author, setAuthor] = useState<Author | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    async function fetchAuthor() {
      const supabase = createClient()

      const { data } = await supabase
        .from('authors')
        .select('id, name, email, bio, avatar')
        .eq('id', authorId)
        .single()

      if (data) {
        const authorData = data as Author
        setAuthor(authorData)
        setName(authorData.name || '')
        setEmail(authorData.email || '')
        setBio(authorData.bio || '')
        setAvatar(authorData.avatar || '')
      }

      setLoading(false)
    }

    fetchAuthor()
  }, [authorId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-green)]"></div>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Autor nije pronađen</h1>
        <p className="text-gray-500 mb-6">Autor s ID-em &quot;{authorId}&quot; ne postoji.</p>
        <Link
          href="/admin/authors"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          Povratak na autore
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('authors')
        .update({
          name,
          email: email || null,
          bio: bio || null,
          avatar: avatar || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authorId)

      if (error) throw error

      router.push('/admin/authors')
    } catch (error) {
      console.error('Error updating author:', error)
      alert('Greška pri ažuriranju autora')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/authors"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Uredi autora</h1>
            <p className="text-sm text-gray-500 mt-0.5">{email}</p>
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Spremanje...' : 'Spremi promjene'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <Input
              label="Ime i prezime"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="npr. Ivan Horvat"
              required
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ivan.horvat@matermag.hr"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Biografija
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kratka biografija autora"
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)] min-h-[150px]"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Profilna slika</h3>

            <div className="flex flex-col items-center">
              {avatar ? (
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-[var(--admin-green-light)] flex items-center justify-center mb-4">
                  <span className="text-3xl font-semibold text-[var(--admin-green-dark)]">
                    {name.charAt(0)}
                  </span>
                </div>
              )}

              <Input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="URL slike"
                className="mb-3"
              />

              <button
                type="button"
                onClick={() => setMediaOpen(true)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Odaberi iz medijateke
              </button>
            </div>
          </div>
        </div>
      </div>

      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(media) => setAvatar(media.url)}
      />
    </form>
  )
}
