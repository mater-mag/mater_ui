'use client'

import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Hvala na prijavi!')
    setEmail('')
  }

  return (
    <section className="bg-coral-light py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="animate-in">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
              Ostanite u korak s <em className="text-coral">trendovima</em>
            </h2>
            <p className="text-foreground/60 text-sm">
              Prijavite se na naš newsletter
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full md:w-auto gap-3 animate-in">
            <div className="w-full sm:w-64">
              <div className="flex items-center bg-white border border-foreground/10 rounded px-4 py-3">
                <svg className="w-4 h-4 text-foreground/40 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Vaš email"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 bg-foreground text-white text-sm font-medium rounded hover:bg-black whitespace-nowrap transition-colors"
            >
              Prijavi se
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
