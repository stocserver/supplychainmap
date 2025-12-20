
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Heuristic Rules
// Format: { keywords: string[], industry: string, tags: string[] }
// Heuristic Rules
// Format: { keywords: string[], industry: string, tags: string[] }
const RULES = [
    // --- JAPAN SPECIFIC: TRADING & CONGLOMERATES ---
    { keywords: ['trading', 'wholesale', 'import', 'export', 'sogo shosha', 'distributor'], industry: 'wholesale-trading', tags: ['general-trading'] },
    { keywords: ['holding company', 'conglomerate', 'group', 'diversified'], industry: 'wholesale-trading', tags: ['diversified-holdings'] },
    { keywords: ['mitsubishi corporation', 'mitsui', 'itochu', 'sumitomo corporation', 'marubeni', 'sojitz', 'toyota tsusho'], industry: 'wholesale-trading', tags: ['general-trading'] },

    // --- JAPAN SPECIFIC: ELECTRONICS ---
    { keywords: ['electronics', 'appliance', 'sony', 'panasonic', 'sharp', 'mitsubishi electric'], industry: 'consumer-electronics', tags: ['audio-video', 'appliances'] },
    { keywords: ['printing', 'printer', 'copier', 'ricoh', 'canon', 'seiko epson', 'fujifilm', 'brother'], industry: 'consumer-electronics', tags: ['imaging-optical'] },
    { keywords: ['camera', 'optical', 'nikon', 'olympus'], industry: 'consumer-electronics', tags: ['imaging-optical'] },
    { keywords: ['nintendo', 'sega', 'gaming', 'console'], industry: 'consumer-electronics', tags: ['gaming'] },

    // --- JAPAN SPECIFIC: HEAVY INDUSTRY ---
    { keywords: ['heavy industries', 'ihi', 'kawasaki heavy', 'shipbuilding', 'turbine'], industry: 'heavy-industry', tags: ['shipbuilding', 'power-systems'] },
    { keywords: ['machinery', 'komatsu', 'kubota', 'hitachi construction'], industry: 'heavy-industry', tags: ['industrial-machinery'] },

    // --- TRANSPORTATION & LOGISTICS ---
    { keywords: ['airline', 'airways', 'aviation'], industry: 'transportation-logistics', tags: ['airlines', 'transportation-equipment'] },
    { keywords: ['railway', 'railroad', 'trains', 'locomotive'], industry: 'transportation-logistics', tags: ['railroads'] },
    { keywords: ['trucking', 'freight', 'logistics', 'shipping', 'transportation'], industry: 'transportation-logistics', tags: ['freight-trucking', '3pl-logistics'] },
    { keywords: ['marine', 'shipping', 'vessel', 'cargo', 'sea transport'], industry: 'transportation-logistics', tags: ['freight-trucking'] },
    { keywords: ['delivery', 'express', 'parcel', 'courier', 'postal'], industry: 'transportation-logistics', tags: ['last-mile', '3pl-logistics'] },

    // --- AUTOMOTIVE ---
    { keywords: ['tire', 'tyre', 'rubber'], industry: 'automotive', tags: ['automotive-parts'] },
    { keywords: ['vehicle', 'motor', 'car', 'automobile', 'truck owner'], industry: 'automotive', tags: ['automotive-manufacturing'] },
    { keywords: ['honda', 'toyota', 'nissan', 'mazda', 'subaru'], industry: 'automotive', tags: ['automotive-manufacturing'] },

    // --- SEMICONDUCTORS ---
    { keywords: ['semiconductor', 'wafer', 'chip', 'integrated circuit', 'memory storage', 'nand', 'dram'], industry: 'semiconductors', tags: ['semiconductor-manufacturing'] },
    { keywords: ['semiconductor equipment', 'lithography', 'inspection system'], industry: 'semiconductors', tags: ['semiconductor-equipment'] },
    { keywords: ['intel', 'nvidia', 'amd', 'qualcomm', 'broadcom'], industry: 'semiconductors', tags: ['semiconductor-design'] },

    // --- AEROSPACE ---
    { keywords: ['aerospace', 'aircraft', 'defense', 'avionics', 'jet', 'missile'], industry: 'aerospace-defense', tags: ['aircraft-manufacturing', 'defense-systems'] },
    { keywords: ['boeing', 'airbus', 'lockheed', 'raytheon'], industry: 'aerospace-defense', tags: ['aircraft-manufacturing'] },

    // --- SOFTWARE & SAAS ---
    { keywords: ['software', 'saas', 'cloud', 'platform', 'application', 'data analytics', 'enterprise resource'], industry: 'software-saas', tags: ['enterprise-applications', 'development-platforms'] },
    { keywords: ['crm', 'erp', 'database', 'artificial intelligence', 'machine learning'], industry: 'software-saas', tags: ['enterprise-applications', 'analytics-bi'] },
    { keywords: ['microsoft', 'adobe', 'salesforce', 'oracle', 'sap'], industry: 'software-saas', tags: ['enterprise-applications'] },

    // --- CYBERSECURITY ---
    { keywords: ['security software', 'cybersecurity', 'antivirus', 'firewall', 'identity management'], industry: 'cybersecurity', tags: ['network-security', 'endpoint-security'] },

    // --- FINANCIALS ---
    { keywords: ['bank', 'banking', 'lending', 'deposit', 'credit card'], industry: 'banking', tags: ['commercial-banking', 'retail-banking'] },
    { keywords: ['insurance', 'insurer', 'life insurance', 'property casualty'], industry: 'insurance', tags: ['life-health-insurance', 'property-casualty-insurance'] },
    { keywords: ['asset management', 'investment', 'fund', 'wealth management', 'capital markets'], industry: 'asset-management', tags: ['asset-managers', 'wealth-management'] },
    { keywords: ['fintech', 'payment', 'digital wallet', 'blockchain'], industry: 'fintech', tags: ['payments', 'digital-banking'] },

    // --- ENERGY ---
    { keywords: ['oil', 'gas', 'petroleum', 'drilling', 'pipeline', 'refining'], industry: 'oil-gas', tags: ['upstream-exploration', 'midstream-transport'] },
    { keywords: ['solar', 'photovoltaic', 'renewable energy'], industry: 'solar-energy', tags: ['solar-manufacturing', 'project-development'] },
    { keywords: ['utility', 'utilities', 'electric power', 'grid'], industry: 'utilities', tags: ['electric-utilities', 'grid-infrastructure'] },
    { keywords: ['energy storage', 'battery', 'fuel cell'], industry: 'energy-storage', tags: ['batteries'] },

    // --- HEALTHCARE ---
    { keywords: ['pharmaceutical', 'drug', 'medicine', 'biotech', 'therapy'], industry: 'pharmaceuticals', tags: ['drug-manufacturing'] },
    { keywords: ['medical', 'hospital', 'healthcare', 'clinic'], industry: 'healthcare-services', tags: ['healthcare-providers'] },
    { keywords: ['medical device', 'surgical', 'diagnostic', 'imaging'], industry: 'medical-devices', tags: ['medical-instruments', 'diagnostic-imaging'] },

    // --- REAL ESTATE ---
    { keywords: ['real estate', 'reit', 'property', 'leasing'], industry: 'real-estate', tags: ['commercial-real-estate'] },
    { keywords: ['construction', 'housing', 'building materials', 'cement', 'homebuilder'], industry: 'construction-engineering', tags: ['construction-services', 'building-materials'] },

    // --- RETAIL & CONSUMER ---
    { keywords: ['retail', 'store', 'shop', 'ecommerce', 'marketplace'], industry: 'retail', tags: ['specialty-retail'] },
    { keywords: ['food', 'beverage', 'snack', 'drink', 'dairy', 'brewery'], industry: 'food-beverage', tags: ['packaged-foods', 'beverages'] },
    { keywords: ['consumer', 'apparel', 'clothing', 'fashion', 'household'], industry: 'consumer-products', tags: ['apparel-footwear', 'household-products'] },

    // --- TECH INFRA ---
    { keywords: ['data center', 'hosting', 'colocation'], industry: 'data-centers', tags: ['colocation', 'hyperscale'] },
    { keywords: ['telecom', 'telecommunication', 'wireless', 'broadband', 'cable'], industry: 'telecommunications', tags: ['wireless-carriers', 'network-equipment'] },
]

