'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui'
import type { SEOData } from '@/types/database'

interface SEOEditorProps {
  data: SEOData
  onChange: (data: SEOData) => void
  title?: string
  content?: string
}

export function SEOEditor({ data, onChange, title = '', content = '' }: SEOEditorProps) {
  const [activeTab, setActiveTab] = useState<'seo' | 'social' | 'advanced'>('seo')

  const META_TITLE_MAX = 60
  const META_DESC_MAX = 160

  // Calculate readability score (simplified Flesch-Kincaid)
  const calculateReadability = (text: string): number => {
    const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1
    const words = text.split(/\s+/).filter(Boolean).length || 1
    const syllables = text.split(/[aeiouAEIOU]/).length || 1

    // Simplified score (0-100, higher is easier)
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    return Math.min(100, Math.max(0, score))
  }

  // Check focus keyphrase presence
  const checkKeyphrase = (): { inTitle: boolean; inContent: boolean; inMeta: boolean } => {
    const keyphrase = data.focus_keyphrase?.toLowerCase() || ''
    if (!keyphrase) return { inTitle: false, inContent: false, inMeta: false }

    return {
      inTitle: title.toLowerCase().includes(keyphrase),
      inContent: content.toLowerCase().includes(keyphrase),
      inMeta: data.meta_description?.toLowerCase().includes(keyphrase) || false,
    }
  }

  const keyphraseCheck = checkKeyphrase()
  const readabilityScore = calculateReadability(content)

  const getReadabilityLabel = (score: number): { label: string; color: string } => {
    if (score >= 70) return { label: 'Lako čitljivo', color: 'text-green-600' }
    if (score >= 50) return { label: 'Srednje teško', color: 'text-yellow-600' }
    return { label: 'Teško čitljivo', color: 'text-red-600' }
  }

  const readability = getReadabilityLabel(readabilityScore)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'seo'
              ? 'bg-background text-foreground border-b-2 border-accent'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          SEO
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'social'
              ? 'bg-background text-foreground border-b-2 border-accent'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Društvene mreže
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'advanced'
              ? 'bg-background text-foreground border-b-2 border-accent'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Napredno
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'seo' && (
          <>
            {/* Focus Keyphrase */}
            <div>
              <Input
                label="Ključna riječ"
                value={data.focus_keyphrase || ''}
                onChange={(e) => onChange({ ...data, focus_keyphrase: e.target.value })}
                placeholder="Unesite glavnu ključnu riječ"
              />
              {data.focus_keyphrase && (
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={keyphraseCheck.inTitle ? 'text-green-600' : 'text-red-600'}>
                      {keyphraseCheck.inTitle ? '✓' : '✗'}
                    </span>
                    <span>Ključna riječ u naslovu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={keyphraseCheck.inMeta ? 'text-green-600' : 'text-red-600'}>
                      {keyphraseCheck.inMeta ? '✓' : '✗'}
                    </span>
                    <span>Ključna riječ u meta opisu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={keyphraseCheck.inContent ? 'text-green-600' : 'text-red-600'}>
                      {keyphraseCheck.inContent ? '✓' : '✗'}
                    </span>
                    <span>Ključna riječ u sadržaju</span>
                  </div>
                </div>
              )}
            </div>

            {/* Meta Title */}
            <div>
              <Input
                label="Meta naslov"
                value={data.meta_title || ''}
                onChange={(e) => onChange({ ...data, meta_title: e.target.value })}
                placeholder={title || 'Unesite meta naslov'}
              />
              <div className="flex justify-between mt-1 text-sm">
                <span className="text-muted-foreground">
                  Preporučeno: do {META_TITLE_MAX} znakova
                </span>
                <span
                  className={
                    (data.meta_title?.length || 0) > META_TITLE_MAX
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                  }
                >
                  {data.meta_title?.length || 0} / {META_TITLE_MAX}
                </span>
              </div>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Meta opis
              </label>
              <textarea
                value={data.meta_description || ''}
                onChange={(e) => onChange({ ...data, meta_description: e.target.value })}
                placeholder="Unesite meta opis"
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[80px]"
              />
              <div className="flex justify-between mt-1 text-sm">
                <span className="text-muted-foreground">
                  Preporučeno: do {META_DESC_MAX} znakova
                </span>
                <span
                  className={
                    (data.meta_description?.length || 0) > META_DESC_MAX
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                  }
                >
                  {data.meta_description?.length || 0} / {META_DESC_MAX}
                </span>
              </div>
            </div>

            {/* Search Preview */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Pregled u pretraživaču
              </label>
              <div className="p-4 bg-white border border-border rounded-lg">
                <div className="text-blue-600 text-lg truncate">
                  {data.meta_title || title || 'Naslov stranice'}
                </div>
                <div className="text-green-700 text-sm">
                  matermag.hr › članak
                </div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {data.meta_description || 'Unesite meta opis za prikaz u rezultatima pretraživanja.'}
                </div>
              </div>
            </div>

            {/* Readability Score */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Čitljivost sadržaja</span>
                <span className={`font-medium ${readability.color}`}>
                  {readability.label} ({Math.round(readabilityScore)}/100)
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    readabilityScore >= 70
                      ? 'bg-green-500'
                      : readabilityScore >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${readabilityScore}%` }}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'social' && (
          <>
            {/* Open Graph */}
            <div className="space-y-4">
              <h3 className="font-medium">Open Graph (Facebook, LinkedIn)</h3>
              <Input
                label="OG naslov"
                value={data.og_title || ''}
                onChange={(e) => onChange({ ...data, og_title: e.target.value })}
                placeholder={data.meta_title || title || 'Naslov za dijeljenje'}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  OG opis
                </label>
                <textarea
                  value={data.og_description || ''}
                  onChange={(e) => onChange({ ...data, og_description: e.target.value })}
                  placeholder={data.meta_description || 'Opis za dijeljenje'}
                  className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[80px]"
                />
              </div>
              <Input
                label="OG slika URL"
                value={data.og_image || ''}
                onChange={(e) => onChange({ ...data, og_image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {/* Twitter */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-medium">Twitter Card</h3>
              <Input
                label="Twitter naslov"
                value={data.twitter_title || ''}
                onChange={(e) => onChange({ ...data, twitter_title: e.target.value })}
                placeholder={data.og_title || data.meta_title || title || 'Naslov za Twitter'}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Twitter opis
                </label>
                <textarea
                  value={data.twitter_description || ''}
                  onChange={(e) => onChange({ ...data, twitter_description: e.target.value })}
                  placeholder={data.og_description || data.meta_description || 'Opis za Twitter'}
                  className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[80px]"
                />
              </div>
              <Input
                label="Twitter slika URL"
                value={data.twitter_image || ''}
                onChange={(e) => onChange({ ...data, twitter_image: e.target.value })}
                placeholder={data.og_image || 'https://...'}
              />
            </div>
          </>
        )}

        {activeTab === 'advanced' && (
          <>
            <Input
              label="Kanonski URL"
              value={data.canonical_url || ''}
              onChange={(e) => onChange({ ...data, canonical_url: e.target.value })}
              placeholder="https://matermag.hr/..."
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Schema.org tip
              </label>
              <select
                value={data.schema_type || 'Article'}
                onChange={(e) =>
                  onChange({ ...data, schema_type: e.target.value as SEOData['schema_type'] })
                }
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <option value="Article">Article</option>
                <option value="NewsArticle">NewsArticle</option>
                <option value="BlogPosting">BlogPosting</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.no_index || false}
                  onChange={(e) => onChange({ ...data, no_index: e.target.checked })}
                  className="rounded border-border"
                />
                <span className="text-sm">Ne indeksiraj (noindex)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.no_follow || false}
                  onChange={(e) => onChange({ ...data, no_follow: e.target.checked })}
                  className="rounded border-border"
                />
                <span className="text-sm">Ne prati linkove (nofollow)</span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
