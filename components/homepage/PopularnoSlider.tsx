'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from './SectionHeader'
import type { ArticleWithRelations } from '@/lib/supabase/homepage-queries'

const placeholderImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

interface PopularnoSliderProps {
  articles: ArticleWithRelations[]
  showDivider?: boolean
}

export function PopularnoSlider({ articles, showDivider = true }: PopularnoSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length)
  }

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
    <section className="container py-16 md:py-24">
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
              <div className="aspect-[4/5] md:aspect-[2/1] relative overflow-hidden">
                <Image
                  src={article.featured_image || placeholderImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={index === 0}
                  sizes="100vw"
                />
                {/* Overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <p className="text-xs uppercase tracking-wider text-white/70 mb-2">
                    {article.category?.name}
                  </p>
                  <h2 className="font-serif text-xl md:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-3xl">
                    {article.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows */}
        {articles.length > 1 && (
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
