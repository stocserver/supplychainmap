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

// Same canonical category mapping as industries seed
const categoryById: Record<string, string> = {
  'semiconductors': 'tech', 'ai-ml': 'tech', 'cloud-computing': 'tech', 'cybersecurity': 'tech', 'software-saas': 'tech', 'data-centers': 'tech', 'telecommunications': 'tech', 'robotics': 'tech', 'robotics-automation': 'tech',
  'banking': 'financials', 'insurance': 'financials', 'asset-management': 'financials', 'fintech': 'financials',
  'oil-gas': 'energy-materials', 'mining-materials': 'energy-materials', 'chemicals': 'energy-materials', 'solar-energy': 'energy-materials', 'energy-storage': 'energy-materials', 'utilities': 'energy-materials',
  'electric-vehicles': 'transport', 'automotive': 'transport', 'transportation-logistics': 'transport', 'aerospace': 'transport', 'aerospace-defense': 'transport', 'space': 'transport', 'space-technology': 'transport',
  'pharmaceuticals': 'healthcare', 'biotechnology': 'healthcare', 'medical-devices': 'healthcare', 'digital-health': 'healthcare',
  'food-beverage': 'consumer', 'consumer-products': 'consumer', 'retail': 'consumer', 'ecommerce': 'consumer',
  'real-estate': 'real-estate', 'construction-engineering': 'real-estate',
  'hospitality': 'hospitality', 'media-entertainment': 'hospitality',
  'agtech': 'agriculture'
}

async function main() {
  console.log('Setting company classification fields...')

  // Build ticker -> industry id and category from hardcoded data
  const tickerToIndustrySlug = new Map<string, string>()
  for (const ind of industries as any[]) {
    for (const t of ind.featured_companies || []) {
      if (!tickerToIndustrySlug.has(t)) tickerToIndustrySlug.set(t, ind.slug)
    }
  }

  // Load companies
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, ticker')
    .limit(5000)
  if (error) throw error

  // Update in batches
  const updates: any[] = []
  for (const c of companies || []) {
    const slug = tickerToIndustrySlug.get((c as any).ticker)
    if (!slug) continue
    updates.push({ id: (c as any).id, industry_slug: slug, industry_category: categoryById[slug] || null })
  }

  const batchSize = 500
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize)
    const { error: upErr } = await supabase
      .from('companies')
      .upsert(batch, { onConflict: 'id' })
    if (upErr) console.error('Upsert error:', upErr.message)
    else console.log(`Updated ${Math.min(batchSize, updates.length - i)} companies`)
  }

  console.log('Done.')
}

main().then(() => process.exit(0)).catch(err => { console.error('Fatal:', err); process.exit(1) })


