'use client'

import { useEffect, useRef, RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FadeInOptions {
  y?: number
  duration?: number
  delay?: number
  stagger?: number
  trigger?: RefObject<HTMLElement | null>
  start?: string
}

export function useFadeIn(options: FadeInOptions = {}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const {
      y = 50,
      duration = 0.8,
      delay = 0,
      trigger,
      start = 'top 80%',
    } = options

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: trigger?.current || ref.current
          ? {
              trigger: trigger?.current || ref.current,
              start,
            }
          : undefined,
      })
    })

    return () => ctx.revert()
  }, [options])

  return ref
}

export function useStaggerFadeIn(options: FadeInOptions = {}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const {
      y = 30,
      duration = 0.6,
      delay = 0,
      stagger = 0.1,
      start = 'top 80%',
    } = options

    const ctx = gsap.context(() => {
      const children = ref.current?.children
      if (!children) return

      gsap.from(children, {
        y,
        opacity: 0,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start,
        },
      })
    })

    return () => ctx.revert()
  }, [options])

  return ref
}

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [speed])

  return ref
}

export { gsap, ScrollTrigger }
