import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://matermag.hr'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/page/o-nama`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/page/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Categories
  const categories = ['vijesti', 'lifestyle', 'zdravlje', 'recepti', 'djeca']
  const categoryPages = categories.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // TODO: Fetch articles from Supabase
  // const supabase = await createClient()
  // const { data: articles } = await supabase
  //   .from('articles')
  //   .select('slug, category:categories(slug), updated_at')
  //   .eq('status', 'published')

  // Mock articles for now
  const articlePages = [
    {
      url: `${baseUrl}/recepti/kako-pripremiti-zdravi-dorucak-za-cijelu-obitelj`,
      lastModified: new Date('2026-01-20'),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/djeca/10-savjeta-za-bolji-san-vaseg-djeteta`,
      lastModified: new Date('2026-01-19'),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  return [...staticPages, ...categoryPages, ...articlePages]
}
