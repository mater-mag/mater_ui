import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function addVideoColumns() {
  // Add featured_video column
  const { error: error1 } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_video TEXT;`
  }).single()

  // Add media_type column
  const { error: error2 } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE articles ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';`
  }).single()

  // If RPC doesn't work, we can try direct REST API approach
  // For now, let's test if the columns exist by trying to select them
  const { data, error } = await supabase
    .from('articles')
    .select('id, featured_video, media_type')
    .limit(1)

  if (error) {
    console.log('Columns may not exist yet. Error:', error.message)
    console.log('Please run this SQL in your Supabase dashboard:')
    console.log(`
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_video TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';
    `)
  } else {
    console.log('Video columns already exist or were added successfully')
    console.log('Sample data:', data)
  }
}

addVideoColumns()
