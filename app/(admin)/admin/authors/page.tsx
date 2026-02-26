'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

interface Author {
  id: string
  name: string
  email: string | null
  bio: string | null
  avatar: string | null
  articleCount?: number
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newAuthorName, setNewAuthorName] = useState('')
  const [newAuthorEmail, setNewAuthorEmail] = useState('')
  const [newAuthorBio, setNewAuthorBio] = useState('')

  const fetchAuthors = async () => {
    const supabase = createClient()

    // Fetch authors
    const { data: authorsData } = await supabase
      .from('authors')
      .select('id, name, email, bio, avatar')
      .order('name')

    if (authorsData) {
      // Get article counts per author
      const { data: articlesData } = await supabase
        .from('articles')
        .select('author_id')

      const articleCounts: Record<string, number> = {}
      if (articlesData) {
        articlesData.forEach((a: { author_id: string | null }) => {
          if (a.author_id) {
            articleCounts[a.author_id] = (articleCounts[a.author_id] || 0) + 1
          }
        })
      }

      const authorsWithCounts = (authorsData as Author[]).map(author => ({
        ...author,
        articleCount: articleCounts[author.id] || 0,
      }))

      setAuthors(authorsWithCounts)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchAuthors()
  }, [])

  const handleAddAuthor = async () => {
    if (!newAuthorName.trim()) return

    const supabase = createClient()

    const { error } = await supabase.from('authors').insert({
      name: newAuthorName,
      email: newAuthorEmail || null,
      bio: newAuthorBio || null,
    })

    if (error) {
      console.error('Error adding author:', error)
      alert('Greška pri dodavanju autora')
      return
    }

    setNewAuthorName('')
    setNewAuthorEmail('')
    setNewAuthorBio('')
    setIsAddingNew(false)
    fetchAuthors()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovog autora?')) return

    const supabase = createClient()

    const { error } = await supabase.from('authors').delete().eq('id', id)

    if (error) {
      console.error('Error deleting author:', error)
      alert('Greška pri brisanju autora')
      return
    }

    fetchAuthors()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-green)]"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Autori</h1>
          <p className="mt-1 text-sm text-gray-500">Upravljajte autorima članaka</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novi autor
        </button>
      </div>

      {/* Add new author form */}
      {isAddingNew && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Novi autor</h2>
          <div className="space-y-4">
            <Input
              label="Ime i prezime"
              value={newAuthorName}
              onChange={(e) => setNewAuthorName(e.target.value)}
              placeholder="npr. Ivan Horvat"
            />
            <Input
              label="Email"
              type="email"
              value={newAuthorEmail}
              onChange={(e) => setNewAuthorEmail(e.target.value)}
              placeholder="ivan.horvat@matermag.hr"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Biografija
              </label>
              <textarea
                value={newAuthorBio}
                onChange={(e) => setNewAuthorBio(e.target.value)}
                placeholder="Kratka biografija autora"
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)] min-h-[80px]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddAuthor}
                className="px-4 py-2 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
              >
                Dodaj autora
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false)
                  setNewAuthorName('')
                  setNewAuthorEmail('')
                  setNewAuthorBio('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Odustani
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authors grid */}
      {authors.length === 0 && !isAddingNew ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nema autora</p>
          <p className="text-sm mt-1">Dodajte autora pomoću gumba iznad</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div
            key={author.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-[var(--admin-green-light)] flex items-center justify-center shrink-0">
                <span className="text-xl font-semibold text-[var(--admin-green-dark)]">
                  {author.name.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/authors/${author.id}`}
                  className="font-semibold text-gray-900 hover:text-[var(--admin-green-dark)] block truncate"
                >
                  {author.name}
                </Link>
                <p className="text-sm text-gray-500 truncate">{author.email}</p>
              </div>
            </div>

            {author.bio && (
              <p className="mt-4 text-sm text-gray-600 line-clamp-2">{author.bio}</p>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{author.articleCount}</span> članaka
              </span>
              <div className="flex gap-3">
                <Link
                  href={`/admin/authors/${author.id}`}
                  className="text-sm font-medium text-[var(--admin-green)] hover:text-[var(--admin-green-dark)]"
                >
                  Uredi
                </Link>
                <button
                  onClick={() => handleDelete(author.id)}
                  className="text-sm font-medium text-red-500 hover:text-red-700"
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
