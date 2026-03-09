'use client'

import { useRef, useEffect } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  fill?: boolean
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
}

export function VideoPlayer({
  videoUrl,
  title,
  fill = false,
  autoplay = false,
  muted = true,
  loop = true
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const isVimeo = videoUrl.includes('vimeo.com')

  const wrapperClass = fill ? 'absolute inset-0' : 'aspect-video'
  const iframeClass = fill ? 'absolute inset-0 w-full h-full' : 'w-full h-full'

  // Intersection observer for autoplay on native videos
  useEffect(() => {
    if (!autoplay || isYouTube || isVimeo) return

    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay was prevented, that's okay
            })
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [autoplay, isYouTube, isVimeo])

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
      // Build YouTube params
      const params = new URLSearchParams({
        rel: '0',
        ...(autoplay && { autoplay: '1', mute: '1' }),
        ...(loop && { loop: '1', playlist: videoId }),
      })

      return (
        <div ref={containerRef} className={wrapperClass}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
            className={iframeClass}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title={title}
          />
        </div>
      )
    }
  }

  if (isVimeo) {
    const videoId = videoUrl.split('/').pop()?.split('?')[0] || ''
    if (videoId) {
      // Build Vimeo params
      const params = new URLSearchParams({
        ...(autoplay && { autoplay: '1', muted: '1', background: '1' }),
        ...(loop && { loop: '1' }),
      })

      return (
        <div ref={containerRef} className={wrapperClass}>
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?${params.toString()}`}
            className={iframeClass}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </div>
      )
    }
  }

  // Direct video file
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className={fill ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-auto'}
      controls={!autoplay}
      playsInline
      muted={muted}
      loop={loop}
    />
  )
}
