'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Category, Author } from '@/types/database'

interface ArticleWithRelations {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  category_id: string | null
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
  category?: Category | null
  author?: Author | null
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<ArticleWithRelations[]>([])
  const [interviewCategoryId, setInterviewCategoryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    findOrCreateInterviewCategory()
  }, [])

  useEffect(() => {
    if (interviewCategoryId) {
      fetchInterviews()
    }
  }, [interviewCategoryId, statusFilter])

  const findOrCreateInterviewCategory = async () => {
    const supabase = createClient()

    // Try to find "Intervjui" category
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'intervjui')
      .single()

    if (existing && typeof existing === 'object' && 'id' in existing) {
      setInterviewCategoryId((existing as { id: string }).id)
    } else {
      // Create the category if it doesn't exist
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: created, error } = await (supabase
        .from('categories') as any)
        .insert({
          name: 'Intervjui',
          slug: 'intervjui',
          description: 'Razgovori s poznatim osobama',
          parent_id: null,
        })
        .select('id')
        .single()

      if (created) {
        setInterviewCategoryId(created.id)
      } else if (error) {
        console.error('Error creating interview category:', error)
        setLoading(false)
      }
    }
  }

  const fetchInterviews = async () => {
    if (!interviewCategoryId) return

    const supabase = createClient()

    let query = supabase
      .from('articles')
      .select(`
        *,
        category:categories(*),
        author:authors(*)
      `)
      .eq('category_id', interviewCategoryId)
      .order('created_at', { ascending: false })

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching interviews:', error)
    } else {
      setInterviews(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Jeste li sigurni da zelite obrisati ovaj intervju?')) return

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('articles') as any).delete().eq('id', id)

    if (error) {
      alert('Greska pri brisanju: ' + error.message)
      return
    }

    fetchInterviews()
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('hr-HR')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Intervjui</h1>
          <p className="mt-1 text-sm text-gray-500">Razgovori s poznatim osobama</p>
        </div>
        <Link
          href={`/admin/articles/new${interviewCategoryId ? `?category=${interviewCategoryId}` : ''}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novi intervju
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)]"
        >
          <option value="">Svi statusi</option>
          <option value="published">Objavljeno</option>
          <option value="draft">Skica</option>
          <option value="archived">Arhivirano</option>
        </select>
      </div>

      {/* Interviews Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Naslov
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Autor
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Datum
              </th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-green)] mx-auto"></div>
                  <p className="mt-4 text-sm text-gray-500">Ucitavanje intervjua...</p>
                </td>
              </tr>
            ) : interviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Nema intervjua. Kreirajte prvi intervju.
                </td>
              </tr>
            ) : (
              interviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-[var(--admin-green-light)]/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/articles/${interview.id}`}
                      className="font-medium text-gray-900 hover:text-[var(--admin-green-dark)]"
                    >
                      {interview.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {interview.author?.name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                        interview.status === 'published'
                          ? 'bg-[var(--admin-green-light)] text-[var(--admin-green-dark)]'
                          : interview.status === 'draft'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {interview.status === 'published'
                        ? 'Objavljeno'
                        : interview.status === 'draft'
                        ? 'Skica'
                        : 'Arhivirano'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(interview.published_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/articles/${interview.id}`}
                        className="text-sm font-medium text-[var(--admin-green)] hover:text-[var(--admin-green-dark)]"
                      >
                        Uredi
                      </Link>
                      <button
                        onClick={() => handleDelete(interview.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Obrisi
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
