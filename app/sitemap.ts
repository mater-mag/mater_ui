import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://matermag.hr'
  const supabase = await createClient()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  // Fetch pages from Supabase
  const { data: pages } = await supabase
    .from('pages')
    .select('slug, updated_at')
    .eq('status', 'published')
    .returns<{ slug: string; updated_at: string }[]>()

  const pageUrls = (pages || []).map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Fetch categories from Supabase
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .returns<{ slug: string; updated_at: string }[]>()

  const categoryUrls = (categories || []).map((category) => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Fetch articles from Supabase
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, category:categories(slug), updated_at')
    .eq('status', 'published')
    .returns<{ slug: string; updated_at: string; category: { slug: string } | null }[]>()

  const articleUrls = (articles || []).map((article) => {
    const categorySlug = article.category?.slug || 'vijesti'
    return {
      url: `${baseUrl}/${categorySlug}/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  return [...staticPages, ...pageUrls, ...categoryUrls, ...articleUrls]
}
