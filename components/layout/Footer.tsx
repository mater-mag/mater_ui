'use client'

import Link from 'next/link'

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
            <p className="text-sm font-semibold uppercase tracking-wide mb-1">MATER MAG D.O.O.</p>
            <p className="text-sm text-foreground/60">Ul. Primjer 123</p>
            <p className="text-sm text-foreground/60">10000 Zagreb</p>
          </div>

          {/* Social + Newsletter */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://instagram.com"
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
                href="https://facebook.com"
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
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
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
                <Link href="/oglasavanje" className="text-sm uppercase tracking-wide hover:text-coral transition-colors">
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
                  href="/page/kolacici"
                  className="text-sm uppercase tracking-wide hover:text-coral transition-colors"
                >
                  KOLAČIĆI
                </Link>
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
                className="font-sans font-bold text-foreground leading-none"
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
