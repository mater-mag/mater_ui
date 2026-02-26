import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verify() {
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, status, category:categories(name), author:authors(name)')
    .order('published_at', { ascending: false })

  console.log('=== Articles with Categories & Authors ===')
  articles?.forEach(a => {
    const cat = Array.isArray(a.category) ? a.category[0] : a.category
    const auth = Array.isArray(a.author) ? a.author[0] : a.author
    console.log(`- ${a.title}`)
    console.log(`  Category: ${cat?.name || 'NONE'} | Author: ${auth?.name || 'NONE'} | Status: ${a.status}`)
  })

  const { data: authors } = await supabase.from('authors').select('name, bio')
  console.log('\n=== Authors ===')
  authors?.forEach(a => console.log(`- ${a.name}: ${a.bio?.substring(0, 50)}...`))

  const { data: pages } = await supabase.from('pages').select('title, slug, status')
  console.log('\n=== Pages ===')
  pages?.forEach(p => console.log(`- ${p.title} (/${p.slug}) - ${p.status}`))
}

verify()
