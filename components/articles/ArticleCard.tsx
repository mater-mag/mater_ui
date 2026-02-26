import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { hr } from 'date-fns/locale'
import type { Article, Category, Author } from '@/types/database'

interface ArticleCardProps {
  article: Article & {
    category?: Category | null
    author?: Author | null
  }
  variant?: 'default' | 'featured' | 'horizontal'
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const categorySlug = article.category?.slug || 'uncategorized'
  const articleUrl = `/${categorySlug}/${article.slug}`

  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-lg">
        <Link href={articleUrl} className="block">
          <div className="aspect-[16/9] relative">
            {article.featured_image ? (
              <Image
                src={article.featured_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {article.category && (
              <span className="inline-block px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full mb-3">
                {article.category.name}
              </span>
            )}
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-white/80 line-clamp-2 mb-3">{article.excerpt}</p>
            )}
            <div className="flex items-center text-sm text-white/60">
              {article.author && <span>{article.author.name}</span>}
              {article.published_at && (
                <>
                  <span className="mx-2">•</span>
                  <time dateTime={article.published_at}>
                    {format(new Date(article.published_at), 'd. MMMM yyyy.', { locale: hr })}
                  </time>
                </>
              )}
            </div>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article className="group">
        <Link href={articleUrl} className="flex gap-4">
          <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            {article.featured_image ? (
              <Image
                src={article.featured_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="128px"
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            {article.category && (
              <span className="text-xs font-medium text-accent mb-1">
                {article.category.name}
              </span>
            )}
            <h3 className="font-serif font-semibold line-clamp-2 group-hover:text-accent transition-colors">
              {article.title}
            </h3>
            {article.published_at && (
              <time
                dateTime={article.published_at}
                className="text-xs text-muted-foreground mt-1"
              >
                {format(new Date(article.published_at), 'd. MMMM yyyy.', { locale: hr })}
              </time>
            )}
          </div>
        </Link>
      </article>
    )
  }

  // Default card
  return (
    <article className="group">
      <Link href={articleUrl} className="block">
        <div className="aspect-[4/3] relative rounded-lg overflow-hidden mb-4">
          {article.featured_image ? (
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>
        {article.category && (
          <span className="inline-block text-xs font-medium text-accent mb-2">
            {article.category.name}
          </span>
        )}
        <h3 className="font-serif text-xl font-semibold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          {article.author && <span>{article.author.name}</span>}
          {article.published_at && (
            <>
              {article.author && <span className="mx-2">•</span>}
              <time dateTime={article.published_at}>
                {format(new Date(article.published_at), 'd. MMMM yyyy.', { locale: hr })}
              </time>
            </>
          )}
        </div>
      </Link>
    </article>
  )
}
