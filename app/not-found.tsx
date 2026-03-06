import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Large 404 in MATER style */}
        <div className="mb-8">
          <h1 className="flex justify-center gap-2 md:gap-4">
            {'404'.split('').map((char, i) => (
              <span
                key={i}
                className="font-display font-normal text-coral leading-none"
                style={{ fontSize: 'clamp(80px, 20vw, 200px)' }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Message */}
        <div className="text-center max-w-lg mx-auto mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ups! Stranica nije pronađena
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed">
            Stranica koju tražite ne postoji ili je premještena.
            Možda ste pogrešno unijeli adresu ili je sadržaj uklonjen.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-coral hover:bg-coral-dark text-white text-sm font-medium rounded transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Povratak na naslovnicu
          </Link>
          <Link
            href="/pretraga"
            className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-foreground/20 hover:border-foreground/40 text-foreground text-sm font-medium rounded transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Pretraži sadržaj
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="mt-16 w-24 h-px bg-coral/30"></div>

        {/* Suggested sections */}
        <div className="mt-12 text-center">
          <p className="text-sm text-foreground/50 mb-6">Ili istražite naše kategorije:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Lifestyle', slug: 'lifestyle' },
              { name: 'Trudnoća', slug: 'trudnoća' },
              { name: 'Bebe i Djeca', slug: 'bebe-i-djeca' },
              { name: 'Zdravlje', slug: 'zdravlje-i-prehrana' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="px-4 py-2 text-sm text-foreground/70 hover:text-coral border border-foreground/10 hover:border-coral/30 rounded-full transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="pb-8 pt-4">
        <p className="text-center text-xs text-foreground/30 uppercase tracking-widest">
          Mater Magazine
        </p>
      </div>
    </main>
  )
}
