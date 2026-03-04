'use client'

import { useState, useEffect, useRef } from 'react'
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
  featured_video: string | null
  media_type: 'image' | 'video'
  category_id: string | null
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
  category?: Category | null
  author?: Author | null
}

// Placeholder image for articles without images
const placeholderImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

// Video player component with controls and proper dimensions
function VideoPlayer({ videoUrl, title }: { videoUrl: string; title: string }) {
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const isVimeo = videoUrl.includes('vimeo.com')

  if (isYouTube) {
    let videoId = ''
    try {
      if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('/').pop()?.split('?')[0] || ''
      } else if (videoUrl.includes('youtube.com/shorts/')) {
        videoId = videoUrl.split('/shorts/')[1]?.split('?')[0] || ''
      } else {
        videoId = new URL(videoUrl).searchParams.get('v') || ''
      }
    } catch {
      const match = videoUrl.match(/(?:v=|\/)([\w-]{11})(?:\?|&|$)/)
      videoId = match ? match[1] : ''
    }

    if (videoId) {
      return (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title={title}
          />
        </div>
      )
    }
  }

  if (isVimeo) {
    const videoId = videoUrl.split('/').pop()?.split('?')[0] || ''
    if (videoId) {
      return (
        <div className="aspect-video">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </div>
      )
    }
  }

  // Direct video file - let it determine its own dimensions
  return (
    <video
      src={videoUrl}
      className="w-full h-auto"
      controls
      playsInline
    />
  )
}

// Component to render either image or video
function ArticleMedia({
  article,
  className = '',
  sizes = '100vw',
  priority = false,
  showControls = false
}: {
  article: ArticleWithRelations
  className?: string
  sizes?: string
  priority?: boolean
  showControls?: boolean
}) {
  const isVideo = article.media_type === 'video' && article.featured_video

  if (isVideo) {
    const videoUrl = article.featured_video!
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
    const isVimeo = videoUrl.includes('vimeo.com')

    if (isYouTube) {
      let videoId = ''
      try {
        if (videoUrl.includes('youtu.be')) {
          videoId = videoUrl.split('/').pop()?.split('?')[0] || ''
        } else if (videoUrl.includes('youtube.com/shorts/')) {
          videoId = videoUrl.split('/shorts/')[1]?.split('?')[0] || ''
        } else {
          videoId = new URL(videoUrl).searchParams.get('v') || ''
        }
      } catch {
        // Fallback: try to extract video ID with regex
        const match = videoUrl.match(/(?:v=|\/)([\w-]{11})(?:\?|&|$)/)
        videoId = match ? match[1] : ''
      }

      if (videoId) {
        const params = showControls
          ? `controls=1&rel=0`
          : `autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0`
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?${params}`}
            className={`absolute inset-0 w-full h-full ${className}`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title={article.title}
          />
        )
      }
    }

    if (isVimeo) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0] || ''
      if (videoId) {
        const params = showControls
          ? ``
          : `autoplay=1&muted=1&loop=1&background=1`
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?${params}`}
            className={`absolute inset-0 w-full h-full ${className}`}
            allow="autoplay; fullscreen"
            allowFullScreen
            title={article.title}
          />
        )
      }
    }

    return (
      <video
        src={videoUrl}
        className={`object-cover w-full h-full ${className}`}
        autoPlay={!showControls}
        muted={!showControls}
        loop={!showControls}
        playsInline
        controls={showControls}
      />
    )
  }

  return (
    <Image
      src={article.featured_image || placeholderImage}
      alt={article.title}
      fill
      className={`object-cover ${className}`}
      priority={priority}
      sizes={sizes}
    />
  )
}

