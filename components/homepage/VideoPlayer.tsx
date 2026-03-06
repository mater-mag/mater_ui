'use client'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  fill?: boolean
}

export function VideoPlayer({ videoUrl, title, fill = false }: VideoPlayerProps) {
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const isVimeo = videoUrl.includes('vimeo.com')

  const wrapperClass = fill ? 'absolute inset-0' : 'aspect-video'
  const iframeClass = fill ? 'absolute inset-0 w-full h-full' : 'w-full h-full'

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
      return (
        <div className={wrapperClass}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
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
      return (
        <div className={wrapperClass}>
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
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
      src={videoUrl}
      className={fill ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-auto'}
      controls
      playsInline
    />
  )
}
