'use client'

import { useNewsletter } from '@/hooks/useNewsletter'
import Link from 'next/link'

export default function NewsletterPage() {
  const { email, setEmail, status, message, subscribe } = useNewsletter()

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 lg:py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-coral-light rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Prijavite se na <em className="text-coral">newsletter</em>
          </h1>
          <p className="text-foreground/60 text-lg mb-8 max-w-lg mx-auto">
            Budite prvi koji saznaju najnovije vijesti, savjete i inspiraciju za moderne mame.
          </p>

          {/* Form */}
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 font-medium text-lg">{message}</p>
              <p className="text-green-600 text-sm mt-2">
                Uskoro ćete primiti potvrdu na svoju email adresu.
              </p>
            </div>
          ) : (
            <form onSubmit={subscribe} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Vaša email adresa"
                    className="w-full px-5 py-4 border border-foreground/20 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-coral transition-colors"
                    required
                    disabled={status === 'loading'}
                  />
                  {status === 'error' && (
                    <p className="text-red-500 text-sm mt-2 text-left">{message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 bg-coral text-white font-medium rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {status === 'loading' ? 'Prijava...' : 'Prijavi se'}
                </button>
              </div>
            </form>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-coral-light rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Ekskluzivni sadržaj</p>
                <p className="text-xs text-foreground/60">Savjeti samo za pretplatnike</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-coral-light rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Bez spama</p>
                <p className="text-xs text-foreground/60">Samo vrijedne informacije</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-coral-light rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Odjava bilo kada</p>
                <p className="text-xs text-foreground/60">Jednostavno u svakom emailu</p>
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <p className="text-xs text-foreground/40 mt-8">
            Prijavom prihvaćate našu{' '}
            <Link href="/page/politika-privatnosti" className="underline hover:text-foreground/60">
              politiku privatnosti
            </Link>
            . Vaši podaci su sigurni kod nas.
          </p>
        </div>
      </div>
    </div>
  )
}
