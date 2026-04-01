import { NextRequest, NextResponse } from 'next/server'
import { searchArticles } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] })
    }

    const articles = await searchArticles(query.trim(), limit)

    const results = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      featured_image: article.featured_image,
      category: article.category?.name || null,
      categorySlug: article.category?.slug || null,
      published_at: article.published_at,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Došlo je do greške prilikom pretraživanja.' },
      { status: 500 }
    )
  }
}
