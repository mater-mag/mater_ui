import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function addInterviews() {
  // Get the intervjui category ID
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'intervjui')
    .single()

  if (!category) {
    console.error('Intervjui category not found')
    return
  }

  // Get an author
  const { data: authors } = await supabase.from('authors').select('id, name').limit(3)
  if (!authors || authors.length === 0) {
    console.error('No authors found')
    return
  }

  const now = new Date()

  const interviews = [
    {
      title: 'Vikende provodim u prirodi s djecom i mužem',
      slug: 'vikende-provodim-u-prirodi-s-djecom-i-muzem',
      content: `<p>Razgovarali smo s poznatom hrvatskom influencericom i majkom troje djece o tome kako balansira posao i obiteljski život.</p>
<h2>Kako izgleda vaš tipičan dan?</h2>
<p>Ujutro se budim rano, obično oko 6 sati. Dok djeca još spavaju, imam sat vremena za sebe - kava, meditacija, planiranje dana. Zatim slijedi jutarnja rutina s djecom, doručak i odvoženje u školu i vrtić.</p>
<h2>Kako uspijevate uskladiti karijeru i majčinstvo?</h2>
<p>Iskreno, nije uvijek lako. Ključ je u organizaciji i postavljanju prioriteta. Naučila sam reći "ne" stvarima koje mi oduzimaju energiju, a ne donose vrijednost.</p>
<p>Vikendi su sveti - to je vrijeme za obitelj. Najčešće odlazimo u prirodu, na izlete ili jednostavno provodimo vrijeme zajedno kod kuće.</p>`,
      excerpt: 'Razgovor s poznatom influencericom o balansiranju karijere i majčinstva, vikend ritualima i važnosti vremena provedenog u prirodi s obitelji.',
      featured_image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200',
      category_id: category.id,
      author_id: authors[0].id,
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(),
      seo_data: {
        meta_title: 'Intervju: Vikende provodim u prirodi s djecom',
        meta_description: 'Ekskluzivni intervju o balansiranju karijere i majčinstva. Kako provoditi kvalitetno vrijeme s obitelji.',
        focus_keyphrase: 'intervju majčinstvo',
        schema_type: 'Article'
      }
    },
    {
      title: 'Zašto djeca obožavaju Peppa Pig crtani film? Otkrivamo tajnu svjetskog fenomena',
      slug: 'zasto-djeca-obozavaju-peppa-pig-crtani-film',
      content: `<p>Razgovarali smo s dječjim psihologom o fenomenu Peppa Pig i zašto ovaj crtić već godinama osvaja srca najmlađih.</p>
<h2>Što Peppa Pig čini posebnim?</h2>
<p>Jednostavnost je ključ. Kratke epizode, jasni likovi i situacije bliske djeci čine ovaj crtić savršenim za najmlađe gledatelje.</p>
<h2>Je li Peppa Pig edukativan?</h2>
<p>Apsolutno. Kroz jednostavne priče djeca uče o prijateljstvu, obitelji, rješavanju problema i emocijama. Likovi pokazuju kako se nositi s različitim situacijama na zdrav način.</p>`,
      excerpt: 'Dječji psiholog objašnjava zašto Peppa Pig već godinama osvaja srca najmlađih i što ovaj crtić čini tako posebnim.',
      featured_image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200',
      category_id: category.id,
      author_id: authors[1]?.id || authors[0].id,
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      seo_data: {
        meta_title: 'Zašto djeca obožavaju Peppa Pig? Intervju s psihologom',
        meta_description: 'Dječji psiholog otkriva tajnu popularnosti Peppa Pig crtanog filma i njegove edukativne vrijednosti.',
        focus_keyphrase: 'Peppa Pig djeca',
        schema_type: 'Article'
      }
    },
    {
      title: 'Putovanje s bebom: Kada je sigurno i kako se najbolje pripremiti?',
      slug: 'putovanje-s-bebom-kada-je-sigurno',
      content: `<p>Pedijatrica dr. Marina Kovačević dijeli savjete za sigurno putovanje s bebom.</p>
<h2>Kada je beba dovoljno stara za putovanje?</h2>
<p>Općenito, bebe mogu putovati već nakon prvog mjeseca života, ali preporučujem čekati do završetka primarnog cijepljenja, oko 2-3 mjeseca.</p>
<h2>Što sve ponijeti?</h2>
<p>Uvijek nosite više pelena i odjeće nego što mislite da vam treba. Lijekovi za temperaturu, kapi za nos i sredstvo za rehidraciju su obavezni.</p>`,
      excerpt: 'Pedijatrica dijeli savjete za sigurno putovanje s bebom - od idealne dobi do popisa neophodnih stvari.',
      featured_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200',
      category_id: category.id,
      author_id: authors[2]?.id || authors[0].id,
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      seo_data: {
        meta_title: 'Putovanje s bebom - Savjeti pedijatrice',
        meta_description: 'Kada je sigurno putovati s bebom i kako se pripremiti? Pedijatrica dijeli stručne savjete.',
        focus_keyphrase: 'putovanje s bebom',
        schema_type: 'Article'
      }
    },
    {
      title: 'Dječja odjeća Zara - Top 5 odjevnih kombinacija za mališane za jesen 2025.',
      slug: 'djecja-odjeca-zara-top-5-kombinacija-jesen',
      content: `<p>Pregledali smo novu Zara Kids kolekciju i izdvojili najbolje komade za nadolazeću sezonu.</p>
<h2>Trendovi za jesen</h2>
<p>Ove jeseni dominiraju zemljani tonovi, oversized siluete i udobni materijali. Zara Kids kolekcija savršeno prati ove trendove.</p>
<h2>Top 5 kombinacija</h2>
<p>Od ležernih kompletića za igraonicu do elegantnijih opcija za posebne prilike - izdvojili smo kombinacije koje će vaši mališani obožavati.</p>`,
      excerpt: 'Pregledali smo novu Zara Kids kolekciju i izdvojili top 5 odjevnih kombinacija za mališane za jesen 2025.',
      featured_image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200',
      category_id: category.id,
      author_id: authors[0].id,
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(),
      seo_data: {
        meta_title: 'Zara Kids jesen 2025 - Top 5 kombinacija',
        meta_description: 'Najbolji komadi iz nove Zara Kids kolekcije za jesen. Pregledajte top 5 kombinacija za mališane.',
        focus_keyphrase: 'Zara Kids jesen',
        schema_type: 'Article'
      }
    }
  ]

  const { data, error } = await supabase
    .from('articles')
    .upsert(interviews, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error adding interviews:', error)
  } else {
    console.log('Added interviews:', data?.length)
  }
}

addInterviews()
