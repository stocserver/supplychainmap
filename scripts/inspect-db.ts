import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  console.log('Inspecting Supabase data...\n')

  const { data: industries, error: indsErr } = await supabase
    .from('industries')
    .select('id, name, slug, description, color, icon')
    .order('slug', { ascending: true })
    .limit(5)

  if (indsErr) throw indsErr
  console.log('industries (first 5):')
  console.log(JSON.stringify(industries, null, 2))
  console.log('')

  const idToSlug = new Map<string, string>()
  for (const i of industries || []) idToSlug.set((i as any).id, (i as any).slug)

  const { data: ifc, error: ifcErr, count } = await supabase
    .from('industry_featured_companies')
    .select('industry_id, ticker, position_order', { count: 'exact' })
    .order('industry_id', { ascending: true })
    .limit(10)

  if (ifcErr) throw ifcErr
  console.log(`industry_featured_companies (count: ${count}) sample:`)
  console.log(JSON.stringify(ifc?.map(r => ({ ...r, industry_slug: idToSlug.get((r as any).industry_id) })), null, 2))
  console.log('')

  // Show one industry's mapping fully (up to 20)
  if (industries && industries.length > 0) {
    const first = industries[0] as any
    const { data: mapRows } = await supabase
      .from('industry_featured_companies')
      .select('ticker, position_order')
      .eq('industry_id', first.id)
      .order('position_order', { ascending: true })
      .limit(20)
    console.log(`featured tickers for ${first.slug} (up to 20):`)
    console.log(mapRows?.map(r => r.ticker).join(', '))
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err)
  process.exit(1)
})


