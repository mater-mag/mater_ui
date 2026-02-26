'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import { Button, Input } from '@/components/ui'
import { RichTextEditor, MediaLibraryModal } from '@/components/admin'
import { SEOEditor } from '@/components/seo'
import { createClient } from '@/lib/supabase/client'
import type { SEOData } from '@/types/database'

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

interface Author {
  id: string
  name: string
}

export default function NewArticlePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [featuredVideo, setFeaturedVideo] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [parentCategoryId, setParentCategoryId] = useState('')
  const [tagId, setTagId] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [seoData, setSeoData] = useState<SEOData>({})
  const [mediaOpen, setMediaOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .order('name')

      if (categoriesData) {
        // Organize categories: parents first, then children under them
        const parents = (categoriesData as Category[]).filter(c => !c.parent_id)
        const children = (categoriesData as Category[]).filter(c => c.parent_id)

        const organized: Category[] = []
        parents.forEach(parent => {
          organized.push(parent)
          children.filter(c => c.parent_id === parent.id).forEach(child => {
            organized.push(child)
          })
        })
        setCategories(organized)
      }

      // Fetch authors
      const { data: authorsData } = await supabase
        .from('authors')
        .select('id, name')
        .order('name')

      if (authorsData) {
        setAuthors(authorsData as Author[])
      }
    }

    fetchData()
  }, [])

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
      const supabase = createClient()

      // Use tag (subcategory) if selected, otherwise use parent category
      const finalCategoryId = tagId || parentCategoryId || null

      const { error } = await supabase.from('articles').insert({
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage || null,
        featured_video: featuredVideo || null,
        media_type: mediaType,
        category_id: finalCategoryId,
        author_id: authorId || null,
        status: publishStatus,
        seo_data: seoData,
        published_at: publishStatus === 'published' ? new Date().toISOString() : null,
      } as never)

      if (error) throw error

      router.push('/admin/articles')
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Greška pri spremanju članka')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, status)}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Novi članak</h1>
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
            placeholder="Unesite naslov članka"
            required
          />

          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-clanka"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Sadržaj
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Počnite pisati članak..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Kratki opis (izvod)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Kratki opis koji će se prikazati na karticama"
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[100px]"
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
          {/* Media Type Selector */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-4">Vrsta medija</h3>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                  mediaType === 'image'
                    ? 'bg-admin-green text-white border-admin-green'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                Slika
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                  mediaType === 'video'
                    ? 'bg-admin-green text-white border-admin-green'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                Video
              </button>
            </div>

            {mediaType === 'image' ? (
              <>
                <Input
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="URL slike"
                />
                {featuredImage && (
                  <div className="mt-4 aspect-video relative rounded-lg overflow-hidden bg-muted">
                    <img
                      src={featuredImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setMediaOpen(true)}
                >
                  Odaberi iz medijateke
                </Button>
              </>
            ) : (
              <>
                <Input
                  value={featuredVideo}
                  onChange={(e) => setFeaturedVideo(e.target.value)}
                  placeholder="YouTube, Vimeo ili URL videa"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Podržani formati: YouTube link, Vimeo link, ili direktan URL video datoteke (.mp4)
                </p>
                {featuredVideo && (
                  <div className="mt-4 aspect-video relative rounded-lg overflow-hidden bg-muted">
                    {featuredVideo.includes('youtube') || featuredVideo.includes('youtu.be') ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                          <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                    ) : featuredVideo.includes('vimeo') ? (
                      <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
                        </svg>
                      </div>
                    ) : (
                      <video
                        src={featuredVideo}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Category */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-4">Kategorija</h3>
            <select
              value={parentCategoryId}
              onChange={(e) => {
                setParentCategoryId(e.target.value)
                setTagId('') // Reset tag when parent changes
              }}
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <option value="">Odaberi kategoriju</option>
              {categories.filter(cat => !cat.parent_id).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tag (Subcategory) */}
          {parentCategoryId && categories.some(cat => cat.parent_id === parentCategoryId) && (
            <div className="bg-background rounded-lg border border-border p-4">
              <h3 className="font-semibold mb-4">Tag</h3>
              <select
                value={tagId}
                onChange={(e) => setTagId(e.target.value)}
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <option value="">Bez taga</option>
                {categories.filter(cat => cat.parent_id === parentCategoryId).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Author */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-4">Autor</h3>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <option value="">Odaberi autora</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(media) => setFeaturedImage(media.url)}
      />
    </form>
  )
}
