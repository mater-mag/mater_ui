'use client'

import { useState } from 'react'
import { Input } from '@/components/ui'

export default function SettingsPage() {
  const [siteTitle, setSiteTitle] = useState('Matermag.hr')
  const [siteDescription, setSiteDescription] = useState('Lifestyle portal za moderne roditelje')
  const [defaultOgImage, setDefaultOgImage] = useState('')
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('')
  const [robotsTxt, setRobotsTxt] = useState(`User-agent: *
Allow: /

Sitemap: https://matermag.hr/sitemap.xml`)

  const handleSave = () => {
    // TODO: Save to Supabase
    alert('Postavke spremljene!')
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
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          Spremi postavke
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
          <div className="space-y-4">
            <Input
              label="Facebook URL"
              placeholder="https://facebook.com/matermag"
            />
            <Input
              label="Instagram URL"
              placeholder="https://instagram.com/matermag"
            />
            <Input
              label="Twitter/X URL"
              placeholder="https://twitter.com/matermag"
            />
          </div>
        </section>
      </div>
    </div>
  )
}
