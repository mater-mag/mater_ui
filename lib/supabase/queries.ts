import { createClient } from './server'
import type { Article, Category, Page, Author, Media, SEOSettings } from '@/types/database'

// Articles
export async function getArticles(options?: {
  limit?: number
  offset?: number
  status?: Article['status']
  categorySlug?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('articles')
    .select('*, category:categories(*), author:authors(*)')
    .order('published_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.categorySlug) {
    query = query.eq('category.slug', options.categorySlug)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data as (Article & { category: Category | null; author: Author | null })[]
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*, category:categories(*), author:authors(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) return null
  return data as Article & { category: Category | null; author: Author | null }
}

export async function getArticlesByCategorySlug(categorySlug: string, limit = 20) {
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) return []

  const categoryData = category as { id: string }

  const { data, error } = await supabase
    .from('articles')
    .select('*, category:categories(*), author:authors(*)')
    .eq('category_id', categoryData.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as (Article & { category: Category | null; author: Author | null })[]
}

// Categories
export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Category[]
}

// Get categories formatted for navigation (Header/Footer)
export async function getNavigationCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error

  const categories = data as Category[]

  // Separate parents and children
  const parents = categories.filter(c => !c.parent_id)
  const children = categories.filter(c => c.parent_id)

  // Build hierarchical structure for navigation
  return parents.map(parent => {
    const subcategories = children
      .filter(child => child.parent_id === parent.id)
      .map(child => {
        // Extract short slug by removing parent prefix if present
        let shortSlug = child.slug
        if (child.slug.startsWith(parent.slug + '-')) {
          shortSlug = child.slug.slice(parent.slug.length + 1)
        }
        return {
          name: child.name,
          slug: shortSlug,
        }
      })

    return {
      name: parent.name,
      slug: parent.slug,
      featured: parent.slug === 'za-mame-od-mame', // First category is featured
      ...(subcategories.length > 0 ? { subcategories } : {}),
    }
  })
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as Category
}

// Pages
export async function getPageBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) return null
  return data as Page
}

export async function getPages() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('title')

  if (error) throw error
  return data as Page[]
}

// Authors
export async function getAuthors() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Author[]
}

export async function getAuthorById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Author
}

// Media
export async function getMedia(limit = 50, offset = 0) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data as Media[]
}

// SEO Settings
export async function getSEOSettings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .single()

  if (error) return null
  return data as SEOSettings
}

// Search
export async function searchArticles(query: string, limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*, category:categories(*), author:authors(*)')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as (Article & { category: Category | null; author: Author | null })[]
}
