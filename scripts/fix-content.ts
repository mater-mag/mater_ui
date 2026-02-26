import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fixContent() {
  console.log('Fixing content...')

  // 1. Create authors
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

  const { data: createdAuthors, error: authorError } = await supabase
    .from('authors')
    .insert(authors)
    .select()

  if (authorError) {
    console.error('Error creating authors:', authorError)
  } else {
    console.log('Created authors:', createdAuthors?.length)
  }

  // Get author IDs
  const { data: allAuthors } = await supabase.from('authors').select('*')
  const authorMap = new Map(allAuthors?.map(a => [a.name, a.id]))

  // Get category IDs - use the correct slugs
  const { data: categories } = await supabase.from('categories').select('*')
  const categoryMap = new Map(categories?.map(c => [c.slug, c.id]))

  console.log('Category slugs available:', Array.from(categoryMap.keys()))

  // Map article slugs to correct categories and authors
  const articleUpdates = [
    {
      slug: 'novi-zakon-o-rodiljnim-naknadama-stupa-na-snagu',
      category_id: categoryMap.get('od-mame-za-mame'),
      author_id: authorMap.get('Ana Horvat')
    },
    {
      slug: 'otvoreno-novo-djecje-igraliste-u-centru-zagreba',
      category_id: categoryMap.get('od-mame-za-mame'),
      author_id: authorMap.get('Ana Horvat')
    },
    {
      slug: '10-savjeta-za-organizaciju-obiteljskog-doma',
      category_id: categoryMap.get('lifestyle'),
      author_id: authorMap.get('Ivana Babić')
    },
    {
      slug: 'kako-stvoriti-opustajuci-kutak-za-citanje',
      category_id: categoryMap.get('lifestyle'),
      author_id: authorMap.get('Ivana Babić')
    },
    {
      slug: 'vaznost-redovitih-sistematskih-pregleda-za-djecu',
      category_id: categoryMap.get('zdravlje-i-prehrana'),
      author_id: authorMap.get('Ana Horvat')
    },
    {
      slug: 'prirodni-nacini-jacanja-imuniteta-kod-djece',
      category_id: categoryMap.get('zdravlje-i-prehrana'),
      author_id: authorMap.get('Marija Kovač')
    },
    {
      slug: 'zdravi-keksici-od-banane-i-zobenih-pahuljica',
      category_id: categoryMap.get('zdravlje-i-prehrana'),
      author_id: authorMap.get('Marija Kovač')
    },
    {
      slug: 'domaci-nuggetsi-od-piletine-recept',
      category_id: categoryMap.get('zdravlje-i-prehrana'),
      author_id: authorMap.get('Marija Kovač')
    },
    {
      slug: 'kako-pomoci-djetetu-s-odvikavanjem-od-pelena',
      category_id: categoryMap.get('bebe-i-djeca'),
      author_id: authorMap.get('Ana Horvat')
    },
    {
      slug: 'najbolje-edukativne-igre-za-predskolce',
      category_id: categoryMap.get('bebe-i-djeca'),
      author_id: authorMap.get('Ivana Babić')
    }
  ]

  // Update each article
  for (const update of articleUpdates) {
    const { error } = await supabase
      .from('articles')
      .update({
        category_id: update.category_id,
        author_id: update.author_id
      })
      .eq('slug', update.slug)

    if (error) {
      console.error(`Error updating ${update.slug}:`, error)
    } else {
      console.log(`Updated: ${update.slug}`)
    }
  }

  console.log('Content fix completed!')
}

fixContent().catch(console.error)
