'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import slugify from 'slugify'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui'
import { RichTextEditor } from '@/components/admin'
import { SEOEditor } from '@/components/seo'
import type { SEOData } from '@/types/database'

export default function NewPagePage() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [seoData, setSeoData] = useState<SEOData>({})

  const handleTitleChange = (value: string) => {
    setTitle(value)
    // Auto-generate slug from title
    setSlug(slugify(value, { lower: true, strict: true }))
  }

  const handleSubmit = async (e: React.FormEvent, publishStatus: 'draft' | 'published') => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('pages')
        .insert({
          title,
          slug,
          content,
          status: publishStatus,
          seo_data: seoData,
        } as never)

      if (error) {
        throw error
      }

      alert('Stranica kreirana!')
      router.push('/admin/pages')
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Greška pri kreiranju stranice')
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
            <h1 className="text-2xl font-bold text-gray-900">Nova stranica</h1>
            {slug && <p className="text-sm text-gray-500 mt-0.5">/{slug}</p>}
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
            type="button"
            disabled={isLoading}
            onClick={(e) => handleSubmit(e as React.FormEvent, 'published')}
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
            <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">
              Skica
            </span>
          </div>
        </div>
      </div>
    </form>
  )
}
