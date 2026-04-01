'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const popularTags = [
  'zdravaprehrana',
  'mastitis',
  'trudnoća',
  'bebe',
  'dojenje',
  'recepti',
  'lifestyle',
]

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  category: string | null
  categorySlug: string | null
  published_at: string | null
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryParam = searchParams.get('q') || ''

  const [query, setQuery] = useState(queryParam)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(!!queryParam)

  // Search when query param changes
  useEffect(() => {
    if (queryParam) {
      setIsLoading(true)
      setQuery(queryParam)

      fetch(`/api/search?q=${encodeURIComponent(queryParam)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || [])
          setHasSearched(true)
        })
        .catch((error) => {
          console.error('Search error:', error)
          setResults([])
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [queryParam])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/pretraga?q=${encodeURIComponent(query.trim())}`)
  }

  const handleTagClick = (tag: string) => {
    router.push(`/pretraga?q=${encodeURIComponent(tag)}`)
  }

  const clearResults = () => {
    router.push('/pretraga')
    setQuery('')
    setResults([])
    setHasSearched(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="py-16 lg:py-24">
        <div className="container">
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-pulse text-gray-400">Pretraživanje...</div>
          </div>
        </div>
      </div>
    )
  }

  // Results view
  if (hasSearched && results.length > 0) {
    return (
      <div className="py-8">
        <div className="container">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              {results.length} rezultata za <span className="font-semibold text-gray-900">{queryParam}</span>
            </p>
            <button
              onClick={clearResults}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Očisti rezultate
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((article) => (
              <Link
                key={article.id}
                href={article.categorySlug ? `/${article.categorySlug}/${article.slug}` : `/${article.slug}`}
                className="group"
              >
                <div className="aspect-[3/2] relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {article.featured_image ? (
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                {article.category && (
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">
                    {article.category}
                  </p>
                )}
                <h3 className="font-serif text-lg leading-snug group-hover:text-coral transition-colors">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mt-12"></div>
        </div>
      </div>
    )
  }

  // Empty state view
  if (hasSearched && results.length === 0) {
    return (
      <div className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            {/* Empty State Illustration */}
            <div className="mb-8">
              <svg className="w-48 h-48 mx-auto text-gray-300" viewBox="0 0 200 200" fill="none">
                {/* Cloud */}
                <ellipse cx="100" cy="80" rx="60" ry="40" fill="currentColor" opacity="0.3" />
                <ellipse cx="70" cy="90" rx="40" ry="30" fill="currentColor" opacity="0.3" />
                <ellipse cx="130" cy="90" rx="40" ry="30" fill="currentColor" opacity="0.3" />
                {/* Dots on cloud */}
                <circle cx="90" cy="70" r="4" fill="currentColor" opacity="0.5" />
                <circle cx="100" cy="70" r="4" fill="currentColor" opacity="0.5" />
                <circle cx="110" cy="70" r="4" fill="currentColor" opacity="0.5" />
                {/* Magnifying glass */}
                <circle cx="100" cy="110" r="35" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.6" />
                <line x1="125" y1="135" x2="155" y2="165" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
              </svg>
            </div>

            {/* Message */}
            <h1 className="font-serif text-2xl md:text-3xl mb-4">Nema rezultata</h1>
            <p className="text-gray-500 mb-8">
              Nažalost nema rezultata za pretraživanje &quot;{queryParam}&quot;.
              <br />
              Molimo provjerite pravopis ili pretražite drugi pojam
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Unesite pojam..."
                    className="w-full py-3 border-b-2 border-gray-200 focus:border-coral outline-none text-lg placeholder:text-gray-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-dark-bg text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Pretraži
                </button>
              </div>
            </form>

            {/* Popular Tags */}
            <div>
              <p className="font-semibold text-sm mb-4">Popularne teme</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Initial search view (no query)
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Unesite pojam..."
                  autoFocus
                  className="w-full py-3 border-b-2 border-gray-200 focus:border-coral outline-none text-lg placeholder:text-gray-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-dark-bg text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Pretraži
              </button>
            </div>
          </form>

          {/* Popular Tags */}
          <div className="text-left">
            <p className="font-semibold text-sm mb-4">Popularne teme</p>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    index === 1
                      ? 'bg-dark-bg text-white hover:bg-gray-800'
                      : 'border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Učitavanje...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
