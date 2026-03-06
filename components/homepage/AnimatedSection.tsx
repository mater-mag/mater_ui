'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
}

export function AnimatedSection({ children, className = '' }: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

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
  }, [])

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  )
}
