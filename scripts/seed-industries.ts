import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { industries } from '../lib/data/industries'

// Canonical category mapping mirroring the industries page groupings
const categoryById: Record<string, string> = {
  // Technology & Innovation
  'semiconductors': 'tech', 'ai-ml': 'tech', 'cloud-computing': 'tech', 'cybersecurity': 'tech', 'software-saas': 'tech', 'data-centers': 'tech', 'telecommunications': 'tech', 'robotics': 'tech', 'robotics-automation': 'tech',
  // Financials
  'banking': 'financials', 'insurance': 'financials', 'asset-management': 'financials', 'fintech': 'financials',
  // Energy & Materials
  'oil-gas': 'energy-materials', 'mining-materials': 'energy-materials', 'chemicals': 'energy-materials', 'solar-energy': 'energy-materials', 'energy-storage': 'energy-materials', 'utilities': 'energy-materials',
  // Transportation & Mobility
  'electric-vehicles': 'transport', 'automotive': 'transport', 'transportation-logistics': 'transport', 'aerospace': 'transport', 'aerospace-defense': 'transport', 'space': 'transport', 'space-technology': 'transport',
  // Healthcare & Life Sciences
  'pharmaceuticals': 'healthcare', 'biotechnology': 'healthcare', 'medical-devices': 'healthcare', 'digital-health': 'healthcare',
  // Consumer & Retail
  'food-beverage': 'consumer', 'consumer-products': 'consumer', 'retail': 'consumer', 'ecommerce': 'consumer',
  // Real Estate & Construction
  'real-estate': 'real-estate', 'construction-engineering': 'real-estate',
  // Hospitality & Entertainment
  'hospitality': 'hospitality', 'media-entertainment': 'hospitality',
  // Agriculture & Industrial
  'agtech': 'agriculture'
}

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase credentials not found in .env.local')
  console.log('Please add:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seedIndustries() {
  console.log('🚀 Seeding industries and featured companies...')

  for (const ind of industries) {
    // Upsert industry row
    const { data: upserted, error: upsertErr } = await supabase
      .from('industries')
      .upsert({
        name: ind.name,
        slug: ind.slug,
        description: ind.description,
        color: ind.color,
        icon: ind.icon,
        category: categoryById[ind.id] || null,
      }, { onConflict: 'slug' })
      .select()
      .single()

    if (upsertErr) {
      console.error(`❌ Failed industry upsert for ${ind.slug}:`, upsertErr.message)
      continue
    }

    const industryId = upserted?.id
    if (!industryId) {
      console.error(`❌ Missing industry id after upsert for ${ind.slug}`)
      continue
    }

    // Sync featured tickers mapping (simple replace strategy)
    const featured = ind.featured_companies || []
    // Delete existing mappings for this industry
    const { error: delErr } = await supabase
      .from('industry_featured_companies')
      .delete()
      .eq('industry_id', industryId)
    if (delErr) {
      console.error(`❌ Failed to clear featured for ${ind.slug}:`, delErr.message)
    }

    if (featured.length > 0) {
      const rows = featured.map((t, idx) => ({ industry_id: industryId, ticker: t, position_order: idx }))
      const { error: insErr } = await supabase
        .from('industry_featured_companies')
        .insert(rows)
      if (insErr) {
        console.error(`❌ Failed to insert featured for ${ind.slug}:`, insErr.message)
      }
    }

    console.log(`✅ Seeded industry ${ind.slug} (${featured.length} featured)`) 
  }

  console.log('✨ Seeding complete')
}

seedIndustries()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('💥 Fatal error:', err)
    process.exit(1)
  })


