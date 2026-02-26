'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { hr } from 'date-fns/locale'
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

const placeholderImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

function ShareButton({ platform, url, title }: { platform: string; url: string; title: string }) {
  const shareUrls: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  }

  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    pinterest: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0a12 12 0 0 0-4.373 23.178c-.07-.937-.134-2.377.028-3.401.146-.927.943-5.893.943-5.893s-.24-.482-.24-1.195c0-1.119.649-1.954 1.458-1.954.688 0 1.02.517 1.02 1.136 0 .692-.44 1.727-.667 2.686-.19.803.403 1.458 1.195 1.458 1.434 0 2.535-1.513 2.535-3.695 0-1.932-1.389-3.282-3.372-3.282-2.297 0-3.646 1.722-3.646 3.504 0 .694.267 1.438.6 1.842a.24.24 0 0 1 .056.23c-.061.256-.198.803-.225.916-.035.146-.116.177-.267.107-.997-.464-1.62-1.923-1.62-3.094 0-2.517 1.83-4.83 5.276-4.83 2.77 0 4.924 1.973 4.924 4.61 0 2.752-1.735 4.968-4.143 4.968-.809 0-1.57-.42-1.831-.917l-.498 1.898c-.18.694-.668 1.565-.995 2.097A12 12 0 1 0 12 0z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  }

  return (
    <a
      href={shareUrls[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 text-gray-500 hover:text-coral"
      aria-label={`Podijeli na ${platform}`}
    >
      {icons[platform]}
    </a>
  )
}

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const categorySlug = params.category as string

  const [article, setArticle] = useState<ArticleWithRelations | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<ArticleWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState('')
  const [dataFetched, setDataFetched] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const relatedRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  // Fetch article data
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch article by slug
      const { data: articleData } = await supabase
        .from('articles')
        .select(`*, category:categories(*), author:authors(*)`)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (!articleData) {
        setLoading(false)
        return
      }

      const typedArticle = articleData as ArticleWithRelations
      setArticle(typedArticle)

      // Fetch related articles from same category
      if (typedArticle.category_id) {
        const { data: relatedData } = await supabase
          .from('articles')
          .select(`*, category:categories(*), author:authors(*)`)
          .eq('category_id', typedArticle.category_id)
          .eq('status', 'published')
          .neq('id', typedArticle.id)
          .order('published_at', { ascending: false })
          .limit(3)

        setRelatedArticles((relatedData || []) as ArticleWithRelations[])
      }

      setLoading(false)
      setDataFetched(true)
    }

    fetchData()
  }, [slug])

  // GSAP animations
  useEffect(() => {
    if (!dataFetched) return

    // Header animation on load
    if (headerRef.current) {
      const elements = headerRef.current.querySelectorAll('a, h1, p')
      gsap.fromTo(elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out'
        }
      )
    }

    // Content reveal
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.3
        }
      )
    }

    // Related articles
    if (relatedRef.current) {
      const articleElements = relatedRef.current.querySelectorAll('article')
      gsap.fromTo(articleElements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: relatedRef.current,
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
      </div>
    )
  }

  // Article not found
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Članak nije pronađen</h1>
          <Link href="/" className="text-coral hover:text-coral-dark">
            Povratak na početnu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Article Header */}
      <header ref={headerRef} className="container pt-12 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          {article.category && (
            <Link
              href={`/${article.category.slug}`}
              className="inline-block px-4 py-1.5 bg-coral text-white text-xs font-medium uppercase tracking-wider rounded mb-6 hover:bg-coral-dark"
            >
              {article.category.name}
            </Link>
          )}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              {article.excerpt}
            </p>
          )}
          <p className="text-sm text-gray-500 uppercase tracking-wider">
            {article.author?.name || 'Redakcija'} / {article.published_at ? format(new Date(article.published_at), 'd. MMMM', { locale: hr }) : ''}
          </p>
        </div>
      </header>

      {/* Main Content Area with Floating Share Sidebar */}
      <div ref={contentRef} className="container pb-12">
        <div className="relative max-w-4xl mx-auto">
          {/* Floating Share Sidebar (Desktop) */}
          <aside className="hidden lg:block absolute -left-20 top-0 w-12">
            <div className="sticky top-24 flex flex-col items-center gap-1 py-4 bg-white border border-gray-100 rounded-lg shadow-sm">
              <ShareButton platform="facebook" url={currentUrl} title={article.title} />
              <ShareButton platform="pinterest" url={currentUrl} title={article.title} />
              <ShareButton platform="twitter" url={currentUrl} title={article.title} />
              <ShareButton platform="linkedin" url={currentUrl} title={article.title} />
              <ShareButton platform="email" url={currentUrl} title={article.title} />
            </div>
          </aside>

          {/* Featured Image */}
          {article.featured_image && (
            <figure className="mb-8">
              <div className="aspect-[16/10] relative rounded-lg overflow-hidden">
                <Image
                  src={article.featured_image || placeholderImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            </figure>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-coral prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:text-coral prose-blockquote:not-italic prose-blockquote:font-normal
              prose-a:text-coral prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg
            "
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>

      {/* Share CTA Bar */}
      <section className="bg-dark-bg py-6 mb-12">
        <div className="container">
          <div className="flex items-center justify-center gap-6">
            <span className="text-white font-medium uppercase tracking-wider text-sm">
              Podijeli ovaj članak
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/70 hover:text-white"
                aria-label="Podijeli na Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                </svg>
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/70 hover:text-white"
                aria-label="Podijeli na Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.373 23.178c-.07-.937-.134-2.377.028-3.401.146-.927.943-5.893.943-5.893s-.24-.482-.24-1.195c0-1.119.649-1.954 1.458-1.954.688 0 1.02.517 1.02 1.136 0 .692-.44 1.727-.667 2.686-.19.803.403 1.458 1.195 1.458 1.434 0 2.535-1.513 2.535-3.695 0-1.932-1.389-3.282-3.372-3.282-2.297 0-3.646 1.722-3.646 3.504 0 .694.267 1.438.6 1.842a.24.24 0 0 1 .056.23c-.061.256-.198.803-.225.916-.035.146-.116.177-.267.107-.997-.464-1.62-1.923-1.62-3.094 0-2.517 1.83-4.83 5.276-4.83 2.77 0 4.924 1.973 4.924 4.61 0 2.752-1.735 4.968-4.143 4.968-.809 0-1.57-.42-1.831-.917l-.498 1.898c-.18.694-.668 1.565-.995 2.097A12 12 0 1 0 12 0z" />
                </svg>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/70 hover:text-white"
                aria-label="Podijeli na X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/70 hover:text-white"
                aria-label="Podijeli na LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(currentUrl)}`}
                className="p-2 text-white/70 hover:text-white"
                aria-label="Podijeli putem emaila"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section ref={relatedRef} className="container pb-16">
          <h2 className="font-serif text-2xl font-bold mb-8">Povezani članci</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((relatedArticle) => (
              <article key={relatedArticle.id} className="group">
                <Link href={`/${relatedArticle.category?.slug || categorySlug}/${relatedArticle.slug}`}>
                  <div className="aspect-[4/3] relative rounded-lg overflow-hidden mb-4 img-hover">
                    <Image
                      src={relatedArticle.featured_image || placeholderImage}
                      alt={relatedArticle.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{relatedArticle.category?.name || 'Članak'}</p>
                  <h3 className="font-serif text-lg font-semibold leading-tight group-hover:text-coral">
                    {relatedArticle.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
