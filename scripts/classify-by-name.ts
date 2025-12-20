
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const RULES: { pattern: RegExp, industry: string, tags: string[] }[] = [
    // --- UTILITIES ---
    { pattern: /Electric Power/i, industry: 'utilities', tags: ['electric-utilities', 'grid-infrastructure'] },
    { pattern: /Gas/i, industry: 'utilities', tags: ['gas-utilities'] },

    // --- TRANSPORTATION ---
    { pattern: /Railway/i, industry: 'transportation-logistics', tags: ['rail', 'passenger-transport'] },
    { pattern: /Line/i, industry: 'transportation-logistics', tags: ['marine-shipping', 'logistics'] },
    { pattern: /Transport/i, industry: 'transportation-logistics', tags: ['logistics'] },
    { pattern: /Express/i, industry: 'transportation-logistics', tags: ['logistics', 'delivery'] },
    { pattern: /Airline/i, industry: 'transportation-logistics', tags: ['airlines'] },
    { pattern: /Airport/i, industry: 'transportation-logistics', tags: ['infrastructure'] },

    // --- FINANCE ---
    { pattern: /Bank/i, industry: 'banking', tags: ['commercial-banking', 'regional-banking'] },
    { pattern: /Financial/i, industry: 'banking', tags: ['financial-services'] },
    { pattern: /Insurance/i, industry: 'insurance', tags: ['property-casualty'] },
    { pattern: /Securities/i, industry: 'financials', tags: ['investment-banking'] },
    { pattern: /Credit/i, industry: 'fintech', tags: ['consumer-finance'] },

    // --- PHARMA & HEALTH ---
    { pattern: /Pharmaceutical/i, industry: 'pharmaceuticals', tags: ['drug-development', 'manufacturing'] },
    { pattern: /Yakult/i, industry: 'food-beverage', tags: ['beverages', 'probiotics'] }, // Specific famous one
    { pattern: /Medical/i, industry: 'medical-devices', tags: ['medical-equipment'] },

    // --- CHEMICALS & MATERIALS ---
    { pattern: /Chemical/i, industry: 'chemicals', tags: ['specialty', 'materials'] },
    { pattern: /Paint/i, industry: 'chemicals', tags: ['coatings'] },
    { pattern: /Glass/i, industry: 'mining-materials', tags: ['materials'] },
    { pattern: /Steel/i, industry: 'mining-materials', tags: ['steel-production'] },
    { pattern: /Cement/i, industry: 'mining-materials', tags: ['construction-materials'] },
    { pattern: /Paper/i, industry: 'mining-materials', tags: ['materials'] },

    // --- CONSTRUCTION & REAL ESTATE ---
    { pattern: /Construction/i, industry: 'construction-engineering', tags: ['construction-engineering'] },
    { pattern: /Real Estate/i, industry: 'real-estate', tags: ['commercial', 'residential'] },
    { pattern: /Fudosan/i, industry: 'real-estate', tags: ['commercial', 'residential'] }, // Japanese for Real Estate
    { pattern: /REIT/i, industry: 'real-estate', tags: ['reit'] },
    { pattern: /Housing/i, industry: 'construction-engineering', tags: ['residential-construction'] },

    // --- FOOD & RETAIL ---
    { pattern: /Food/i, industry: 'food-beverage', tags: ['packaged-food'] },
    { pattern: /Beverage/i, industry: 'food-beverage', tags: ['beverages'] },
    { pattern: /Beer/i, industry: 'food-beverage', tags: ['beverages', 'alcohol'] },
    { pattern: /Retail/i, industry: 'retail', tags: ['retail'] },
    { pattern: /Department Store/i, industry: 'retail', tags: ['department-stores'] },
    { pattern: /Store/i, industry: 'retail', tags: ['retail'] },
    { pattern: /Lawson/i, industry: 'retail', tags: ['convenience-stores'] },
    { pattern: /Sushi/i, industry: 'hospitality', tags: ['restaurants'] },
    { pattern: /Zensho/i, industry: 'hospitality', tags: ['restaurants'] },

    // --- TECH & ELECTRONICS ---
    { pattern: /Electric/i, industry: 'consumer-products', tags: ['electronics'] }, // Fallback from Power
    { pattern: /Electronic/i, industry: 'consumer-products', tags: ['electronics'] },
    { pattern: /System/i, industry: 'software-saas', tags: ['it-services'] },
    { pattern: /Solution/i, industry: 'software-saas', tags: ['it-services'] },
    { pattern: /Software/i, industry: 'software-saas', tags: ['enterprise-software'] },
    { pattern: /Game/i, industry: 'media-entertainment', tags: ['gaming'] },
    { pattern: /Entertainment/i, industry: 'media-entertainment', tags: ['media'] },

    // --- HEAVY INDUSTRY ---
    { pattern: /Machine/i, industry: 'robotics-automation', tags: ['industrial-machinery'] },
    { pattern: /Heavy Industries/i, industry: 'aerospace-defense', tags: ['defense', 'infrastructure'] },
]

async function classifyByName() {
    console.log('🧹 Smart Sweeping Unmapped Companies by Name Pattern...')

    // Fetch unmapped
    const { data: all } = await supabase
        .from('companies')
        .select('*')
        .eq('country', 'JP')

    if (!all) return
    const unmapped = all.filter(c => !c.value_chain_tags || c.value_chain_tags.length === 0)

    let matched = 0
    let updated = 0

    for (const co of unmapped) {
        let matchFound = false

        for (const rule of RULES) {
            if (rule.pattern.test(co.name)) {
                // Apply update
                const { error } = await supabase
                    .from('companies')
                    .update({
                        industry: rule.industry,
                        value_chain_tags: rule.tags,
                        is_featured: false, // Don't auto-feature regex matches
                        updated_at: new Date().toISOString()
                    })
                    .eq('ticker', co.ticker)

                if (!error) {
                    matched++
                    updated++
                    process.stdout.write('.')
                }
                matchFound = true
                break // Stop after first match
            }
        }
    }

    console.log(`\n✨ Smart Sweeper Complete. Processed ${unmapped.length} unmapped companies. Matched & Updated: ${updated}`)
}

classifyByName()
