'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
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

interface ArticleData {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  featured_image: string | null
  featured_video: string | null
  media_type: 'image' | 'video'
  category_id: string | null
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  seo_data: SEOData | null
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
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

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch the article
      const { data: articleData } = await supabase
        .from('articles')
        .select('id, title, slug, content, excerpt, featured_image, featured_video, media_type, category_id, author_id, status, seo_data')
        .eq('id', articleId)
        .single()

      // Fetch categories first so we can determine parent/tag from article's category
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .order('name')

      const allCategories = (categoriesData || []) as Category[]
      const parents = allCategories.filter(c => !c.parent_id)
      const children = allCategories.filter(c => c.parent_id)

      const organized: Category[] = []
      parents.forEach(parent => {
        organized.push(parent)
        children.filter(c => c.parent_id === parent.id).forEach(child => {
          organized.push(child)
        })
      })
      setCategories(organized)

      if (articleData) {
        const art = articleData as ArticleData
        setArticle(art)
        setTitle(art.title || '')
        setSlug(art.slug || '')
        setContent(art.content || '')
        setExcerpt(art.excerpt || '')
        setFeaturedImage(art.featured_image || '')
        setFeaturedVideo(art.featured_video || '')
        setMediaType(art.media_type || 'image')
        setAuthorId(art.author_id || '')
        setStatus(art.status === 'archived' ? 'draft' : art.status)
        setSeoData(art.seo_data || {})

        // Determine if current category is parent or child (tag)
        if (art.category_id) {
          const currentCat = allCategories.find(c => c.id === art.category_id)
          if (currentCat) {
            if (currentCat.parent_id) {
              // It's a subcategory (tag)
              setParentCategoryId(currentCat.parent_id)
              setTagId(currentCat.id)
            } else {
              // It's a parent category
              setParentCategoryId(currentCat.id)
              setTagId('')
            }
          }
        }
      }

      // Fetch authors
      const { data: authorsData } = await supabase
        .from('authors')
        .select('id, name')
        .order('name')

      if (authorsData) {
        setAuthors(authorsData as Author[])
      }

      setLoading(false)
    }

    fetchData()
  }, [articleId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-green)]"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Članak nije pronađen</h1>
        <p className="text-gray-500 mb-6">Članak s ID-em &quot;{articleId}&quot; ne postoji.</p>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          Povratak na članke
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
      const supabase = createClient()

      // Use tag (subcategory) if selected, otherwise use parent category
      const finalCategoryId = tagId || parentCategoryId || null

      const { error } = await supabase
        .from('articles')
        .update({
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', articleId)

      if (error) throw error

      router.push('/admin/articles')
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Greška pri ažuriranju članka')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, status)}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Uredi članak</h1>
            <p className="text-sm text-gray-500 mt-0.5">ID: {articleId}</p>
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
