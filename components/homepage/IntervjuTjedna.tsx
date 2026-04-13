import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from './SectionHeader'
import { VideoPlayer } from './VideoPlayer'
import type { ArticleWithRelations } from '@/lib/supabase/homepage-queries'

const placeholderImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

interface IntervjuTjednaProps {
  featured: ArticleWithRelations | null
  grid: ArticleWithRelations[]
}

export function IntervjuTjedna({ featured, grid }: IntervjuTjednaProps) {
  if (!featured) return null

  return (
    <section className="container py-16 md:py-24">
      <SectionHeader title="Intervju tjedna/mjeseca" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left - Image/Video - matches hero slider height */}
        <div className="animate-in">
          {featured.media_type === 'video' && featured.featured_video ? (
            <div className="aspect-[2/3] lg:aspect-[1/1] relative overflow-hidden rounded-sm bg-black">
              <VideoPlayer
                videoUrl={featured.featured_video}
                title={featured.title}
                fill
                autoplay
                muted
                loop
              />
            </div>
          ) : (
            <Link href={`/${featured.category?.slug || 'intervjui'}/${featured.slug}`} className="block group">
              <div className="aspect-[2/3] lg:aspect-[1/1] relative overflow-hidden rounded-sm">
                <Image
                  src={featured.featured_image || placeholderImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Link>
          )}
        </div>

        {/* Right - Text Content */}
        <div className="flex flex-col justify-center animate-in">
          <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-6">
            {featured.title}
          </h3>
          {featured.excerpt && (
            <p className="text-foreground/60 text-sm md:text-base leading-relaxed mb-8">
              {featured.excerpt}
            </p>
          )}
          <Link
            href={`/${featured.category?.slug || 'intervjui'}/${featured.slug}`}
            className="inline-flex items-center justify-center w-fit px-6 py-3 bg-coral hover:bg-coral-dark text-white text-sm font-medium rounded transition-colors"
          >
            Pročitaj više
          </Link>
        </div>
      </div>

      {/* Grid of more interviews */}
      {grid.length > 0 && (
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {grid.map((article) => (
              <article key={article.id} className="group animate-in">
                <Link href={`/${article.category?.slug || 'intervjui'}/${article.slug}`}>
                  <div className="aspect-[2/3] relative overflow-hidden mb-4">
                    <Image
                      src={article.featured_image || placeholderImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2">
                    {article.category?.name}
                  </p>
                  <h3 className="font-serif text-base md:text-lg font-semibold leading-snug group-hover:text-coral transition-colors mb-2">
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
        </div>
      )}

      {/* Bottom Divider */}
      <div className="mt-16 w-full h-px bg-foreground/10"></div>
    </section>
  )
}
