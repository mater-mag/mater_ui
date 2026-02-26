'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types/database'

interface CategoryWithCount extends Category {
  articleCount?: number
  subcategories?: CategoryWithCount[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isAddingSubcategory, setIsAddingSubcategory] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Fetch categories from Supabase
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const supabase = createClient()

    // Get all categories
    const { data: categoriesData, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name')
      .returns<Category[]>()

    if (catError) {
      console.error('Error fetching categories:', catError)
      setLoading(false)
      return
    }

    // Get article counts per category
    const { data: articlesData } = await supabase
      .from('articles')
      .select('category_id')
      .returns<{ category_id: string | null }[]>()

    const articleCounts: Record<string, number> = {}
    if (articlesData) {
      articlesData.forEach((a) => {
        if (a.category_id) {
          articleCounts[a.category_id] = (articleCounts[a.category_id] || 0) + 1
        }
      })
    }

    // Build hierarchy
    const categoriesWithCounts: CategoryWithCount[] = (categoriesData || []).map((cat) => ({
      ...cat,
      articleCount: articleCounts[cat.id] || 0,
    }))

    // Separate parent and child categories
    const parentCategories = categoriesWithCounts.filter((c) => !c.parent_id)
    const childCategories = categoriesWithCounts.filter((c) => c.parent_id)

    // Nest children under parents
    const hierarchicalCategories = parentCategories.map((parent) => ({
      ...parent,
      subcategories: childCategories.filter((child) => child.parent_id === parent.id),
    }))

    setCategories(hierarchicalCategories)
    setLoading(false)
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    const supabase = createClient()
    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9čćžšđ-]/gi, '')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('categories') as any).insert({
      name: newCategoryName,
      slug,
      description: newCategoryDescription || null,
      parent_id: null,
    })

    if (error) {
      alert('Greška pri dodavanju kategorije: ' + error.message)
      return
    }

    setNewCategoryName('')
    setNewCategoryDescription('')
    setIsAddingNew(false)
    fetchCategories()
  }

  const handleAddSubcategory = async (parentId: string) => {
    if (!newCategoryName.trim()) return

    const supabase = createClient()

    // Get parent slug to make subcategory slug unique
    const parentCategory = categories.find(c => c.id === parentId)
    const parentSlug = parentCategory?.slug || ''
    const subcategorySlug = newCategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9čćžšđ-]/gi, '')
    const slug = parentSlug ? `${parentSlug}-${subcategorySlug}` : subcategorySlug

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('categories') as any).insert({
      name: newCategoryName,
      slug,
      description: newCategoryDescription || null,
      parent_id: parentId,
    })

    if (error) {
      alert('Greška pri dodavanju potkategorije: ' + error.message)
      return
    }

    setNewCategoryName('')
    setNewCategoryDescription('')
    setIsAddingSubcategory(null)
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovu kategoriju?')) return

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('categories') as any).delete().eq('id', id)

    if (error) {
      alert('Greška pri brisanju: ' + error.message)
      return
    }

    fetchCategories()
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategorije</h1>
          <p className="mt-1 text-sm text-gray-500">Upravljajte kategorijama članaka</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova kategorija
        </button>
      </div>

      {/* Add new category form */}
      {isAddingNew && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nova kategorija</h2>
          <div className="space-y-4">
            <Input
              label="Naziv kategorije"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="npr. Tehnologija"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Opis
              </label>
              <textarea
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Kratki opis kategorije"
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)] min-h-[80px]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
              >
                Dodaj kategoriju
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false)
                  setNewCategoryName('')
                  setNewCategoryDescription('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Odustani
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories list */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-green)] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Učitavanje kategorija...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-500">Nema kategorija. Dodajte prvu kategoriju.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Parent category row */}
              <div className="flex items-center justify-between px-6 py-4 hover:bg-[var(--admin-green-light)]/50 transition-colors">
                <div className="flex items-center gap-3">
                  {/* Expand/collapse button */}
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${expandedCategories.has(category.id) ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <div className="w-6" />
                  )}
                  <div>
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="font-medium text-gray-900 hover:text-[var(--admin-green-dark)]"
                    >
                      {category.name}
                    </Link>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 max-w-xs truncate hidden md:block">
                    {category.description || '-'}
                  </span>
                  <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {category.articleCount} članaka
                  </span>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--admin-green-light)] text-[var(--admin-green-dark)]">
                      {category.subcategories.length} podkat.
                    </span>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsAddingSubcategory(category.id)
                        setNewCategoryName('')
                        setNewCategoryDescription('')
                      }}
                      className="text-sm font-medium text-[var(--admin-green)] hover:text-[var(--admin-green-dark)]"
                      title="Dodaj potkategoriju"
                    >
                      + Podkat.
                    </button>
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Uredi
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      Obriši
                    </button>
                  </div>
                </div>
              </div>

              {/* Add subcategory form */}
              {isAddingSubcategory === category.id && (
                <div className="px-6 py-4 bg-[var(--admin-green-light)]/30 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Nova potkategorija za "{category.name}"</h3>
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input
                        label="Naziv"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="npr. Recenzije"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        label="Opis (opcionalno)"
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        placeholder="Kratki opis"
                      />
                    </div>
                    <button
                      onClick={() => handleAddSubcategory(category.id)}
                      className="px-4 py-2 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
                    >
                      Dodaj
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingSubcategory(null)
                        setNewCategoryName('')
                        setNewCategoryDescription('')
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Odustani
                    </button>
                  </div>
                </div>
              )}

              {/* Subcategories */}
              {expandedCategories.has(category.id) && category.subcategories && category.subcategories.length > 0 && (
                <div className="border-t border-gray-100">
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between px-6 py-3 pl-16 bg-gray-50 hover:bg-[var(--admin-green-light)]/30 transition-colors border-t border-gray-100 first:border-t-0"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div>
                          <Link
                            href={`/admin/categories/${sub.id}`}
                            className="font-medium text-gray-700 hover:text-[var(--admin-green-dark)]"
                          >
                            {sub.name}
                          </Link>
                          <p className="text-xs text-gray-500">/{sub.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden md:block">
                          {sub.description || '-'}
                        </span>
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          {sub.articleCount} članaka
                        </span>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/categories/${sub.id}`}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900"
                          >
                            Uredi
                          </Link>
                          <button
                            onClick={() => handleDelete(sub.id)}
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
          ))}
        </div>
      )}
    </div>
  )
}
