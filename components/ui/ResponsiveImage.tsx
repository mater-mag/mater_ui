'use client'

import Image from 'next/image'

interface ResponsiveImageProps {
  desktopSrc: string | null | undefined
  mobileSrc: string | null | undefined
  alt: string
  fill?: boolean
  priority?: boolean
  sizes?: string
  className?: string
  fallbackSrc?: string
}

const defaultFallback = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

export function ResponsiveImage({
  desktopSrc,
  mobileSrc,
  alt,
  fill = false,
  priority = false,
  sizes = '100vw',
  className = '',
  fallbackSrc = defaultFallback
}: ResponsiveImageProps) {
  const desktop = desktopSrc || fallbackSrc
  const mobile = mobileSrc || desktop // Fall back to desktop if no mobile image

  // If both are the same, just render a single image
  if (desktop === mobile) {
    return (
      <Image
        src={desktop}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={className}
      />
    )
  }

  // Use picture element for different sources
  // Note: We use regular img inside picture since Next/Image doesn't support picture element
  // For fill mode, we need to handle it with CSS
  if (fill) {
    return (
      <picture className="contents">
        <source media="(max-width: 767px)" srcSet={mobile} />
        <source media="(min-width: 768px)" srcSet={desktop} />
        <img
          src={desktop}
          alt={alt}
          className={`absolute inset-0 w-full h-full ${className}`}
          loading={priority ? 'eager' : 'lazy'}
        />
      </picture>
    )
  }

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile} />
      <source media="(min-width: 768px)" srcSet={desktop} />
      <img
        src={desktop}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
      />
    </picture>
  )
}