async function main() {
    console.log('🤖 Starting GLOBAL AI Auto-Tagger...')

    // 1. Fetch ALL companies with pagination
    let allCompanies: any[] = []
    let from = 0
    const step = 999

    while (true) {
        const { data: batch, error } = await supabase
            .from('companies')
            .select('ticker, name, description, industry, value_chain_tags')
            .range(from, from + step)

        if (error) {
            console.error('Error fetching batch:', error)
            break
        }

        if (!batch || batch.length === 0) break

        allCompanies = [...allCompanies, ...batch]
        from += step + 1
    }

    console.log(`Analyzing ALL ${allCompanies.length} companies for tagging improvements...`)

    let updated = 0

    for (const company of allCompanies) {
        const text = ((company.description || '') + ' ' + company.name).toLowerCase()

        // Find best matching rule
        let bestMatch = null

        // Priority: Try to match within EXISTING industry if possible, otherwise global match
        const matches = RULES.filter(r => r.keywords.some(k => text.includes(k)))

        if (matches.length > 0) {
            // Pick best match. 
            // If one matches the current industry, prefer it.
            bestMatch = matches.find(m => m.industry === company.industry) || matches[0]
        }

        // Update if:
        // 1. We found a match
        // 2. AND (Tags are missing OR we want to force update to ensure consistency)
        // The user said "I want all companies from db... properly fits in", so we force update.
        if (bestMatch) {
            const { error: updateError } = await supabase
                .from('companies')
                .update({
                    industry: bestMatch.industry,
                    value_chain_tags: bestMatch.tags
                })
                .eq('ticker', company.ticker)

            if (!updateError) {
                updated++
                process.stdout.write('.')
            }
        }
    }

    console.log(`\n✅ Successfully processed/updated ${updated} companies.`)
}

main()
