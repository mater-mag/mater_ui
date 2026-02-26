'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// Popular search tags
const popularTags = [
  'zdravaprehrana',
  'mastitis',
  'trudnoća',
  'bebe',
  'dojenje',
  'recepti',
  'lifestyle',
]

// Mock search results
interface SearchResult {
  id: string
  title: string
  slug: string
  category: string
  categorySlug: string
  image: string
}

const mockAllResults: SearchResult[] = [
  {
    id: '1',
    title: 'SIDS: Što je sindrom iznenadne dojenačke smrti i kako ga prevenirati?',
    slug: 'sids-sto-je-sindrom-iznenadne-dojenacke-smrti',
    category: 'Zdravlje',
    categorySlug: 'zdravlje',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Zašto djeca obožavaju Peppa Pig crtani film? Otkrivamo tajnu svjetskog fenomena',
    slug: 'zasto-djeca-obozavaju-peppa-pig',
    category: 'Djeca',
    categorySlug: 'djeca',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Putovanje s bebom: Kada je sigurno i kako se najbolje pripremiti?',
    slug: 'putovanje-s-bebom-kada-je-sigurno',
    category: 'Lifestyle',
    categorySlug: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Mastitis: Simptomi, uzroci i kako se liječiti kod kuće',
    slug: 'mastitis-simptomi-uzroci-lijecenje',
    category: 'Zdravlje',
    categorySlug: 'zdravlje',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'Kako prepoznati i liječiti mastitis tijekom dojenja',
    slug: 'kako-prepoznati-lijeciti-mastitis-dojenje',
    category: 'Zdravlje',
    categorySlug: 'zdravlje',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop',
  },
  {
    id: '6',
    title: 'Prevencija mastitisa: Savjeti za zdrave dojke',
    slug: 'prevencija-mastitisa-savjeti',
    category: 'Zdravlje',
    categorySlug: 'zdravlje',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop',
  },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryParam = searchParams.get('q') || ''

  const [query, setQuery] = useState(queryParam)
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(!!queryParam)

  // Search when query param changes
  useEffect(() => {
    if (queryParam) {
      const filtered = mockAllResults.filter(
        (article) =>
          article.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          article.category.toLowerCase().includes(queryParam.toLowerCase())
      )
      setResults(filtered)
      setHasSearched(true)
      setQuery(queryParam)
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
                href={`/${article.categorySlug}/${article.slug}`}
                className="group"
              >
                <div className="aspect-[3/2] relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">
                  {article.category}
                </p>
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
