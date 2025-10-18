import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { industries } from '../lib/data/industries'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  console.log('Seeding company_industries mappings...')

  // Build ticker -> industry slug map from hardcoded data
  const tickerToIndustrySlug = new Map<string, string>()
  for (const ind of industries as any[]) {
    for (const t of ind.featured_companies || []) {
      if (!tickerToIndustrySlug.has(t)) tickerToIndustrySlug.set(t, ind.slug)
    }
  }

  // Load companies and industries from DB
  const { data: companies, error: compErr } = await supabase
    .from('companies')
    .select('id, ticker')
    .limit(5000)
  if (compErr) throw compErr

  const { data: inds, error: indErr } = await supabase
    .from('industries')
    .select('id, slug')
  if (indErr) throw indErr

  const slugToId = new Map<string, string>()
  for (const i of inds || []) slugToId.set((i as any).slug, (i as any).id)

  const rows: { company_id: string, industry_id: string, is_primary: boolean }[] = []
  for (const c of companies || []) {
    const slug = tickerToIndustrySlug.get((c as any).ticker)
    if (!slug) continue
    const industryId = slugToId.get(slug)
    if (!industryId) continue
    rows.push({ company_id: (c as any).id, industry_id: industryId, is_primary: true })
  }

  // Upsert in batches
  const batchSize = 500
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error } = await supabase
      .from('company_industries')
      .upsert(batch, { onConflict: 'company_id,industry_id' })
    if (error) {
      console.error('Batch upsert error:', error.message)
    } else {
      console.log(`Upserted ${Math.min(batchSize, rows.length - i)} mappings`)
    }
  }

  console.log('Done seeding company_industries mappings.')
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})


