import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from './SectionHeader'
import type { ArticleWithRelations } from '@/lib/supabase/homepage-queries'

const placeholderImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'

interface ArticleSectionProps {
  title: string
  articles: ArticleWithRelations[]
  href?: string
  showDivider?: boolean
}

export function ArticleSection({ title, articles, href, showDivider = true }: ArticleSectionProps) {
  if (articles.length === 0) return null

  return (
    <section className="container py-16 md:py-24">
      <SectionHeader title={title} href={href} />

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {articles.map((article) => (
          <article key={article.id} className="group animate-in">
            <Link href={`/${article.category?.slug || 'vijesti'}/${article.slug}`}>
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
                {article.category?.name}
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

      {showDivider && <div className="mt-16 w-full h-px bg-foreground/10"></div>}
    </section>
  )
}
