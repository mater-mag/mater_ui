'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ArticleWithRelations } from '@/lib/supabase/homepage-queries'

const placeholderImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

interface HeroCarouselProps {
  articles: ArticleWithRelations[]
}

function ArticleMedia({
  article,
  className = '',
  sizes = '100vw',
  priority = false
}: {
  article: ArticleWithRelations
  className?: string
  sizes?: string
  priority?: boolean
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
        const match = videoUrl.match(/(?:v=|\/)([\w-]{11})(?:\?|&|$)/)
        videoId = match ? match[1] : ''
      }

      if (videoId) {
        const params = `autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0`
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
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1`}
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
        autoPlay
        muted
        loop
        playsInline
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

export function HeroCarousel({ articles }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-play carousel
  useEffect(() => {
    if (articles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [articles.length])

  if (articles.length === 0) return null

  return (
    <div className="container pb-0 animate-in">
      <div ref={sliderRef} className="relative overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {articles.map((slide, index) => (
            <Link
              key={slide.id}
              href={`/${slide.category?.slug || 'vijesti'}/${slide.slug}`}
              className="block group w-full flex-shrink-0"
            >
              <div className="aspect-[2/3] md:aspect-[2/1] relative overflow-hidden">
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
                  <h2 className="font-serif text-xl md:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-3xl" style={{ paddingBottom: '5rem' }}>
                    {slide.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dot indicators */}
        {articles.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {articles.map((_, index) => (
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
  )
}
