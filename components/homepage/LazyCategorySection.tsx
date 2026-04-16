'use client'

import { useState, useEffect, useRef } from 'react'
import type { Category } from '@/types/database'
import { CategorySectionContent } from './CategorySectionContent'

interface LazyCategorySectionProps {
  category: Category
  articlesPerSection?: number
}

function CategorySkeleton() {
  return (
    <section className="container pt-16 md:pt-24">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-8 w-48 bg-foreground/10 rounded animate-pulse mb-4"></div>
        <div className="w-full h-px bg-foreground/10"></div>
      </div>

      {/* Grid skeleton */}
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

export function LazyCategorySection({ category, articlesPerSection = 6 }: LazyCategorySectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px',
        threshold: 0
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={sectionRef}>
      {isVisible ? (
        <CategorySectionContent
          category={category}
          limit={articlesPerSection}
        />
      ) : (
        <CategorySkeleton />
      )}
    </div>
  )
}
