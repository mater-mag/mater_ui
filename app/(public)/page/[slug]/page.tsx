import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/supabase/queries'
import { ArticleContent } from '@/components/ArticleContent'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    return { title: 'Stranica nije pronađena' }
  }

  return {
    title: page.seo_data?.meta_title || page.title,
    description: page.seo_data?.meta_description || undefined,
    openGraph: page.seo_data?.og_title ? {
      title: page.seo_data.og_title,
      description: page.seo_data.og_description || undefined,
      images: page.seo_data.og_image ? [page.seo_data.og_image] : undefined,
    } : undefined,
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="py-12 lg:py-16">
      <div className="container">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-center mb-12">
          {page.title}
        </h1>
        <div className="max-w-2xl mx-auto">
          <ArticleContent
            content={page.content}
            className="prose prose-gray max-w-none prose-headings:font-serif prose-a:text-coral prose-blockquote:border-coral prose-blockquote:text-coral prose-blockquote:italic"
          />
        </div>
      </div>
    </div>
  )
}
