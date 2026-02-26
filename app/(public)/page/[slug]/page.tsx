import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Page metadata
const pageMeta: Record<string, { title: string; description?: string }> = {
  'o-nama': {
    title: 'O nama',
    description: 'Saznajte više o Mater.mag portalu',
  },
  kontakt: {
    title: 'Kontakt',
    description: 'Kontaktirajte nas',
  },
  privatnost: {
    title: 'Pravila privatnosti',
    description: 'Pravila privatnosti Mater.mag portala',
  },
  'uvjeti-koristenja': {
    title: 'Opći uvjeti korištenja',
    description: 'Uvjeti korištenja Mater.mag portala',
  },
  kolacici: {
    title: 'Izjava o kolačićima',
    description: 'Informacije o kolačićima na Mater.mag portalu',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = pageMeta[slug]

  if (!page) {
    return { title: 'Stranica nije pronađena' }
  }

  return {
    title: page.title,
    description: page.description,
  }
}

// O nama page component
function ONamaPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="container">
        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-center mb-8">
          O nama
        </h1>

        {/* Intro Text */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-gray-600 leading-relaxed">
            Morem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
            molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla
            accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
            Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar.
            Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur
            vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam
            in elementum tellus.
          </p>
        </div>

        {/* Featured Image */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="aspect-[4/5] relative bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&h=1000&fit=crop"
              alt="O nama"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center max-w-2xl mx-auto mb-16">
          Morem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        {/* Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Lorem naslov</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Morem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
            molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla
            accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
            Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar.
            Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur
            vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam
            in elementum tellus.
          </p>

          {/* Blockquote */}
          <blockquote className="border-l-4 border-coral pl-6 my-8">
            <p className="text-coral text-lg italic leading-relaxed">
              Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
              libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
              sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              Curabitur tempus urna at turpis condimentum lobortis.
            </p>
          </blockquote>

          {/* Instagram Embed Placeholder */}
          <div className="my-12">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-md mx-auto">
              <div className="p-3 flex items-center gap-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div>
                  <p className="text-sm font-medium">kollamg_</p>
                  <p className="text-xs text-gray-500">Mater.magazine</p>
                </div>
                <button className="ml-auto text-xs text-coral font-medium px-3 py-1 border border-coral rounded">
                  Prati profil
                </button>
              </div>
              <div className="aspect-[4/5] relative bg-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=750&fit=crop"
                  alt="Instagram post"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-coral mb-2">Pogledaj više na Instagramu</p>
                <div className="flex items-center gap-4 text-gray-500">
                  <button className="hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <button className="hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button className="ml-auto hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Sviđa se 22 706</p>
                <p className="text-xs text-gray-400 mt-1">kollamgmg_</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Kontakt page component
function KontaktPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="container">
        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-center mb-6">
          Kontakt
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-4">
          Svoje upite i prijedloge šaljite na:
        </p>

        {/* Email */}
        <p className="text-center mb-16">
          <a
            href="mailto:info@matermag.hr"
            className="font-serif text-2xl md:text-3xl lg:text-4xl text-coral hover:text-coral-dark transition-colors"
          >
            info@matermag.hr
          </a>
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 max-w-4xl mx-auto mb-16"></div>

        {/* Business Info */}
        <div className="text-center">
          <h2 className="font-serif text-xl md:text-2xl mb-4">Success</h2>
          <p className="text-gray-600 mb-1">Obrt za web dizajn i promidžbu</p>
          <p className="text-gray-600 mb-4">
            vl. <span className="font-medium text-gray-900">Anja Žarković</span>
          </p>
          <p className="text-gray-500 text-sm">Ulica Crvenog Križa 27</p>
          <p className="text-gray-500 text-sm">10 000 Zagreb,</p>
          <p className="text-gray-500 text-sm">27760754986</p>
        </div>
      </div>
    </div>
  )
}

// Generic page component for legal pages
function GenericPage({ title, content }: { title: string; content: string }) {
  return (
    <div className="py-12 lg:py-16">
      <div className="container">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-center mb-12">
          {title}
        </h1>
        <div className="max-w-2xl mx-auto">
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  )
}

// Legal page content
const legalPages: Record<string, string> = {
  privatnost: `
    <p class="text-gray-600 leading-relaxed mb-6">Vaša privatnost nam je važna. Ova pravila privatnosti objašnjavaju kako prikupljamo, koristimo i štitimo vaše osobne podatke kada koristite naše usluge.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Prikupljanje podataka</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Prikupljamo samo podatke koji su nam potrebni za pružanje naših usluga, uključujući email adresu ako se pretplatite na naš newsletter.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Korištenje podataka</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Vaše podatke koristimo isključivo za komunikaciju s vama i poboljšanje naših usluga. Nikada nećemo prodati ili dijeliti vaše osobne podatke s trećim stranama bez vašeg pristanka.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Sigurnost</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Poduzimamo sve potrebne mjere kako bismo zaštitili vaše osobne podatke od neovlaštenog pristupa ili zlouporabe.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Vaša prava</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Imate pravo zatražiti pristup, ispravak ili brisanje svojih osobnih podataka u bilo kojem trenutku. Kontaktirajte nas na info@matermag.hr za sve upite vezane uz privatnost.</p>
  `,
  'uvjeti-koristenja': `
    <p class="text-gray-600 leading-relaxed mb-6">Korištenjem ove web stranice prihvaćate sljedeće uvjete korištenja. Molimo vas da ih pažljivo pročitate.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Autorska prava</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Sav sadržaj na ovoj stranici, uključujući tekstove, fotografije, grafike i logotipe, zaštićen je autorskim pravima. Nije dopušteno kopiranje, reprodukcija ili distribucija bez pisanog odobrenja.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Korištenje sadržaja</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Sadržaj na ovoj stranici pruža se samo u informativne svrhe. Ne preuzimamo odgovornost za odluke donesene na temelju informacija objavljenih na stranici.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Vanjske veze</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Naša stranica može sadržavati veze na druge web stranice. Ne preuzimamo odgovornost za sadržaj ili prakse privatnosti tih stranica.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Izmjene uvjeta</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Zadržavamo pravo izmjene ovih uvjeta korištenja u bilo kojem trenutku. Promjene stupaju na snagu odmah nakon objave na stranici.</p>
  `,
  kolacici: `
    <p class="text-gray-600 leading-relaxed mb-6">Ova web stranica koristi kolačiće kako bi vam pružila najbolje moguće korisničko iskustvo.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Što su kolačići?</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Kolačići su male tekstualne datoteke koje se pohranjuju na vašem uređaju kada posjetite web stranicu. Oni nam pomažu da zapamtimo vaše postavke i poboljšamo vašu interakciju sa stranicom.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Vrste kolačića</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Koristimo nužne kolačiće za osnovnu funkcionalnost stranice, analitičke kolačiće za razumijevanje kako koristite stranicu, te kolačiće za oglašavanje kako bismo vam prikazali relevantne oglase.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Upravljanje kolačićima</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Možete upravljati postavkama kolačića putem postavki vašeg preglednika. Imajte na umu da onemogućavanje kolačića može utjecati na funkcionalnost stranice.</p>

    <h2 class="font-serif text-2xl mb-4 mt-8">Kontakt</h2>
    <p class="text-gray-600 leading-relaxed mb-6">Za pitanja o kolačićima, kontaktirajte nas na info@matermag.hr.</p>
  `,
}

export default async function StaticPage({ params }: PageProps) {
  const { slug } = await params

  if (!pageMeta[slug]) {
    notFound()
  }

  // Render appropriate page based on slug
  if (slug === 'o-nama') {
    return <ONamaPage />
  }

  if (slug === 'kontakt') {
    return <KontaktPage />
  }

  // Legal pages
  if (legalPages[slug]) {
    return <GenericPage title={pageMeta[slug].title} content={legalPages[slug]} />
  }

  notFound()
}

export async function generateStaticParams() {
  return Object.keys(pageMeta).map((slug) => ({ slug }))
}
