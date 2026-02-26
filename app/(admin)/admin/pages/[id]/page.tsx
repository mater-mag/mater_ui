'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import slugify from 'slugify'
import { Button, Input } from '@/components/ui'
import { RichTextEditor } from '@/components/admin'
import { SEOEditor } from '@/components/seo'
import type { SEOData } from '@/types/database'

// Mock pages for now — will be replaced with Supabase fetch
const mockPages: Record<string, {
  title: string
  slug: string
  content: string
  status: 'draft' | 'published'
  seo_data: SEOData
}> = {
  '1': {
    title: 'O nama',
    slug: 'o-nama',
    content: '<p>Matermag je portal posvećen modernom roditeljstvu, zdravlju i lifestyle temama.</p>',
    status: 'published',
    seo_data: {},
  },
  '2': {
    title: 'Kontakt',
    slug: 'kontakt',
    content: '<p>Kontaktirajte nas putem e-maila na info@matermag.hr</p>',
    status: 'published',
    seo_data: {},
  },
  '3': {
    title: 'Politika privatnosti',
    slug: 'privatnost',
    content: '<p>Vaša privatnost nam je važna. Ova politika opisuje kako prikupljamo i koristimo vaše podatke.</p>',
    status: 'published',
    seo_data: {},
  },
  '4': {
    title: 'Uvjeti korištenja',
    slug: 'uvjeti-koristenja',
    content: '<p>Korištenjem ovog portala prihvaćate sljedeće uvjete...</p>',
    status: 'published',
    seo_data: {},
  },
}

export default function EditPagePage() {
  const router = useRouter()
  const params = useParams()
  const pageId = params.id as string

  const pageData = mockPages[pageId]

  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(pageData?.title || '')
  const [slug, setSlug] = useState(pageData?.slug || '')
  const [content, setContent] = useState(pageData?.content || '')
  const [status, setStatus] = useState<'draft' | 'published'>(pageData?.status || 'draft')
  const [seoData, setSeoData] = useState<SEOData>(pageData?.seo_data || {})

  if (!pageData) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Stranica nije pronađena</h1>
        <p className="text-gray-500 mb-6">Stranica s ID-em &quot;{pageId}&quot; ne postoji.</p>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          Povratak na stranice
        </Link>
      </div>
    )
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug || slug === slugify(title, { lower: true, strict: true })) {
      setSlug(slugify(value, { lower: true, strict: true }))
    }
  }

  const handleSubmit = async (e: React.FormEvent, publishStatus: 'draft' | 'published') => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Update in Supabase
      console.log('Updating page:', pageId, {
        title,
        slug,
        content,
        status: publishStatus,
        seo_data: seoData,
      })

      alert('Stranica ažurirana!')
      router.push('/admin/pages')
    } catch (error) {
      console.error('Error updating page:', error)
      alert('Greška pri ažuriranju stranice')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, status)}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Uredi stranicu</h1>
            <p className="text-sm text-gray-500 mt-0.5">/{slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={(e) => handleSubmit(e as React.FormEvent, 'draft')}
          >
            Spremi kao skicu
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={() => setStatus('published')}
          >
            {isLoading ? 'Spremanje...' : 'Objavi'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Input
            label="Naslov"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Unesite naslov stranice"
            required
          />

          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-stranice"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Sadržaj
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Počnite pisati sadržaj stranice..."
            />
          </div>

          {/* SEO Editor */}
          <div>
            <h2 className="text-lg font-semibold mb-4">SEO postavke</h2>
            <SEOEditor
              data={seoData}
              onChange={setSeoData}
              title={title}
              content={content}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-4">Status</h3>
            <span
              className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                status === 'published'
                  ? 'bg-[var(--admin-green-light)] text-[var(--admin-green-dark)]'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {status === 'published' ? 'Objavljeno' : 'Skica'}
            </span>
          </div>
        </div>
      </div>
    </form>
  )
}
