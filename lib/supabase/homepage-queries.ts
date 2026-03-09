import { createClient } from './server'
import type { Article, Category, Author } from '@/types/database'

export type ArticleWithRelations = Omit<Article, 'category' | 'author'> & {
  category?: Category | null
  author?: Author | null
}

export interface HomepageData {
  heroArticles: ArticleWithRelations[]
  novostiArticles: ArticleWithRelations[]
  intervjuTjedna: ArticleWithRelations | null
  intervjuGrid: ArticleWithRelations[]
  popularnoArticles: ArticleWithRelations[]
  categories: Category[]
}

export async function getHomepageData(): Promise<HomepageData> {
  const supabase = await createClient()

  // First, get the interview category ID
  const { data: interviewCat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'intervjui')
    .single()

  const interviewCategoryId = (interviewCat as { id: string } | null)?.id || null

  // Execute all queries in parallel
  const [
    heroResult,
    novostiResult,
    intervjuFeaturedResult,
    intervjuGridResult,
    popularnoResult,
    categoriesResult
  ] = await Promise.all([
    // Hero slides (latest 4 articles)
    supabase
      .from('articles')
      .select('*, category:categories(*), author:authors(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(4),

    // Novosti (6 articles, excluding interviews)
    interviewCategoryId
      ? supabase
          .from('articles')
          .select('*, category:categories(*), author:authors(*)')
          .eq('status', 'published')
          .neq('category_id', interviewCategoryId)
          .order('published_at', { ascending: false })
          .range(0, 5)
      : supabase
          .from('articles')
          .select('*, category:categories(*), author:authors(*)')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .range(0, 5),

    // Intervju featured (1 article)
    interviewCategoryId
      ? supabase
          .from('articles')
          .select('*, category:categories(*), author:authors(*)')
          .eq('status', 'published')
          .eq('category_id', interviewCategoryId)
          .order('published_at', { ascending: false })
          .limit(1)
          .single()
      : Promise.resolve({ data: null, error: null }),

    // Intervju grid (3 more articles)
    interviewCategoryId
      ? supabase
          .from('articles')
          .select('*, category:categories(*), author:authors(*)')
          .eq('status', 'published')
          .eq('category_id', interviewCategoryId)
          .order('published_at', { ascending: false })
          .range(1, 3)
      : Promise.resolve({ data: [], error: null }),

    // Popularno (3 articles)
    supabase
      .from('articles')
      .select('*, category:categories(*), author:authors(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(18, 20),

    // All parent categories for dynamic sections
    supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('name', { ascending: true })
  ])

  return {
    heroArticles: (heroResult.data || []) as ArticleWithRelations[],
    novostiArticles: (novostiResult.data || []) as ArticleWithRelations[],
    intervjuTjedna: intervjuFeaturedResult.data as ArticleWithRelations | null,
    intervjuGrid: (intervjuGridResult.data || []) as ArticleWithRelations[],
    popularnoArticles: (popularnoResult.data || []) as ArticleWithRelations[],
    categories: (categoriesResult.data || []) as Category[]
  }
}

// Client-side function for lazy loading category articles
export async function getCategoryArticles(
  categoryId: string,
  limit = 6
): Promise<ArticleWithRelations[]> {
  // This function is meant to be called from client components
  // using the browser Supabase client
  const { createClient: createBrowserClient } = await import('./client')
  const supabase = createBrowserClient()

  const { data } = await supabase
    .from('articles')
    .select('*, category:categories(*), author:authors(*)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .order('published_at', { ascending: false })
    .limit(limit)

  return (data || []) as ArticleWithRelations[]
}