export default function HomePage() {
  const [heroSlides, setHeroSlides] = useState<ArticleWithRelations[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [novostiArticles, setNovostiArticles] = useState<ArticleWithRelations[]>([])
  const [intervjuTjedna, setIntervjuTjedna] = useState<ArticleWithRelations | null>(null)
  const [izdvojenoArticles, setIzdvojenoArticles] = useState<ArticleWithRelations[]>([])
  const [popularnoArticles, setPopularnoArticles] = useState<ArticleWithRelations[]>([])
  const [intervjuArticles, setIntervjuArticles] = useState<ArticleWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [dataFetched, setDataFetched] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Find interview category ID
      const { data: interviewCat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'intervjui')
        .single()

      const interviewCategoryId = interviewCat && typeof interviewCat === 'object' && 'id' in interviewCat
        ? (interviewCat as { id: string }).id
        : null

      // Fetch hero slides (latest 4 articles for carousel)
      const { data: heroData } = await supabase
        .from('articles')
        .select(`*, category:categories(*), author:authors(*)`)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(4)

      // Fetch novosti articles (9 articles after hero: positions 4-12)
      let novostiQuery = supabase
        .from('articles')
        .select(`*, category:categories(*), author:authors(*)`)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(4, 12)

      if (interviewCategoryId) {
        novostiQuery = novostiQuery.neq('category_id', interviewCategoryId)
      }
      const { data: novostiData } = await novostiQuery

      // Fetch interview of the week
      if (interviewCategoryId) {
        const { data: intervjuData } = await supabase
          .from('articles')
          .select(`*, category:categories(*), author:authors(*)`)
          .eq('status', 'published')
          .eq('category_id', interviewCategoryId)
          .order('published_at', { ascending: false })
          .limit(1)
          .single()

        setIntervjuTjedna(intervjuData as ArticleWithRelations | null)

        const { data: moreInterviews } = await supabase
          .from('articles')
          .select(`*, category:categories(*), author:authors(*)`)
          .eq('status', 'published')
          .eq('category_id', interviewCategoryId)
          .order('published_at', { ascending: false })
          .range(1, 3)

        setIntervjuArticles((moreInterviews || []) as ArticleWithRelations[])
      }

      // Fetch izdvojeno articles (9 articles after novosti: positions 13-21)
      const { data: izdvojenoData } = await supabase
        .from('articles')
        .select(`*, category:categories(*), author:authors(*)`)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(13, 21)

      // Fetch popularno articles (3 articles after izdvojeno: positions 22-24)
      const { data: popularnoData } = await supabase
        .from('articles')
        .select(`*, category:categories(*), author:authors(*)`)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(22, 24)

      setHeroSlides((heroData || []) as ArticleWithRelations[])
      setNovostiArticles((novostiData || []) as ArticleWithRelations[])
      setIzdvojenoArticles((izdvojenoData || []) as ArticleWithRelations[])
      setPopularnoArticles((popularnoData || []) as ArticleWithRelations[])
      setLoading(false)
      setDataFetched(true)
    }

    fetchData()
  }, [])

  // Scroll-triggered animations
  useEffect(() => {
    if (!dataFetched) return

    const sections = sectionsRef.current.filter(Boolean)

    sections.forEach((section) => {
      if (!section) return

      const elements = section.querySelectorAll('.animate-in')
      if (elements.length > 0) {
        gsap.fromTo(elements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        )
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [dataFetched])

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-play carousel
  useEffect(() => {
    if (heroSlides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroSlides.length])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Hvala na prijavi!')
    setNewsletterEmail('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
      </div>
    )
  }

  return (
    <main className="bg-background">
      {/* Hero Section - Trika Style */}
      <section ref={(el) => { sectionsRef.current[0] = el }} className="pt-4 pb-16 overflow-hidden">
        {/* Full Width MATER Branding - edge to edge */}
        <div className="mb-6 animate-in">
          <h1 className="flex justify-between w-full px-2 md:px-4">
            {'MATER'.split('').map((letter, i) => (
              <span
                key={i}
                className="font-display font-normal text-coral leading-none"
                style={{ fontSize: 'clamp(58px, 18vw, 336px)' }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Hero Tagline */}
        <div className="container flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 animate-in">
          <p className="font-serif text-xl md:text-2xl text-foreground max-w-md">
            Inspirirajte svoj <em className="not-italic text-coral">obiteljski život</em>
          </p>
          <p className="text-sm text-foreground/50 uppercase tracking-wider">
            Portal za moderne mame
          </p>
        </div>

        {/* Hero Carousel */}
        {heroSlides.length > 0 && (
          <div className="container animate-in">
            <div ref={sliderRef} className="relative overflow-hidden">
              {/* Slides */}
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroSlides.map((slide, index) => (
                  <Link
                    key={slide.id}
                    href={`/${slide.category?.slug || 'vijesti'}/${slide.slug}`}
                    className="block group w-full flex-shrink-0"
                  >
                    <div className="aspect-[4/5] md:aspect-[2/1] relative overflow-hidden">
                      <ArticleMedia
                        article={slide}
                        sizes="100vw"
                        priority={index === 0}
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Overlay with title */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                        <p className="text-xs uppercase tracking-wider text-white/70 mb-2">
                          {slide.category?.name}
                        </p>
                        <h2 className="font-serif text-xl md:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-3xl">
                          {slide.title}
                        </h2>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Navigation Arrows */}
              {heroSlides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors"
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors"
                    aria-label="Next slide"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {heroSlides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'bg-white w-6'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Novosti Section - Trika Style Grid */}
      {novostiArticles.length > 0 && (
        <section ref={(el) => { sectionsRef.current[1] = el }} className="container py-16 md:py-24">
          {/* Section Header with Divider */}
          <div className="animate-in mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Novosti</h2>
            <div className="w-full h-px bg-foreground/10"></div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {novostiArticles.map((article) => (
              <article key={article.id} className="group animate-in">
                <Link href={`/${article.category?.slug || 'vijesti'}/${article.slug}`}>
                  <div className="aspect-[4/3] relative overflow-hidden mb-4">
                    <ArticleMedia
                      article={article}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-[11px] uppercase tracking-wider text-coral font-medium mb-2">
                    {article.category?.name}
                  </p>
                  <h3 className="font-serif text-lg md:text-xl font-semibold leading-snug text-foreground group-hover:text-coral transition-colors mb-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-foreground/60 text-sm leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Intervju tjedna Section */}
      {intervjuTjedna && (
        <section ref={(el) => { sectionsRef.current[2] = el }} className="container py-16 md:py-24">
          {/* Section Header with Divider */}
          <div className="animate-in mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Intervju tjedna/mjeseca</h2>
            <div className="w-full h-px bg-foreground/10"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left - Image/Video */}
            <div className="animate-in">
              {intervjuTjedna.media_type === 'video' && intervjuTjedna.featured_video ? (
                <div className="relative overflow-hidden rounded-sm bg-black">
                  <VideoPlayer
                    videoUrl={intervjuTjedna.featured_video}
                    title={intervjuTjedna.title}
                  />
                </div>
              ) : (
                <Link href={`/${intervjuTjedna.category?.slug || 'intervjui'}/${intervjuTjedna.slug}`} className="block group">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-sm">
                    <ArticleMedia
                      article={intervjuTjedna}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>
              )}
            </div>

            {/* Right - Text Content */}
            <div className="flex flex-col justify-center animate-in">
              <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-6">
                {intervjuTjedna.title}
              </h3>
              {intervjuTjedna.excerpt && (
                <p className="text-foreground/60 text-sm md:text-base leading-relaxed mb-8">
                  {intervjuTjedna.excerpt}
                </p>
              )}
              <Link
                href={`/${intervjuTjedna.category?.slug || 'intervjui'}/${intervjuTjedna.slug}`}
                className="inline-flex items-center justify-center w-fit px-6 py-3 bg-coral hover:bg-coral-dark text-white text-sm font-medium rounded transition-colors"
              >
                Pročitaj više
              </Link>
            </div>
          </div>

          {/* Bottom Divider */}
          <div className="mt-16 w-full h-px bg-foreground/10"></div>
        </section>
      )}

      {/* Newsletter Section */}
      <section ref={(el) => { sectionsRef.current[3] = el }} className="bg-coral-light py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="animate-in">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                Ostanite u korak s <em className="text-coral">trendovima</em>
              </h2>
              <p className="text-foreground/60 text-sm">
                Prijavite se na naš newsletter
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row w-full md:w-auto gap-3 animate-in">
              <div className="w-full sm:w-64">
                <div className="flex items-center bg-white border border-foreground/10 rounded px-4 py-3">
                  <svg className="w-4 h-4 text-foreground/40 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Vaš email"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-3 bg-foreground text-white text-sm font-medium rounded hover:bg-black whitespace-nowrap transition-colors"
              >
                Prijavi se
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Izdvojeno Section */}
      {izdvojenoArticles.length > 0 && (
        <section ref={(el) => { sectionsRef.current[4] = el }} className="container py-16 md:py-24">
          {/* Section Header with Divider */}
          <div className="animate-in mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Izdvojeno</h2>
            <div className="w-full h-px bg-foreground/10"></div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {izdvojenoArticles.map((article) => (
              <article key={article.id} className="group animate-in">
                <Link href={`/${article.category?.slug || 'vijesti'}/${article.slug}`}>
                  <div className="aspect-[4/3] relative overflow-hidden mb-4">
                    <ArticleMedia
                      article={article}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-[11px] uppercase tracking-wider text-coral font-medium mb-2">
                    {article.category?.name}
                  </p>
                  <h3 className="font-serif text-lg md:text-xl font-semibold leading-snug text-foreground group-hover:text-coral transition-colors mb-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-foreground/60 text-sm leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </Link>
              </article>
            ))}
          </div>

          {/* Bottom Divider */}
          <div className="mt-16 w-full h-px bg-foreground/10"></div>
        </section>
      )}

      {/* Popularno Section */}
      {popularnoArticles.length > 0 && (
        <section ref={(el) => { sectionsRef.current[5] = el }} className="container py-16 md:py-24">
          {/* Section Header with Divider */}
          <div className="animate-in mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Popularno</h2>
            <div className="w-full h-px bg-foreground/10"></div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {popularnoArticles.map((article) => (
              <article key={article.id} className="group animate-in">
                <Link href={`/${article.category?.slug || 'vijesti'}/${article.slug}`}>
                  <div className="aspect-[4/3] relative overflow-hidden mb-4">
                    <ArticleMedia
                      article={article}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-[11px] uppercase tracking-wider text-coral font-medium mb-2">
                    {article.category?.name}
                  </p>
                  <h3 className="font-serif text-lg md:text-xl font-semibold leading-snug text-foreground group-hover:text-coral transition-colors mb-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-foreground/60 text-sm leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </Link>
              </article>
            ))}
          </div>

          {/* Bottom Divider */}
          <div className="mt-16 w-full h-px bg-foreground/10"></div>
        </section>
      )}

      {/* Intervju Grid */}
      {intervjuArticles.length > 0 && (
        <section ref={(el) => { sectionsRef.current[6] = el }} className="container py-16 md:py-24">
          <div className="flex items-end justify-between mb-10 animate-in">
            <h2 className="font-serif text-2xl md:text-3xl font-bold">Intervjui</h2>
            <Link
              href="/intervjui"
              className="text-sm text-foreground/50 hover:text-coral transition-colors"
            >
              Pogledaj sve
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {intervjuArticles.map((article) => (
              <article key={article.id} className="group animate-in">
                <Link href={`/${article.category?.slug || 'intervjui'}/${article.slug}`}>
                  <div className="aspect-[4/5] relative overflow-hidden mb-4">
                    <ArticleMedia
                      article={article}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2">
                    {article.category?.name}
                  </p>
                  <h3 className="font-serif text-base md:text-lg font-semibold leading-snug group-hover:text-coral transition-colors mb-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-foreground/60 text-sm leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
