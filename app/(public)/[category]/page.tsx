'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createClient } from '@/lib/supabase/client'
import type { Category, Author } from '@/types/database'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

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

interface CategoryWithChildren extends Category {
  children?: Category[]
}

const placeholderImage = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80'
const ARTICLES_PER_PAGE = 9

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const categorySlug = params.category as string
  const tagFromUrl = searchParams.get('tag') || ''

  const [category, setCategory] = useState<CategoryWithChildren | null>(null)
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<ArticleWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(tagFromUrl)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [dataFetched, setDataFetched] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const izdvojenoRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLElement>(null)

  // Sync activeTab with URL param when it changes
  useEffect(() => {
    setActiveTab(tagFromUrl)
  }, [tagFromUrl])

  // Fetch category and articles
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch category by slug
      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .single()

      if (!categoryData) {
        setLoading(false)
        return
      }

      const typedCategory = categoryData as Category
      setCategory(typedCategory)

      // Fetch subcategories
      const { data: subData } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', typedCategory.id)
        .order('name')

      const typedSubcategories = (subData || []) as Category[]
      setSubcategories(typedSubcategories)

      // Build category IDs array (parent + subcategories)
      const categoryIds = [typedCategory.id, ...typedSubcategories.map((s) => s.id)]

      // Fetch articles for this category and subcategories
      let query = supabase
        .from('articles')
        .select(`*, category:categories(*), author:authors(*)`, { count: 'exact' })
        .eq('status', 'published')
        .in('category_id', categoryIds)
        .order('published_at', { ascending: false })

      // Filter by subcategory tab if active
      if (activeTab) {
        // Match by short slug (e.g., "intervju") or full slug (e.g., "odgoj-intervju")
        const selectedSub = typedSubcategories.find((s) =>
          s.slug === activeTab || s.slug.endsWith('-' + activeTab)
        )
        if (selectedSub) {
          query = supabase
            .from('articles')
            .select(`*, category:categories(*), author:authors(*)`, { count: 'exact' })
            .eq('status', 'published')
            .eq('category_id', selectedSub.id)
            .order('published_at', { ascending: false })
        }
      }

      // Apply search filter
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`)
      }

      // Apply pagination
      const from = (currentPage - 1) * ARTICLES_PER_PAGE
      const to = from + ARTICLES_PER_PAGE - 1
      query = query.range(from, to)

      const { data: articlesData, count } = await query

      setArticles((articlesData || []) as ArticleWithRelations[])
      setTotalCount(count || 0)
      setLoading(false)
      setDataFetched(true)
    }

    fetchData()
  }, [categorySlug, activeTab, searchQuery, currentPage])

  // Build tabs from subcategories (use short slugs for URL matching)
  const tabs = [
    { name: 'Svi članci', slug: '' },
    ...subcategories.map((sub) => {
      // Extract short slug by removing parent prefix if present
      let shortSlug = sub.slug
      if (category && sub.slug.startsWith(category.slug + '-')) {
        shortSlug = sub.slug.slice(category.slug.length + 1)
      }
      return { name: sub.name, slug: shortSlug }
    }),
  ]

  const featuredArticle = articles[0]
  const sidebarArticles = articles.slice(1, 4)
  const gridArticles = articles.slice(0, ARTICLES_PER_PAGE)
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE)

  // GSAP scroll animations
  useEffect(() => {
    if (!dataFetched) return

    // Header animation on load
    if (headerRef.current) {
      const header = headerRef.current
      gsap.fromTo(header.querySelector('h1'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
      gsap.fromTo(header.querySelector('p'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power3.out' }
      )
      gsap.fromTo(header.querySelectorAll('button, input'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, delay: 0.2, ease: 'power3.out' }
      )
    }

    // Izdvojeno section
    if (izdvojenoRef.current) {
      const articleElements = izdvojenoRef.current.querySelectorAll('article')
      gsap.fromTo(articleElements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: izdvojenoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      )
    }

    // Grid section
    if (gridRef.current) {
      const articleElements = gridRef.current.querySelectorAll('article')
      gsap.fromTo(articleElements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [dataFetched])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Hvala na prijavi!')
    setNewsletterEmail('')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
      </div>
    )
  }

  // Category not found
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Kategorija nije pronađena</h1>
          <Link href="/" className="text-coral hover:text-coral-dark">
            Povratak na početnu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Category Header */}
      <section ref={headerRef} className="container py-12">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 text-lg">{category.description}</p>
          )}
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => {
                  setActiveTab(tab.slug)
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === tab.slug
                    ? 'bg-dark-bg text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Pretraži..."
              className="w-full px-4 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Izdvojeno Section */}
      {featuredArticle && (
        <section ref={izdvojenoRef} className="container pb-12">
          <h2 className="font-serif text-2xl font-bold mb-6">Izdvojeno</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Large Article */}
            <div className="lg:col-span-2">
              <article className="group">
                <Link href={`/${featuredArticle.category?.slug || categorySlug}/${featuredArticle.slug}`}>
                  <div className="aspect-[16/10] relative rounded-lg overflow-hidden mb-4 img-hover">
                    <Image
                      src={featuredArticle.featured_image || placeholderImage}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{featuredArticle.category?.name || category.name}</p>
                  <h3 className="font-serif text-2xl font-bold mb-3 group-hover:text-coral">
                    {featuredArticle.title}
                  </h3>
                  {featuredArticle.excerpt && (
                    <p className="text-gray-600 line-clamp-2">{featuredArticle.excerpt}</p>
                  )}
                </Link>
              </article>
            </div>

            {/* Sidebar Articles */}
            <div className="space-y-6">
              {sidebarArticles.map((article) => (
                <article key={article.id} className="group">
                  <Link href={`/${article.category?.slug || categorySlug}/${article.slug}`} className="flex gap-4">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden shrink-0 img-hover">
                      <Image
                        src={article.featured_image || placeholderImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{article.category?.name || category.name}</p>
                      <h4 className="font-serif font-semibold leading-tight line-clamp-3 group-hover:text-coral">
                        {article.title}
                      </h4>
                      {article.author?.name && (
                        <p className="text-xs text-gray-400 mt-1">{article.author.name}</p>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Banner */}
      <section className="bg-coral py-12 mb-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                Ostanite u korak s trendovima
              </h2>
              <p className="text-white/80">
                Prijavite se na naš newsletter
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto gap-3">
              <div className="flex-1 md:w-80">
                <div className="flex items-center bg-white rounded-lg px-4 py-3">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Unesite vaš email..."
                    className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-dark-bg text-white font-medium rounded-lg hover:bg-black whitespace-nowrap"
              >
                Preplati se
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section ref={gridRef} className="container pb-16">
        {gridArticles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nema članaka u ovoj kategoriji.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map((article) => (
                <article key={article.id} className="group">
                  <Link href={`/${article.category?.slug || categorySlug}/${article.slug}`}>
                    <div className="aspect-[4/3] relative rounded-lg overflow-hidden mb-4 img-hover">
                      <Image
                        src={article.featured_image || placeholderImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{article.category?.name || category.name}</p>
                    <h3 className="font-serif text-lg font-semibold leading-tight group-hover:text-coral">
                      {article.title}
                    </h3>
                    {article.author?.name && (
                      <p className="text-sm text-gray-400 mt-2">{article.author.name}</p>
                    )}
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Prethodna stranica"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? 'bg-dark-bg text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Sljedeća stranica"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
