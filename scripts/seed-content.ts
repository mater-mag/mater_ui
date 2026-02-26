import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedContent() {
  console.log('Starting content seeding...')

  // 1. Get existing categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')

  if (catError) {
    console.error('Error fetching categories:', catError)
    return
  }

  console.log('Existing categories:', categories?.map(c => c.name))

  // 2. Create authors
  const authors = [
    {
      name: 'Ana Horvat',
      bio: 'Novinarka i majka dvoje djece. Piše o roditeljstvu, zdravlju i svakodnevnim izazovima modernih mama.',
      avatar: null,
      social_links: { instagram: '@ana.horvat', facebook: 'ana.horvat.writer' }
    },
    {
      name: 'Marija Kovač',
      bio: 'Nutricionistica i blogerica. Specijalizirana za zdrave recepte i prehranu za cijelu obitelj.',
      avatar: null,
      social_links: { instagram: '@marija.zdravo', website: 'https://zdravihrana.hr' }
    },
    {
      name: 'Ivana Babić',
      bio: 'Lifestyle novinarka s dugogodišnjim iskustvom. Prati najnovije trendove u modi, ljepoti i uređenju doma.',
      avatar: null,
      social_links: { instagram: '@ivana.lifestyle' }
    }
  ]

  // Check if authors already exist
  const { data: existingAuthors } = await supabase.from('authors').select('name')
  const existingNames = new Set(existingAuthors?.map(a => a.name))
  const newAuthors = authors.filter(a => !existingNames.has(a.name))

  if (newAuthors.length > 0) {
    const { data: createdAuthors, error: authorError } = await supabase
      .from('authors')
      .insert(newAuthors)
      .select()

    if (authorError) {
      console.error('Error creating authors:', authorError)
    } else {
      console.log('Created authors:', createdAuthors?.length)
    }
  } else {
    console.log('Authors already exist, skipping')
  }

  // Get author IDs
  const { data: allAuthors } = await supabase.from('authors').select('*')
  const authorMap = new Map(allAuthors?.map(a => [a.name, a.id]))

  // Get category IDs
  const categoryMap = new Map(categories?.map(c => [c.slug, c.id]))

  // 3. Create sample articles
  const now = new Date()
  const articles = [
    // Vijesti
    {
      title: 'Novi zakon o rodiljnim naknadama stupa na snagu',
      slug: 'novi-zakon-o-rodiljnim-naknadama-stupa-na-snagu',
      content: `<p>Od prvog dana sljedećeg mjeseca stupa na snagu novi zakon koji donosi značajne promjene u sustavu rodiljnih naknada.</p>
<h2>Glavne promjene</h2>
<p>Nove izmjene zakona predviđaju povećanje minimalnih naknada za 15%, što će posebno pomoći obiteljima s nižim primanjima. Također, produljuje se razdoblje u kojem roditelji mogu koristiti rodiljni dopust.</p>
<p>Stručnjaci ocjenjuju ove promjene kao pozitivan korak prema boljoj podršci obiteljima.</p>
<h2>Kako se prijaviti?</h2>
<p>Sve informacije o novom sustavu možete pronaći na službenim stranicama HZZO-a. Preporučujemo da provjerite svoje pravo na naknade što prije.</p>`,
      excerpt: 'Novi zakon donosi povećanje naknada za 15% i produljenje rodiljnog dopusta. Saznajte što to znači za vas.',
      featured_image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=1200',
      category_id: categoryMap.get('vijesti'),
      author_id: authorMap.get('Ana Horvat'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      seo_data: {
        meta_title: 'Novi zakon o rodiljnim naknadama 2024 - Sve što trebate znati',
        meta_description: 'Saznajte sve o novom zakonu o rodiljnim naknadama koji stupa na snagu. Povećanje naknada, produljenje dopusta i kako se prijaviti.',
        focus_keyphrase: 'rodiljne naknade',
        schema_type: 'NewsArticle'
      }
    },
    {
      title: 'Otvoreno novo dječje igralište u centru Zagreba',
      slug: 'otvoreno-novo-djecje-igraliste-u-centru-zagreba',
      content: `<p>Grad Zagreb otvorio je novo moderno dječje igralište u parku Maksimir, opremljeno najnovijim sigurnosnim standardima.</p>
<p>Igralište je prilagođeno djeci svih uzrasta i uključuje poseban dio za djecu s posebnim potrebama.</p>
<h2>Što sve nudi?</h2>
<ul>
<li>Tobogani i ljuljačke</li>
<li>Pješčanik s nadstrešnicom</li>
<li>Sprave za penjanje</li>
<li>Klupice za roditelje</li>
</ul>
<p>Igralište je otvoreno svaki dan od 8 do 20 sati.</p>`,
      excerpt: 'Novo igralište u parku Maksimir nudi sadržaje za djecu svih uzrasta, uključujući i prilagođene sprave za djecu s posebnim potrebama.',
      featured_image: 'https://images.unsplash.com/photo-1564429238980-16b37d5e0d68?w=1200',
      category_id: categoryMap.get('vijesti'),
      author_id: authorMap.get('Ana Horvat'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      seo_data: {
        meta_title: 'Novo dječje igralište Zagreb Maksimir - Otvorenje 2024',
        meta_description: 'U parku Maksimir otvoreno je novo moderno dječje igralište. Pogledajte što sve nudi i kada je otvoreno.',
        focus_keyphrase: 'dječje igralište Zagreb',
        schema_type: 'NewsArticle'
      }
    },

    // Lifestyle
    {
      title: '10 savjeta za organizaciju obiteljskog doma',
      slug: '10-savjeta-za-organizaciju-obiteljskog-doma',
      content: `<p>Održavanje urednog doma s djecom može se činiti kao nemoguća misija, ali uz prave strategije postaje puno lakše.</p>
<h2>1. Odredite mjesto za svaku stvar</h2>
<p>Svaka igračka, knjiga i odjevni predmet treba imati svoje mjesto. Kad djeca znaju gdje što ide, lakše održavaju red.</p>
<h2>2. Dnevne rutine čišćenja</h2>
<p>Umjesto velikog čišćenja jednom tjedno, uvedite kratke dnevne rutine od 15 minuta.</p>
<h2>3. Uključite cijelu obitelj</h2>
<p>Čak i najmlađi mogu pomoći - neka slažu svoje igračke dok vi radite ostalo.</p>
<h2>4. Koristite kutije i košare</h2>
<p>Prozirne kutije s oznakama čine organizaciju jednostavnom i vizualno urednom.</p>
<h2>5. Redovito čistite stvari koje ne koristite</h2>
<p>Svaka sezona je dobra prilika za doniranje stvari koje više ne trebate.</p>`,
      excerpt: 'Praktični savjeti za održavanje urednog obiteljskog doma bez stresa. Od dnevnih rutina do pametne organizacije prostora.',
      featured_image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
      category_id: categoryMap.get('lifestyle'),
      author_id: authorMap.get('Ivana Babić'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
      seo_data: {
        meta_title: '10 savjeta za organizaciju obiteljskog doma - Praktični vodič',
        meta_description: 'Naučite kako održavati uredan dom s djecom. 10 jednostavnih savjeta za organizaciju prostora i stvaranje dnevnih rutina.',
        focus_keyphrase: 'organizacija doma',
        schema_type: 'Article'
      }
    },
    {
      title: 'Kako stvoriti opuštajući kutak za čitanje',
      slug: 'kako-stvoriti-opustajuci-kutak-za-citanje',
      content: `<p>Svaka mama zaslužuje mjesto gdje može pobjeći od svakodnevnog kaosa i uživati u dobroj knjizi.</p>
<h2>Odaberite pravi prostor</h2>
<p>Ne treba vam puno prostora - kutak uz prozor, dio spavaće sobe ili čak dio hodnika mogu postati vaše utočište.</p>
<h2>Udobno sjedenje je ključno</h2>
<p>Investirajte u udobnu fotelju ili stvorite ležerni kutak s puno jastuka. Dodajte mekanu deku za hladnije dane.</p>
<h2>Osvjetljenje</h2>
<p>Dobra lampa za čitanje je neophodna. Birajte toplo svjetlo koje ne zamara oči.</p>`,
      excerpt: 'Stvorite svoj osobni kutak za opuštanje i čitanje. Savjeti za uređenje idealnog prostora za bijeg od svakodnevice.',
      featured_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200',
      category_id: categoryMap.get('lifestyle'),
      author_id: authorMap.get('Ivana Babić'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      seo_data: {
        meta_title: 'Kako stvoriti kutak za čitanje - Ideje za uređenje',
        meta_description: 'Savjeti za stvaranje opuštajućeg kutka za čitanje u vašem domu. Od odabira prostora do rasvjete.',
        focus_keyphrase: 'kutak za čitanje',
        schema_type: 'Article'
      }
    },

    // Zdravlje
    {
      title: 'Važnost redovitih sistematskih pregleda za djecu',
      slug: 'vaznost-redovitih-sistematskih-pregleda-za-djecu',
      content: `<p>Redoviti sistematski pregledi ključni su za praćenje rasta i razvoja vašeg djeteta.</p>
<h2>Kada na pregled?</h2>
<p>Pedijatri preporučuju sistematske preglede u određenim intervalima: prvi mjesec, treći mjesec, šesti mjesec, te zatim jednom godišnje.</p>
<h2>Što uključuje pregled?</h2>
<ul>
<li>Mjerenje visine i težine</li>
<li>Provjera vida i sluha</li>
<li>Procjena motoričkog razvoja</li>
<li>Pregled cijepljenja</li>
</ul>
<h2>Kako pripremiti dijete?</h2>
<p>Razgovarajte s djetetom o tome što ga očekuje. Pozitivan pristup pomoći će da pregled prođe bez straha.</p>`,
      excerpt: 'Sve što trebate znati o sistematskim pregledima djece - kada ići, što pregled uključuje i kako pripremiti dijete.',
      featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200',
      category_id: categoryMap.get('zdravlje'),
      author_id: authorMap.get('Ana Horvat'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 8).toISOString(),
      seo_data: {
        meta_title: 'Sistematski pregledi djece - Vodič za roditelje',
        meta_description: 'Saznajte zašto su sistematski pregledi važni, kada ih obaviti i kako pripremiti dijete za posjet pedijatru.',
        focus_keyphrase: 'sistematski pregled djece',
        schema_type: 'Article'
      }
    },
    {
      title: 'Prirodni načini jačanja imuniteta kod djece',
      slug: 'prirodni-nacini-jacanja-imuniteta-kod-djece',
      content: `<p>Jak imunitet temelj je dobrog zdravlja vaše djece. Evo prirodnih načina da ga ojačate.</p>
<h2>Prehrana bogata vitaminima</h2>
<p>Voće i povrće trebali bi biti dio svakog obroka. Posebno su važni vitamin C (citrusi, paprika) i vitamin D (riba, jaja).</p>
<h2>Dovoljno sna</h2>
<p>Djeca predškolske dobi trebaju 10-13 sati sna, a školska djeca 9-11 sati. San je ključan za oporavak organizma.</p>
<h2>Redovita tjelesna aktivnost</h2>
<p>Igra na svježem zraku ne samo da jača tijelo već i pomaže regulaciji stresa.</p>
<h2>Higijena ruku</h2>
<p>Naučite djecu pravilno prati ruke - to je najjednostavniji način prevencije bolesti.</p>`,
      excerpt: 'Prirodni načini za jačanje imuniteta kod djece - od prehrane i sna do tjelesne aktivnosti i higijene.',
      featured_image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200',
      category_id: categoryMap.get('zdravlje'),
      author_id: authorMap.get('Marija Kovač'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(),
      seo_data: {
        meta_title: 'Kako ojačati imunitet kod djece prirodnim putem',
        meta_description: 'Prirodni načini jačanja imuniteta kod djece. Savjeti o prehrani, snu i tjelesnoj aktivnosti za zdraviju djecu.',
        focus_keyphrase: 'imunitet djece',
        schema_type: 'Article'
      }
    },

    // Recepti
    {
      title: 'Zdravi keksići od banane i zobenih pahuljica',
      slug: 'zdravi-keksici-od-banane-i-zobenih-pahuljica',
      content: `<p>Ovi jednostavni keksići idealni su za zdravu užinu. Bez dodanog šećera, a djeca ih obožavaju!</p>
<h2>Sastojci</h2>
<ul>
<li>2 zrele banane</li>
<li>1 šalica zobenih pahuljica</li>
<li>Šaka čokoladnih kapljica (opcionalno)</li>
<li>Prstohvat cimeta</li>
</ul>
<h2>Priprema</h2>
<ol>
<li>Zagrijte pećnicu na 180°C</li>
<li>Zgnječite banane vilicom</li>
<li>Dodajte zobene pahuljice, cimet i čokoladne kapljice</li>
<li>Oblikujte male kuglice i spljoštite ih na lim za pečenje</li>
<li>Pecite 12-15 minuta dok ne porumene</li>
</ol>
<p>Gotovo! Keksići se mogu čuvati u zatvorenoj posudi do 5 dana.</p>`,
      excerpt: 'Recept za zdrave keksiće od samo 2 sastojka! Bez šećera, brzi i jednostavni - savršeni za dječju užinu.',
      featured_image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200',
      category_id: categoryMap.get('recepti'),
      author_id: authorMap.get('Marija Kovač'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
      seo_data: {
        meta_title: 'Zdravi keksići od banane - Recept bez šećera',
        meta_description: 'Jednostavan recept za zdrave keksiće od banane i zobenih pahuljica. Bez dodanog šećera, idealni za djecu.',
        focus_keyphrase: 'keksići od banane',
        schema_type: 'Article'
      }
    },
    {
      title: 'Domaći nuggetsi od piletine - recept koji djeca obožavaju',
      slug: 'domaci-nuggetsi-od-piletine-recept',
      content: `<p>Zaboravite kupovne nuggeste! Ovi domaći su zdraviji, ukusniji i vrlo jednostavni za pripremu.</p>
<h2>Sastojci</h2>
<ul>
<li>500g pilećih prsa</li>
<li>1 šalica krušnih mrvica</li>
<li>1/2 šalice parmezana</li>
<li>2 jaja</li>
<li>Sol, papar, paprika po ukusu</li>
</ul>
<h2>Priprema</h2>
<ol>
<li>Narežite piletinu na komadiće veličine nuggetsa</li>
<li>Pomiješajte krušne mrvice, parmezan i začine</li>
<li>Umočite piletinu u umućena jaja, pa u mrvice</li>
<li>Složite na lim obložen papirom za pečenje</li>
<li>Pecite na 200°C oko 20 minuta, okrećući na pola vremena</li>
</ol>
<p>Poslužite s domaćim umakom od rajčice ili jogurtom!</p>`,
      excerpt: 'Recept za domaće pileće nuggeste - zdravija verzija omiljenog dječjeg jela. Hrskavi izvana, sočni iznutra!',
      featured_image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=1200',
      category_id: categoryMap.get('recepti'),
      author_id: authorMap.get('Marija Kovač'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 30).toISOString(),
      seo_data: {
        meta_title: 'Domaći pileći nuggetsi - Recept za djecu',
        meta_description: 'Napravite zdrave domaće nuggeste od piletine. Jednostavan recept koji će djeca obožavati!',
        focus_keyphrase: 'domaći nuggetsi',
        schema_type: 'Article'
      }
    },

    // Djeca
    {
      title: 'Kako pomoći djetetu s odvikavanjem od pelena',
      slug: 'kako-pomoci-djetetu-s-odvikavanjem-od-pelena',
      content: `<p>Odvikavanje od pelena veliki je korak u razvoju svakog djeteta. Evo kako olakšati taj prijelaz.</p>
<h2>Znakovi spremnosti</h2>
<p>Dijete je spremno kad pokazuje interes za toalet, ostaje suho duže vrijeme i može komunicirati svoje potrebe.</p>
<h2>Strpljenje je ključ</h2>
<p>Ne žurite i ne pritiskajte. Svako dijete ima svoj tempo. Nazadovanja su normalna i očekivana.</p>
<h2>Praktični savjeti</h2>
<ul>
<li>Nabavite dječju kahlicu ili adapter za WC</li>
<li>Uspostavite rutinu (npr. nakon buđenja, prije spavanja)</li>
<li>Slavite uspjehe, ignorirajte nesreće</li>
<li>Obucite dijete u odjeću koju lako skida</li>
</ul>`,
      excerpt: 'Vodič za roditelje o odvikavanju od pelena. Kako prepoznati spremnost djeteta i olakšati prijelaz.',
      featured_image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200',
      category_id: categoryMap.get('djeca'),
      author_id: authorMap.get('Ana Horvat'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
      seo_data: {
        meta_title: 'Odvikavanje od pelena - Savjeti za roditelje',
        meta_description: 'Kako pomoći djetetu s odvikavanjem od pelena. Znakovi spremnosti, praktični savjeti i strpljenje.',
        focus_keyphrase: 'odvikavanje od pelena',
        schema_type: 'Article'
      }
    },
    {
      title: 'Najbolje edukativne igre za predškolce',
      slug: 'najbolje-edukativne-igre-za-predskolce',
      content: `<p>Igra je najbolji način učenja za djecu predškolske dobi. Evo igara koje zabavljaju i educiraju.</p>
<h2>Puzzle</h2>
<p>Razvijaju prostornu percepciju, strpljenje i logičko razmišljanje. Počnite s manjim puzzlama i postupno povećavajte složenost.</p>
<h2>Igre s kockama</h2>
<p>LEGO i slične kocke potiču kreativnost, motoriku i razumijevanje oblika i boja.</p>
<h2>Igre pretvaranja</h2>
<p>Kuhinja, doktorski set, lutke - igre uloga razvijaju socijalne vještine i emocionalnu inteligenciju.</p>
<h2>Društvene igre za najmlađe</h2>
<p>Jednostavne društvene igre uče djecu čekanju reda, pravilima i suradnji.</p>`,
      excerpt: 'Pregled najboljih edukativnih igara za djecu predškolske dobi. Od puzzli do društvenih igara - zabava i učenje u jednom!',
      featured_image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200',
      category_id: categoryMap.get('djeca'),
      author_id: authorMap.get('Ivana Babić'),
      status: 'published',
      published_at: new Date(now.getTime() - 1000 * 60 * 60 * 96).toISOString(),
      seo_data: {
        meta_title: 'Edukativne igre za predškolce - Top izbor',
        meta_description: 'Najbolje edukativne igre za djecu predškolske dobi. Igre koje razvijaju motoriku, logiku i socijalne vještine.',
        focus_keyphrase: 'edukativne igre predškolci',
        schema_type: 'Article'
      }
    }
  ]

  const { data: createdArticles, error: articleError } = await supabase
    .from('articles')
    .upsert(articles, { onConflict: 'slug' })
    .select()

  if (articleError) {
    console.error('Error creating articles:', articleError)
  } else {
    console.log('Created articles:', createdArticles?.length)
  }

  // 4. Create sample pages
  const pages = [
    {
      title: 'O nama',
      slug: 'o-nama',
      content: `<h1>O portalu Matermag</h1>
<p>Matermag je portal za moderne mame koji donosi korisne savjete, inspirativne priče i praktične informacije za svakodnevni obiteljski život.</p>
<h2>Naša misija</h2>
<p>Želimo biti podrška svim mamama na njihovom putu roditeljstva. Vjerujemo da informirane mame su sretnije mame, a sretnije mame odgajaju sretnu djecu.</p>
<h2>Što nudimo</h2>
<ul>
<li>Aktualne vijesti relevantne za obitelji</li>
<li>Praktične savjete za svakodnevicu</li>
<li>Zdrave i jednostavne recepte</li>
<li>Inspirativne lifestyle članke</li>
<li>Stručne savjete o zdravlju i razvoju djece</li>
</ul>
<p>Hvala što ste dio naše zajednice!</p>`,
      status: 'published',
      seo_data: {
        meta_title: 'O nama - Matermag portal za mame',
        meta_description: 'Saznajte više o Matermag portalu - vašem izvoru korisnih savjeta, recepata i inspiracije za moderne mame.',
        focus_keyphrase: 'portal za mame'
      }
    },
    {
      title: 'Kontakt',
      slug: 'kontakt',
      content: `<h1>Kontaktirajte nas</h1>
<p>Drago nam je što nas želite kontaktirati! Rado čujemo vaše komentare, prijedloge i pitanja.</p>
<h2>Email</h2>
<p>Za sve upite možete nas kontaktirati na: <strong>info@matermag.hr</strong></p>
<h2>Društvene mreže</h2>
<p>Pratite nas na našim društvenim mrežama za najnovije sadržaje i interakciju s našom zajednicom.</p>
<h2>Suradnja</h2>
<p>Za poslovnu suradnju i oglašavanje molimo kontaktirajte nas na: <strong>marketing@matermag.hr</strong></p>`,
      status: 'published',
      seo_data: {
        meta_title: 'Kontakt - Matermag',
        meta_description: 'Kontaktirajte Matermag tim. Email, društvene mreže i informacije za poslovnu suradnju.',
        focus_keyphrase: 'kontakt Matermag'
      }
    },
    {
      title: 'Politika privatnosti',
      slug: 'politika-privatnosti',
      content: `<h1>Politika privatnosti</h1>
<p>Vaša privatnost nam je važna. Ova politika privatnosti objašnjava kako prikupljamo, koristimo i štitimo vaše osobne podatke.</p>
<h2>Podaci koje prikupljamo</h2>
<p>Prikupljamo samo podatke koje nam dobrovoljno date, kao što su email adresa pri prijavi na newsletter.</p>
<h2>Kako koristimo podatke</h2>
<p>Vaše podatke koristimo isključivo za slanje newslettera i poboljšanje korisničkog iskustva na našem portalu.</p>
<h2>Kolačići</h2>
<p>Koristimo kolačiće za analitiku i poboljšanje funkcionalnosti stranice. Možete ih onemogućiti u postavkama preglednika.</p>
<h2>Vaša prava</h2>
<p>Imate pravo zatražiti uvid, ispravak ili brisanje svojih osobnih podataka u bilo kojem trenutku.</p>`,
      status: 'published',
      seo_data: {
        meta_title: 'Politika privatnosti - Matermag',
        meta_description: 'Politika privatnosti Matermag portala. Saznajte kako prikupljamo i koristimo vaše podatke.',
        focus_keyphrase: 'politika privatnosti'
      }
    }
  ]

  const { data: createdPages, error: pageError } = await supabase
    .from('pages')
    .upsert(pages, { onConflict: 'slug' })
    .select()

  if (pageError) {
    console.error('Error creating pages:', pageError)
  } else {
    console.log('Created pages:', createdPages?.length)
  }

  // 5. Create SEO settings
  const seoSettings = {
    site_title: 'Matermag - Portal za moderne mame',
    site_description: 'Matermag je portal za moderne mame s vijestima, savjetima, receptima i inspiracijom za svakodnevni obiteljski život.',
    default_og_image: 'https://matermag.hr/og-image.jpg',
    google_analytics_id: null,
    robots_txt: `User-agent: *
Allow: /

Sitemap: https://matermag.hr/sitemap.xml`
  }

  const { error: seoError } = await supabase
    .from('seo_settings')
    .upsert([seoSettings])

  if (seoError) {
    console.error('Error creating SEO settings:', seoError)
  } else {
    console.log('Created SEO settings')
  }

  console.log('Content seeding completed!')
}

seedContent().catch(console.error)
