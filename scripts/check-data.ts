import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkData() {
  console.log('=== Categories ===')
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, parent_id')
    .order('name')
  console.log(JSON.stringify(categories, null, 2))

  console.log('\n=== Authors ===')
  const { data: authors } = await supabase.from('authors').select('*')
  console.log(JSON.stringify(authors, null, 2))

  console.log('\n=== Articles ===')
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, status, category_id')
  console.log(JSON.stringify(articles, null, 2))

  console.log('\n=== Pages ===')
  const { data: pages } = await supabase.from('pages').select('id, title, slug, status')
  console.log(JSON.stringify(pages, null, 2))
}

checkData()
