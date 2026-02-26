export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  featured_video: string | null
  media_type: 'image' | 'video'
  category_id: string | null
  author_id: string | null
  seo_data: SEOData | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
  // Relations
  category?: Category
  author?: Author
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  created_at: string
  updated_at: string
  // Relations
  parent?: Category
  children?: Category[]
  articles?: Article[]
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  seo_data: SEOData | null
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  url: string
  alt: string | null
  caption: string | null
  type: 'image' | 'video' | 'document'
  metadata: MediaMetadata | null
  created_at: string
  updated_at: string
}

export interface MediaMetadata {
  width?: number
  height?: number
  size?: number
  format?: string
  filename?: string
}

export interface Author {
  id: string
  name: string
  bio: string | null
  avatar: string | null
  social_links: SocialLinks | null
  created_at: string
  updated_at: string
}

export interface SocialLinks {
  twitter?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  website?: string
}

export interface SEOSettings {
  id: string
  site_title: string
  site_description: string
  default_og_image: string | null
  google_analytics_id: string | null
  robots_txt: string | null
  created_at: string
  updated_at: string
}

export interface SEOData {
  meta_title?: string
  meta_description?: string
  focus_keyphrase?: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  no_index?: boolean
  no_follow?: boolean
  schema_type?: 'Article' | 'NewsArticle' | 'BlogPosting'
}

// Database response types
export interface Database {
  public: {
    Tables: {
      articles: {
        Row: Article
        Insert: Omit<Article, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
      }
      pages: {
        Row: Page
        Insert: Omit<Page, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>
      }
      media: {
        Row: Media
        Insert: Omit<Media, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Media, 'id' | 'created_at' | 'updated_at'>>
      }
      authors: {
        Row: Author
        Insert: Omit<Author, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Author, 'id' | 'created_at' | 'updated_at'>>
      }
      seo_settings: {
        Row: SEOSettings
        Insert: Omit<SEOSettings, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SEOSettings, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
