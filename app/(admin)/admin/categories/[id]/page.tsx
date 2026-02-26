'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'

// Mock categories
const mockCategories: Record<string, {
  name: string
  slug: string
  description: string
}> = {
  '1': { name: 'Vijesti', slug: 'vijesti', description: 'Najnovije vijesti i aktualnosti' },
  '2': { name: 'Lifestyle', slug: 'lifestyle', description: 'Stil života i trendovi' },
  '3': { name: 'Zdravlje', slug: 'zdravlje', description: 'Zdravlje i wellness savjeti' },
  '4': { name: 'Recepti', slug: 'recepti', description: 'Ukusni recepti za cijelu obitelj' },
  '5': { name: 'Djeca', slug: 'djeca', description: 'Savjeti za roditelje i djecu' },
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const category = mockCategories[categoryId]

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const [description, setDescription] = useState(category?.description || '')

  if (!category) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kategorija nije pronađena</h1>
        <p className="text-gray-500 mb-6">Kategorija s ID-em &quot;{categoryId}&quot; ne postoji.</p>
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          Povratak na kategorije
        </Link>
      </div>
    )
  }

  const handleNameChange = (value: string) => {
    setName(value)
    // Auto-generate slug from name
    const generatedSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (!slug || slug === category.slug) {
      setSlug(generatedSlug)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Update in Supabase
      console.log('Updating category:', categoryId, { name, slug, description })
      alert('Kategorija ažurirana!')
      router.push('/admin/categories')
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Greška pri ažuriranju kategorije')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Uredi kategoriju</h1>
            <p className="text-sm text-gray-500 mt-0.5">/{slug}</p>
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Spremanje...' : 'Spremi promjene'}
        </Button>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <Input
            label="Naziv kategorije"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="npr. Tehnologija"
            required
          />

          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="tehnologija"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Opis
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kratki opis kategorije"
              className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)] min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
