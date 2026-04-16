import { getHomepageData } from '@/lib/supabase/homepage-queries'
import {
  AnimatedSection,
  ArticleSection,
  HeroBranding,
  HeroCarousel,
  IntervjuTjedna,
  LazyCategorySection,
  NewsletterSection,
  PopularnoSlider
} from '@/components/homepage'

// ISR: Revalidate every hour
export const revalidate = 3600

export default async function HomePage() {
  const data = await getHomepageData()

  // Filter categories for dynamic sections (exclude 'intervjui')
  // Custom order: savjeti-stručnjaka before bebe-i-djeca
  const categoryOrder = ['savjeti-stručnjaka', 'bebe-i-djeca']
  const dynamicCategories = data.categories
    .filter((cat) => cat.slug !== 'intervjui')
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.slug)
      const bIndex = categoryOrder.indexOf(b.slug)
      // If both are in the order list, sort by that order
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      // If only a is in the list, it comes first
      if (aIndex !== -1) return -1
      // If only b is in the list, it comes first
      if (bIndex !== -1) return 1
      // Otherwise keep alphabetical order
      return a.name.localeCompare(b.name)
    })

  return (
    <main className="bg-background pb-16 md:pb-24">
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
        <PopularnoSlider
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
