'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui'
import type { SEOSettings } from '@/types/database'

export default function SettingsPage() {
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [siteTitle, setSiteTitle] = useState('Matermag.hr')
  const [siteDescription, setSiteDescription] = useState('Lifestyle portal za moderne roditelje')
  const [defaultOgImage, setDefaultOgImage] = useState('')
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('')
  const [robotsTxt, setRobotsTxt] = useState(`User-agent: *
Allow: /

Sitemap: https://matermag.hr/sitemap.xml`)

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .single<SEOSettings>()

      if (!error && data) {
        setSettingsId(data.id)
        setSiteTitle(data.site_title || 'Matermag.hr')
        setSiteDescription(data.site_description || '')
        setDefaultOgImage(data.default_og_image || '')
        setGoogleAnalyticsId(data.google_analytics_id || '')
        setRobotsTxt(data.robots_txt || `User-agent: *
Allow: /

Sitemap: https://matermag.hr/sitemap.xml`)
      }
      setIsLoading(false)
    }

    fetchSettings()
  }, [supabase])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      if (settingsId) {
        // Update existing settings
        const { error } = await supabase
          .from('seo_settings')
          .update({
            site_title: siteTitle,
            site_description: siteDescription,
            default_og_image: defaultOgImage || null,
            google_analytics_id: googleAnalyticsId || null,
            robots_txt: robotsTxt || null,
          })
          .eq('id', settingsId)

        if (error) throw error
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('seo_settings')
          .insert({
            site_title: siteTitle,
            site_description: siteDescription,
            default_og_image: defaultOgImage || null,
            google_analytics_id: googleAnalyticsId || null,
            robots_txt: robotsTxt || null,
          })
          .select()
          .single<SEOSettings>()

        if (error) throw error
        if (data) setSettingsId(data.id)
      }

      alert('Postavke spremljene!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Greška pri spremanju postavki')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-green-dark)]"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Postavke</h1>
          <p className="mt-1 text-sm text-gray-500">Konfigurirajte postavke portala</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Spremanje...' : 'Spremi postavke'}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* General Settings */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Opće postavke</h2>
          <div className="space-y-4">
            <Input
              label="Naziv stranice"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="Matermag.hr"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Opis stranice
              </label>
              <textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="Kratak opis vaše stranice"
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)] min-h-[80px]"
              />
            </div>
          </div>
        </section>

        {/* SEO Settings */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">SEO postavke</h2>
          <div className="space-y-4">
            <Input
              label="Zadana OG slika URL"
              value={defaultOgImage}
              onChange={(e) => setDefaultOgImage(e.target.value)}
              placeholder="https://matermag.hr/og-image.jpg"
            />
            <Input
              label="Google Analytics ID"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                robots.txt
              </label>
              <textarea
                value={robotsTxt}
                onChange={(e) => setRobotsTxt(e.target.value)}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)] min-h-[150px]"
              />
            </div>
          </div>
        </section>

        {/* Social Media Settings */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Društvene mreže</h2>
          <p className="text-sm text-gray-500 mb-4">Linkovi na društvene mreže se konfiguriraju u Footer komponenti.</p>
          <div className="space-y-4">
            <Input
              label="Facebook URL"
              placeholder="https://facebook.com/matermag"
              disabled
            />
            <Input
              label="Instagram URL"
              placeholder="https://instagram.com/matermag"
              disabled
            />
            <Input
              label="Twitter/X URL"
              placeholder="https://twitter.com/matermag"
              disabled
            />
          </div>
        </section>
      </div>
    </div>
  )
}
