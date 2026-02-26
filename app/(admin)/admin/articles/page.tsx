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

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleWithRelations[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [statusFilter, categoryFilter])

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('name')
    setCategories(data || [])
  }

  const fetchArticles = async () => {
    const supabase = createClient()

    let query = supabase
      .from('articles')
      .select(`
        *,
        category:categories(*),
        author:authors(*)
      `)
      .order('created_at', { ascending: false })

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }
    if (categoryFilter) {
      query = query.eq('category_id', categoryFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching articles:', error)
    } else {
      setArticles(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj članak?')) return

    const supabase = createClient()
    const { error } = await supabase.from('articles').delete().eq('id', id)

    if (error) {
      alert('Greška pri brisanju: ' + error.message)
      return
    }

    fetchArticles()
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('hr-HR')
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Članci</h1>
          <p className="mt-1 text-sm text-gray-500">Upravljajte sadržajem vašeg portala</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novi članak
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)]"
        >
          <option value="">Sve kategorije</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
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

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Naslov
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Kategorija
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
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-green)] mx-auto"></div>
                  <p className="mt-4 text-sm text-gray-500">Učitavanje članaka...</p>
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Nema članaka. Kreirajte prvi članak.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-[var(--admin-green-light)]/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="font-medium text-gray-900 hover:text-[var(--admin-green-dark)]"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {article.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {article.author?.name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                        article.status === 'published'
                          ? 'bg-[var(--admin-green-light)] text-[var(--admin-green-dark)]'
                          : article.status === 'draft'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {article.status === 'published'
                        ? 'Objavljeno'
                        : article.status === 'draft'
                        ? 'Skica'
                        : 'Arhivirano'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(article.published_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="text-sm font-medium text-[var(--admin-green)] hover:text-[var(--admin-green-dark)]"
                      >
                        Uredi
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Obriši
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
