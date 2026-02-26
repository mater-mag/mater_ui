'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { SearchModal } from './SearchModal'

interface Subcategory {
  name: string
  slug: string
}

interface Category {
  name: string
  slug: string
  featured?: boolean
  subcategories?: Subcategory[]
}

interface HeaderProps {
  categories?: Category[]
}

export function Header({ categories = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null)

  const menuOverlayRef = useRef<HTMLDivElement>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const menuBackdropRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // GSAP menu open animation
  const openMenu = useCallback(() => {
    const tl = gsap.timeline()

    if (menuOverlayRef.current) {
      gsap.set(menuOverlayRef.current, { display: 'block' })
    }

    tl.to(menuBackdropRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    })
    .to(menuPanelRef.current, {
      x: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.3')
    .fromTo(
      menuItemsRef.current?.querySelectorAll('.menu-item') || [],
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out'
      },
      '-=0.2'
    )

    document.body.style.overflow = 'hidden'
  }, [])

  // GSAP menu close animation
  const closeMenu = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (menuOverlayRef.current) {
          gsap.set(menuOverlayRef.current, { display: 'none' })
        }
        document.body.style.overflow = ''
      }
    })

    tl.to(menuItemsRef.current?.querySelectorAll('.menu-item') || [], {
      opacity: 0,
      x: 30,
      duration: 0.2,
      stagger: 0.02,
      ease: 'power2.in'
    })
    .to(menuPanelRef.current, {
      x: '100%',
      duration: 0.4,
      ease: 'power3.inOut'
    }, '-=0.1')
    .to(menuBackdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.3')
  }, [])

  // Handle menu state changes
  useEffect(() => {
    if (isMenuOpen) {
      openMenu()
    }
  }, [isMenuOpen, openMenu])

  const handleCloseMenu = () => {
    closeMenu()
    setTimeout(() => setIsMenuOpen(false), 500)
  }

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMenuOpen) handleCloseMenu()
        setOpenDropdown(null)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  // Dropdown animation
  useEffect(() => {
    dropdownRefs.current.forEach((dropdown, slug) => {
      if (openDropdown === slug) {
        gsap.fromTo(dropdown,
          { opacity: 0, y: -10, display: 'block' },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        )
      } else {
        gsap.to(dropdown, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => { gsap.set(dropdown, { display: 'none' }) }
        })
      }
    })
  }, [openDropdown])

  const toggleMobileAccordion = (slug: string) => {
    setOpenMobileAccordion(openMobileAccordion === slug ? null : slug)
  }

  // Accordion animation
  const accordionRef = useCallback((el: HTMLDivElement | null, slug: string, isOpen: boolean) => {
    if (el) {
      if (isOpen) {
        gsap.fromTo(el,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
        )
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        })
      }
    }
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-semibold tracking-[0.2em] text-foreground">
                MATER
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.map((category) => (
                <div
                  key={category.slug}
                  className="relative"
                  onMouseEnter={() => category.subcategories && setOpenDropdown(category.slug)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={`/${category.slug}`}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                      category.featured
                        ? 'text-coral hover:text-coral-dark'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {category.name.toUpperCase()}
                    {category.subcategories && (
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${
                          openDropdown === category.slug ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown */}
                  {category.subcategories && (
                    <div
                      ref={(el) => {
                        if (el) dropdownRefs.current.set(category.slug, el)
                      }}
                      className="absolute top-full left-0 pt-1 hidden opacity-0"
                    >
                      <div className="bg-background border border-border rounded-lg shadow-lg py-2 min-w-[160px]">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/${category.slug}?tag=${sub.slug}`}
                            className="block px-4 py-2 text-sm text-foreground/60 hover:bg-muted hover:text-foreground"
                          >
                            {sub.name}
                          </Link>
                        ))}
                        <Link
                          href={`/${category.slug}`}
                          className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border-t border-border mt-1 pt-2"
                        >
                          Pogledaj sve
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side - Search & Menu */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Pretraži"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2.5 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Otvori izbornik"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Menu */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 z-50 hidden"
      >
        {/* Backdrop */}
        <div
          ref={menuBackdropRef}
          className="absolute inset-0 bg-black/30 opacity-0"
          onClick={handleCloseMenu}
        />

        {/* Menu Panel */}
        <div
          ref={menuPanelRef}
          className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-dark-bg translate-x-full"
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 menu-item">
              <Link href="/" onClick={handleCloseMenu}>
                <span className="text-2xl font-semibold tracking-[0.2em] text-white">
                  M<span className="text-coral">.</span>
                </span>
              </Link>
              <button
                onClick={handleCloseMenu}
                className="p-2 text-white/70 hover:text-white"
                aria-label="Zatvori izbornik"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <div ref={menuItemsRef} className="flex-1 overflow-y-auto py-6 px-6">
              {/* Categories Section */}
              <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-4 menu-item">
                Kategorije
              </p>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <div key={category.slug} className="menu-item">
                    {category.subcategories ? (
                      <>
                        <button
                          onClick={() => toggleMobileAccordion(category.slug)}
                          className={`w-full flex items-center justify-between py-3 text-left font-medium ${
                            category.featured
                              ? 'text-coral'
                              : 'text-white'
                          }`}
                        >
                          {category.name.toUpperCase()}
                          <svg
                            className="w-4 h-4 accordion-arrow"
                            style={{
                              transform: openMobileAccordion === category.slug ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease'
                            }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div
                          ref={(el) => accordionRef(el, category.slug, openMobileAccordion === category.slug)}
                          className="pl-4 pb-2 space-y-1 overflow-hidden"
                          style={{ height: openMobileAccordion === category.slug ? 'auto' : 0, opacity: openMobileAccordion === category.slug ? 1 : 0 }}
                        >
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/${category.slug}?tag=${sub.slug}`}
                              onClick={handleCloseMenu}
                              className="block py-2 text-sm text-white/60 hover:text-white"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          <Link
                            href={`/${category.slug}`}
                            onClick={handleCloseMenu}
                            className="block py-2 text-sm text-white/60 hover:text-white"
                          >
                            Pogledaj sve
                          </Link>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={`/${category.slug}`}
                        onClick={handleCloseMenu}
                        className={`block py-3 font-medium ${
                          category.featured
                            ? 'text-coral'
                            : 'text-white'
                        }`}
                      >
                        {category.name.toUpperCase()}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-8 border-t border-white/10 menu-item" />

              {/* Static Links */}
              <nav className="space-y-1">
                <Link
                  href="/oglasavanje"
                  onClick={handleCloseMenu}
                  className="block py-3 text-white/70 hover:text-white menu-item"
                >
                  OGLAŠAVANJE
                </Link>
                <Link
                  href="/page/o-nama"
                  onClick={handleCloseMenu}
                  className="block py-3 text-white/70 hover:text-white menu-item"
                >
                  O NAMA
                </Link>
                <Link
                  href="/page/kontakt"
                  onClick={handleCloseMenu}
                  className="block py-3 text-white/70 hover:text-white menu-item"
                >
                  KONTAKT
                </Link>
              </nav>
            </div>

            {/* Menu Footer - Social Icons */}
            <div className="p-6 border-t border-white/10 menu-item">
              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
