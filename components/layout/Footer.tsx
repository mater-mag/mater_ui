'use client'

import Link from 'next/link'
import { openCookieSettings } from '@/components/cookies'

interface Category {
  name: string
  slug: string
  featured?: boolean
  subcategories?: { name: string; slug: string }[]
}

interface FooterProps {
  categories?: Category[]
}

export function Footer({ categories = [] }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const parentCategories = categories.filter(c => !c.slug.includes('-'))

  return (
    <footer className="bg-background text-foreground">
      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-wide mb-1">S&P OGLAŠAVANJE d.o.o.</p>
            <p className="text-sm text-foreground/60">Ulica Ljudevita Posavskog 36B</p>
            <p className="text-sm text-foreground/60">Zagreb</p>
          </div>

          {/* Social + Newsletter */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://www.instagram.com/matermag.hr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1CRhZw4vrd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/matermag/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <Link
              href="/newsletter"
              className="inline-block px-4 py-2 border border-foreground text-sm font-medium uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
            >
              Newsletter
            </Link>
          </div>

          {/* Mater Mag Links */}
          <div>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="text-sm italic hover:text-coral transition-colors">
                  Mater Home
                </Link>
              </li>
              <li>
                <Link href="/page/o-nama" className="text-sm uppercase tracking-wide hover:text-coral transition-colors">
                  O NAMA
                </Link>
              </li>
              <li>
                <Link href="/page/oglasavanje" className="text-sm uppercase tracking-wide hover:text-coral transition-colors">
                  OGLAŠAVANJE
                </Link>
              </li>
              <li>
                <Link href="/page/kontakt" className="text-sm uppercase tracking-wide hover:text-coral transition-colors">
                  KONTAKT
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <ul className="space-y-1.5">
              {parentCategories.length > 0 ? (
                parentCategories.slice(0, 5).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${category.slug}`}
                      className="text-sm uppercase tracking-wide hover:text-coral transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/vijesti" className="text-sm uppercase tracking-wide hover:text-coral transition-colors">
                      VIJESTI
                    </Link>
                  </li>
                  <li>
                    <Link href="/lifestyle" className="text-sm uppercase tracking-wide hover:text-coral transition-colors">
                      LIFESTYLE
                    </Link>
                  </li>
                  <li>
                    <Link href="/zdravlje" className="text-sm uppercase tracking-wide hover:text-coral transition-colors">
                      ZDRAVLJE
                    </Link>
                  </li>
                  <li>
                    <Link href="/recepti" className="text-sm uppercase tracking-wide hover:text-coral transition-colors">
                      RECEPTI
                    </Link>
                  </li>
                  <li>
                    <Link href="/djeca" className="text-sm uppercase tracking-wide hover:text-coral transition-colors">
                      DJECA
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/page/politika-privatnosti"
                  className="text-sm uppercase tracking-wide hover:text-coral transition-colors"
                >
                  POLITIKA PRIVATNOSTI
                </Link>
              </li>
              <li>
                <Link
                  href="/page/uvjeti-koristenja"
                  className="text-sm uppercase tracking-wide hover:text-coral transition-colors"
                >
                  UVJETI KORIŠTENJA
                </Link>
              </li>
              <li>
                <Link
                  href="/page/politika-kolacica"
                  className="text-sm uppercase tracking-wide hover:text-coral transition-colors"
                >
                  KOLAČIĆI
                </Link>
              </li>
              <li>
                <button
                  onClick={openCookieSettings}
                  className="text-sm uppercase tracking-wide hover:text-coral transition-colors"
                >
                  POSTAVKE KOLAČIĆA
                </button>
              </li>
            </ul>
          </div>

          {/* Scroll to Top */}
          <div className="flex justify-end">
            <button
              onClick={scrollToTop}
              className="text-sm uppercase tracking-wide hover:text-coral transition-colors flex items-center gap-1"
            >
              NA VRH
              <span className="inline-flex items-center justify-center">
                [ <svg className="w-3 h-3 mx-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg> ]
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Large MATER Branding */}
      <div className="container relative pb-4 overflow-hidden">
        <div className="flex justify-between items-end">
          {/* Large MATER text */}
          <h2 className="flex justify-between w-full">
            {'MATER'.split('').map((letter, i) => (
              <span
                key={i}
                className="font-display font-normal text-foreground leading-none"
                style={{ fontSize: 'clamp(80px, 20vw, 280px)' }}
              >
                {letter}
              </span>
            ))}
          </h2>
          {/* Copyright - rotated */}
          <div
            className="absolute right-4 bottom-4 origin-bottom-right"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            <p className="text-xs text-foreground/40 tracking-wider">
              &copy;{new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
