'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types/database'
import type { ArticleWithRelations } from '@/lib/supabase/homepage-queries'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const placeholderImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

interface CategorySectionContentProps {
  category: Category
  limit?: number
}

export function CategorySectionContent({ category, limit = 6 }: CategorySectionContentProps) {
  const [articles, setArticles] = useState<ArticleWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    async function fetchArticles() {
      const supabase = createClient()

      // First, get all child category IDs for this parent
      const { data: childCategories } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', category.id)

      // Build array of category IDs to search (parent + children)
      const children = (childCategories || []) as { id: string }[]
      const categoryIds = [category.id, ...children.map(c => c.id)]

      // Fetch articles from parent category and all child categories
      const { data } = await supabase
        .from('articles')
        .select('*, category:categories(*), author:authors(*)')
        .eq('status', 'published')
        .in('category_id', categoryIds)
        .order('published_at', { ascending: false })
        .limit(limit)

      setArticles((data || []) as ArticleWithRelations[])
      setLoading(false)
    }

    fetchArticles()
  }, [category.id, limit])

  // Apply GSAP animations after articles load
  useEffect(() => {
    if (loading || !sectionRef.current) return

    const section = sectionRef.current
    const elements = section.querySelectorAll('.animate-in')

    if (elements.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
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
    }, section)

    return () => ctx.revert()
  }, [loading])

  if (loading) {
    return (
      <section className="container py-16 md:py-24">
        <div className="mb-10">
          <div className="h-8 w-48 bg-foreground/10 rounded animate-pulse mb-4"></div>
          <div className="w-full h-px bg-foreground/10"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-foreground/10 rounded mb-4"></div>
              <div className="h-3 w-16 bg-foreground/10 rounded mb-2"></div>
              <div className="h-5 w-full bg-foreground/10 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-foreground/10 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (articles.length === 0) return null

  return (
    <section ref={sectionRef} className="container py-16 md:py-24">
      {/* Section Header */}
      <div className="animate-in mb-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold">{category.name}</h2>
          <Link
            href={`/${category.slug}`}
            className="text-sm text-foreground/50 hover:text-coral transition-colors"
          >
            Pogledaj sve
          </Link>
        </div>
        <div className="w-full h-px bg-foreground/10"></div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {articles.map((article) => (
          <article key={article.id} className="group animate-in">
            <Link href={`/${article.category?.slug || category.slug}/${article.slug}`}>
              <div className="aspect-[4/3] relative overflow-hidden mb-4">
                <Image
                  src={article.featured_image || placeholderImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="text-[11px] uppercase tracking-wider text-coral font-medium mb-2">
                {article.category?.name || category.name}
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
  )
}
