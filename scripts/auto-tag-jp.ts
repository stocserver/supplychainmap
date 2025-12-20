
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Map Primary Industry (slug) to Default Tags
const FACTORY_TAGS: Record<string, string[]> = {
    'semiconductors': ['wafer-manufacturing', 'production-equipment'], // Broad guess for JP
    'automotive': ['auto-parts-suppliers', 'auto-manufacturing'],
    'consumer-products': ['household', 'personal-care'],
    'robotics-automation': ['industrial-robots', 'sensors-actuators'],
    'chemicals': ['specialty', 'materials'],
    'transportation-logistics': ['rail', 'marine'],
    'pharmaceuticals': ['drug-development', 'manufacturing'],
    'banking': ['commercial-banking', 'retail-banking'],
    'telecommunications': ['carriers', 'infrastructure'],
    'media-entertainment': ['gaming', 'studios'],
    'food-beverage': ['packaged-food', 'beverages'],
    'construction-engineering': ['infrastructure', 'residential'],
    'real-estate': ['commercial', 'services'],
    'utilities': ['electric', 'gas'],
    'insurance': ['property-casualty', 'life-health'],
    'energy-storage': ['materials', 'battery-tech'],
    'medical-devices': ['equipment', 'diagnostics'],
    'ecommerce': ['marketplaces', 'retail'],
    'retail': ['brick-mortar', 'e-commerce'],
    'mining-materials': ['materials', 'processing']
}

async function autoTag() {
    console.log('🤖 Auto-Tagging Japanese Companies based on Industry...')

    // Fetch all JP companies with an industry
    const { data: companies, error } = await supabase
        .from('companies')
        .select('*')
        .eq('country', 'JP')
        .not('industry', 'is', null)

    if (error) {
        console.error('Error fetching:', error)
        return
    }

    console.log(`Found ${companies.length} JP companies to process.`)

    let updated = 0

    for (const co of companies) {
        // Skip if already has manually assigned tags (assuming > 2 specific tags is manual)
        // Or if we executed the manual script before, we don't want to overwrite specific tags with generic ones.
        // But for "Unclassified" ones, we want to help.

        const currentTags = co.value_chain_tags || []

        // If no tags, apply generic defaults
        if (currentTags.length === 0) {
            const industry = co.industry
            const defaultTags = FACTORY_TAGS[industry]

            if (defaultTags) {
                const { error: updateError } = await supabase
                    .from('companies')
                    .update({
                        value_chain_tags: defaultTags,
                        is_featured: false // Don't feature auto-tagged ones by default
                    })
                    .eq('ticker', co.ticker)

                if (!updateError) {
                    process.stdout.write('.')
                    updated++
                }
            }
        }
    }

    console.log(`\n✨ Auto-tagged ${updated} companies based on their primary industry.`)
}

autoTag()
