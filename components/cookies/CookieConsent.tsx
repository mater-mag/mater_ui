'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export interface CookiePreferences {
  essential: boolean // Always true, cannot be disabled
  analytics: boolean // Google Analytics
  marketing: boolean // Google Ads, Meta Pixel
}

const COOKIE_CONSENT_KEY = 'mater_cookie_consent'
const COOKIE_PREFERENCES_KEY = 'mater_cookie_preferences'

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  // Check if consent was already given
  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Small delay to avoid flash on page load
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    } else {
      // Load saved preferences and activate scripts
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences) as CookiePreferences
        setPreferences(parsed)
        activateScripts(parsed)
      }
    }
  }, [])

  const activateScripts = (prefs: CookiePreferences) => {
    // Dispatch custom event so other components can react
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: prefs }))
  }

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    activateScripts(prefs)
    setIsVisible(false)
  }

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
    })
  }

  const handleRejectAll = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
    })
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return // Cannot disable essential
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-coral/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base">Koristimo kolačiće</h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Koristimo kolačiće kako bismo poboljšali vaše iskustvo na našoj stranici, analizirali promet i prikazali relevantne oglase.
              </p>
            </div>
          </div>
        </div>

        {/* Cookie Details (expandable) */}
        {showDetails && (
          <div className="px-5 pb-4 border-t border-gray-100 pt-4 space-y-3">
            {/* Essential */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Nužni kolačići</p>
                <p className="text-xs text-gray-500">Potrebni za rad stranice</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="sr-only"
                />
                <div className="w-10 h-6 bg-coral rounded-full opacity-50 cursor-not-allowed">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Analitički kolačići</p>
                <p className="text-xs text-gray-500">Google Analytics - analiza prometa</p>
              </div>
              <button
                onClick={() => togglePreference('analytics')}
                className="relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
                style={{ backgroundColor: preferences.analytics ? '#E85A4F' : '#D1D5DB' }}
              >
                <span
                  className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                  style={{ left: preferences.analytics ? '1.25rem' : '0.25rem' }}
                />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Marketinški kolačići</p>
                <p className="text-xs text-gray-500">Google Ads, Meta Pixel - personalizirani oglasi</p>
              </div>
              <button
                onClick={() => togglePreference('marketing')}
                className="relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
                style={{ backgroundColor: preferences.marketing ? '#E85A4F' : '#D1D5DB' }}
              >
                <span
                  className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                  style={{ left: preferences.marketing ? '1.25rem' : '0.25rem' }}
                />
              </button>
            </div>

            <p className="text-xs text-gray-500 pt-2">
              Više informacija u našoj{' '}
              <Link href="/page/politika-privatnosti" className="text-coral hover:underline">
                Politici privatnosti
              </Link>{' '}
              i{' '}
              <Link href="/page/kolacici" className="text-coral hover:underline">
                Politici kolačića
              </Link>
              .
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          {!showDetails ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Odbij sve
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-coral rounded-lg hover:bg-coral-dark transition-colors"
                >
                  Prihvati sve
                </button>
              </div>
              <button
                onClick={() => setShowDetails(true)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Prilagodi postavke
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Natrag
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-coral rounded-lg hover:bg-coral-dark transition-colors"
              >
                Spremi postavke
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook to check cookie consent status
export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)

  useEffect(() => {
    const loadPreferences = () => {
      const saved = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (saved) {
        setPreferences(JSON.parse(saved))
      }
    }

    loadPreferences()

    // Listen for consent changes
    const handleConsentChange = (e: CustomEvent<CookiePreferences>) => {
      setPreferences(e.detail)
    }

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener)
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener)
    }
  }, [])

  return preferences
}

// Function to open cookie settings (for footer link)
export function openCookieSettings() {
  localStorage.removeItem(COOKIE_CONSENT_KEY)
  window.location.reload()
}
