'use client'

import { useEffect, useRef } from 'react'

interface ArticleContentProps {
  content: string
  className?: string
}

export function ArticleContent({ content, className = '' }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!content) return

    // Check if content has Instagram embeds
    if (content.includes('instagram-media') || content.includes('data-instagram-embed')) {
      // Load Instagram embed script
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      document.body.appendChild(script)

      // Process embeds when script loads
      script.onload = () => {
        if ((window as unknown as { instgrm?: { Embeds: { process: () => void } } }).instgrm) {
          (window as unknown as { instgrm: { Embeds: { process: () => void } } }).instgrm.Embeds.process()
        }
      }

      return () => {
        // Cleanup script on unmount
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    }
  }, [content])

  return (
    <div
      ref={contentRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
