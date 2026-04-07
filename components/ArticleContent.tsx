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
      const windowWithInstgrm = window as unknown as { instgrm?: { Embeds: { process: () => void } } }

      // Fix empty blockquotes before processing - Instagram requires content inside
      const fixEmptyBlockquotes = () => {
        if (!contentRef.current) return
        const blockquotes = contentRef.current.querySelectorAll('blockquote.instagram-media')
        blockquotes.forEach((blockquote) => {
          if (!blockquote.innerHTML.trim()) {
            const url = blockquote.getAttribute('data-instgrm-permalink') || ''
            blockquote.innerHTML = `<div style="padding:16px;"><a href="${url}" style="background:#FFFFFF; line-height:0; padding:0; text-align:center; text-decoration:none; width:100%;" target="_blank">View this post on Instagram</a></div>`
          }
        })
      }

      // If Instagram script is already loaded, just reprocess embeds
      if (windowWithInstgrm.instgrm) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          fixEmptyBlockquotes()
          windowWithInstgrm.instgrm?.Embeds.process()
        }, 100)
        return
      }

      // Load Instagram embed script
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      document.body.appendChild(script)

      // Process embeds when script loads
      script.onload = () => {
        fixEmptyBlockquotes()
        if (windowWithInstgrm.instgrm) {
          windowWithInstgrm.instgrm.Embeds.process()
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
