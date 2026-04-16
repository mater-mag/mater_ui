'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SectionHeader } from './SectionHeader'
import { ResponsiveImage } from '@/components/ui'
import type { ArticleWithRelations } from '@/lib/supabase/homepage-queries'

const placeholderImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

interface PopularnoSliderProps {
  articles: ArticleWithRelations[]
  showDivider?: boolean
}

export function PopularnoSlider({ articles, showDivider = true }: PopularnoSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

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
    <section className="container pt-16 md:pt-24">
      <SectionHeader title="Popularno" />

      <div className="relative overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/${article.category?.slug || 'vijesti'}/${article.slug}`}
              className="block group w-full flex-shrink-0"
            >
              <div className="aspect-[2/3] md:aspect-[2/1] relative overflow-hidden">
                <ResponsiveImage
                  desktopSrc={article.featured_image_desktop || article.featured_image}
                  mobileSrc={article.featured_image_mobile}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={index === 0}
                  sizes="100vw"
                  fallbackSrc={placeholderImage}
                />
                {/* Overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <p className="text-sm uppercase tracking-wider text-white/70 mb-2">
                    {article.category?.name}
                  </p>
                  <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl" style={{ paddingBottom: '5rem' }}>
                    {article.title}
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

      {showDivider && <div className="mt-16 w-full h-px bg-foreground/10"></div>}
    </section>
  )
}
