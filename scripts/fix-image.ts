import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fixImage() {
  // Fix the broken playground image URL
  const { error } = await supabase
    .from('articles')
    .update({
      featured_image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200'
    })
    .eq('slug', 'otvoreno-novo-djecje-igraliste-u-centru-zagreba')

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Image URL updated')
  }
}

fixImage()
