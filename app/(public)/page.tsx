import { getHomepageData } from '@/lib/supabase/homepage-queries'
import {
  AnimatedSection,
  ArticleSection,
  HeroBranding,
  HeroCarousel,
  IntervjuTjedna,
  LazyCategorySection,
  NewsletterSection
} from '@/components/homepage'

// ISR: Revalidate every hour
export const revalidate = 3600

export default async function HomePage() {
  const data = await getHomepageData()

  // Filter categories for dynamic sections (exclude 'intervjui')
  const dynamicCategories = data.categories.filter(
    (cat) => cat.slug !== 'intervjui'
  )

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <AnimatedSection>
        <HeroBranding />
        <HeroCarousel articles={data.heroArticles} />
      </AnimatedSection>

      {/* Novosti Section */}
      <AnimatedSection>
        <ArticleSection
          title="Novosti"
          articles={data.novostiArticles}
          showDivider={false}
        />
      </AnimatedSection>

      {/* Intervju Tjedna Section */}
      <AnimatedSection>
        <IntervjuTjedna
          featured={data.intervjuTjedna}
          grid={data.intervjuGrid}
        />
      </AnimatedSection>

      {/* Newsletter Section */}
      <AnimatedSection>
        <NewsletterSection />
      </AnimatedSection>

      {/* Popularno Section */}
      <AnimatedSection>
        <ArticleSection
          title="Popularno"
          articles={data.popularnoArticles}
          showDivider={true}
        />
      </AnimatedSection>

      {/* Dynamic Category Sections - Lazy Loaded */}
      {dynamicCategories.map((category) => (
        <LazyCategorySection
          key={category.id}
          category={category}
          articlesPerSection={6}
        />
      ))}
    </main>
  )
}
