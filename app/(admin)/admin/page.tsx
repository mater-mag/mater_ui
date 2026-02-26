'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  articles: number
  pages: number
  media: number
  categories: number
}

interface RecentArticle {
  id: string
  title: string
  status: 'draft' | 'published' | 'archived'
}

interface CategoryWithCount {
  name: string
  count: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    articles: 0,
    pages: 0,
    media: 0,
    categories: 0,
  })
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([])
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      const supabase = createClient()

      // Fetch counts in parallel
      const [
        { count: articlesCount },
        { count: pagesCount },
        { count: mediaCount },
        { count: categoriesCount },
      ] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('pages').select('*', { count: 'exact', head: true }),
        supabase.from('media').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        articles: articlesCount || 0,
        pages: pagesCount || 0,
        media: mediaCount || 0,
        categories: categoriesCount || 0,
      })

      // Fetch recent articles
      const { data: recentData } = await supabase
        .from('articles')
        .select('id, title, status')
        .order('created_at', { ascending: false })
        .limit(3)

      setRecentArticles((recentData || []) as RecentArticle[])

      // Fetch categories with article counts
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .is('parent_id', null)
        .order('name')

      if (categoriesData) {
        // Get article counts per category
        const { data: articlesData } = await supabase
          .from('articles')
          .select('category_id')

        const articleCounts: Record<string, number> = {}
        if (articlesData) {
          articlesData.forEach((a: { category_id: string | null }) => {
            if (a.category_id) {
              articleCounts[a.category_id] = (articleCounts[a.category_id] || 0) + 1
            }
          })
        }

        const categoriesWithCounts = categoriesData.map((cat: { id: string; name: string }) => ({
          name: cat.name,
          count: articleCounts[cat.id] || 0,
        }))

        setCategories(categoriesWithCounts)
      }

      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-green)]"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nadzorna ploča</h1>
          <p className="mt-1 text-sm text-gray-500">Pregled vašeg portala i nedavne aktivnosti</p>
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

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Articles - green gradient */}
        <Link href="/admin/articles" className="group">
          <div className="bg-gradient-to-br from-[var(--admin-green-dark)] to-[var(--admin-green)] rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/80">Članci</span>
              <svg className="w-5 h-5 text-white/60 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="text-3xl font-bold">{stats.articles}</div>
            <p className="text-sm text-white/60 mt-1">Ukupno članaka</p>
          </div>
        </Link>

        {/* Pages */}
        <Link href="/admin/pages" className="group">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Stranice</span>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-[var(--admin-green)] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.pages}</div>
            <p className="text-sm text-gray-400 mt-1">Objavljenih stranica</p>
          </div>
        </Link>

        {/* Media */}
        <Link href="/admin/media" className="group">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Mediji</span>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-[var(--admin-green)] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.media}</div>
            <p className="text-sm text-gray-400 mt-1">Datoteka u medijateci</p>
          </div>
        </Link>

        {/* Categories */}
        <Link href="/admin/categories" className="group">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Kategorije</span>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-[var(--admin-green)] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.categories}</div>
            <p className="text-sm text-gray-400 mt-1">Aktivnih kategorija</p>
          </div>
        </Link>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent articles */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Nedavni članci</CardTitle>
            <Link
              href="/admin/articles"
              className="text-sm text-[var(--admin-green)] hover:underline font-medium"
            >
              Pogledaj sve
            </Link>
          </CardHeader>
          <CardContent>
            {recentArticles.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nema članaka</p>
            ) : (
              <div className="space-y-3">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[var(--admin-green-light)] transition-colors"
                  >
                    <div className="min-w-0 flex-1 mr-3">
                      <Link href={`/admin/articles/${article.id}`} className="text-sm font-medium text-gray-900 hover:text-[var(--admin-green-dark)] truncate block">
                        {article.title}
                      </Link>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${
                        article.status === 'published'
                          ? 'bg-[var(--admin-green-light)] text-[var(--admin-green-dark)]'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {article.status === 'published' ? 'Objavljeno' : 'Skica'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Brze akcije</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/admin/articles/new"
                className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[var(--admin-green)] hover:bg-[var(--admin-green-light)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--admin-green-light)] flex items-center justify-center group-hover:bg-[var(--admin-green)] transition-colors">
                  <svg className="w-5 h-5 text-[var(--admin-green-dark)] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Novi članak</p>
                  <p className="text-xs text-gray-500">Kreirajte novi sadržaj</p>
                </div>
              </Link>
              <Link
                href="/admin/pages/new"
                className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[var(--admin-green)] hover:bg-[var(--admin-green-light)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--admin-green-light)] flex items-center justify-center group-hover:bg-[var(--admin-green)] transition-colors">
                  <svg className="w-5 h-5 text-[var(--admin-green-dark)] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Nova stranica</p>
                  <p className="text-xs text-gray-500">Dodajte statičnu stranicu</p>
                </div>
              </Link>
              <Link
                href="/admin/media"
                className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[var(--admin-green)] hover:bg-[var(--admin-green-light)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--admin-green-light)] flex items-center justify-center group-hover:bg-[var(--admin-green)] transition-colors">
                  <svg className="w-5 h-5 text-[var(--admin-green-dark)] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Dodaj medij</p>
                  <p className="text-xs text-gray-500">Uploadajte slike i datoteke</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Categories overview */}
        <Card className="rounded-2xl shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">Kategorije</CardTitle>
            <Link
              href="/admin/categories"
              className="text-sm text-[var(--admin-green)] hover:underline font-medium"
            >
              Uredi
            </Link>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nema kategorija</p>
            ) : (
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                  >
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">
                      {cat.count} članaka
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
