
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Mapping for formerly "Unclassified" companies
// Based on recognizable names from the list
const REMAINING_MAPPING: Record<string, { tags: string[], industry: string }> = {
    // --- TECH & ELECTRONICS ---
    '6702.T': { tags: ['data-infrastructure', 'ai-services', 'cloud-platforms'], industry: 'ai-ml' }, // Fujitsu
    '6701.T': { tags: ['telecommunications', 'security-hardware', 'biometrics'], industry: 'cybersecurity' }, // NEC
    '4755.T': { tags: ['ecommerce', 'fintech', 'mobile-carriers'], industry: 'ecommerce' }, // Rakuten
    '4689.T': { tags: ['digital-services', 'search', 'messaging'], industry: 'media-entertainment' }, // LY Corp (Yahoo/Line)
    '4716.T': { tags: ['enterprise-software', 'cloud-databases'], industry: 'cloud-computing' }, // Oracle Japan
    '9613.T': { tags: ['it-services', 'consulting'], industry: 'software-saas' }, // NTT DATA
    '9766.T': { tags: ['gaming', 'media'], industry: 'media-entertainment' }, // Konami
    '3659.T': { tags: ['mobile-gaming'], industry: 'media-entertainment' }, // Nexon
    '4751.T': { tags: ['media', 'advertising', 'gaming'], industry: 'media-entertainment' }, // CyberAgent
    '6724.T': { tags: ['electronics', 'robotics'], industry: 'robotics-automation' }, // Epson (Seiko Epson)
    '7751.T': { tags: ['medical-imaging', 'office-equipment'], industry: 'medical-devices' }, // Canon
    '7752.T': { tags: ['office-services', 'digital-transformaton'], industry: 'software-saas' }, // Ricoh
    '7733.T': { tags: ['medical-devices', 'endoscopes'], industry: 'medical-devices' }, // Olympus
    '6448.T': { tags: ['industrial-machinery', 'printers'], industry: 'consumer-products' }, // Brother Industries
    '6845.T': { tags: ['building-automation'], industry: 'robotics-automation' }, // Azbil

    // --- FOOD & BEVERAGE ---
    '2503.T': { tags: ['beverages', 'alcohol'], industry: 'food-beverage' }, // Kirin
    '2502.T': { tags: ['beverages', 'alcohol'], industry: 'food-beverage' }, // Asahi
    '2587.T': { tags: ['beverages', 'soft-drinks'], industry: 'food-beverage' }, // Suntory B&F
    '2802.T': { tags: ['packaged-food', 'seasonings'], industry: 'food-beverage' }, // Ajinomoto
    '2897.T': { tags: ['packaged-food', 'noodles'], industry: 'food-beverage' }, // Nissin Foods
    '2267.T': { tags: ['probiotics', 'beverages'], industry: 'food-beverage' }, // Yakult
    '2282.T': { tags: ['meat-processing'], industry: 'food-beverage' }, // NH Foods
    '2212.T': { tags: ['baked-goods'], industry: 'food-beverage' }, // Yamazaki Baking
    '2914.T': { tags: ['tobacco', 'alternatives'], industry: 'consumer-products' }, // Japan Tobacco

    // --- CONSUMER & RETAIL ---
    '4452.T': { tags: ['personal-care', 'cosmetics', 'chemicals'], industry: 'consumer-products' }, // Kao
    '4911.T': { tags: ['cosmetics', 'luxury'], industry: 'consumer-products' }, // Shiseido
    '8113.T': { tags: ['personal-care', 'hygiene'], industry: 'consumer-products' }, // Unicharm
    '8267.T': { tags: ['retail', 'supermarkets', 'malls'], industry: 'retail' }, // AEON
    '3382.T': { tags: ['convenience-stores'], industry: 'retail' }, // Seven & i (Refined)
    '2702.T': { tags: ['restaurants'], industry: 'hospitality' }, // McDonald's Japan
    '3563.T': { tags: ['restaurants', 'sushi'], industry: 'hospitality' }, // Food & Life (Sushiro)
    '3088.T': { tags: ['drugstores'], industry: 'retail' }, // MatsukiyoCocokara
    '9843.T': { tags: ['furniture', 'retail'], industry: 'retail' }, // Nitori
    '8227.T': { tags: ['apparel', 'retail'], industry: 'retail' }, // Shimamura
    '2670.T': { tags: ['retail', 'footwear'], industry: 'retail' }, // ABC-Mart
    '7532.T': { tags: ['retail', 'discount'], industry: 'retail' }, // Pan Pacific (Don Quijote)

    // --- TRANSPORTATION ---
    '9020.T': { tags: ['rail', 'transportation'], industry: 'transportation-logistics' }, // JR East
    '9022.T': { tags: ['rail', 'transportation'], industry: 'transportation-logistics' }, // JR Central
    '9101.T': { tags: ['marine-shipping', 'logistics'], industry: 'transportation-logistics' }, // NYK Line
    '9104.T': { tags: ['marine-shipping', 'logistics'], industry: 'transportation-logistics' }, // Mitsui OSK
    '9064.T': { tags: ['logistics', 'delivery'], industry: 'transportation-logistics' }, // Yamato
    '9202.T': { tags: ['airlines', 'passenger-transport'], industry: 'transportation-logistics' }, // ANA
    '9201.T': { tags: ['airlines', 'passenger-transport'], industry: 'transportation-logistics' }, // JAL

    // --- MATERIALS & INDUSTRY ---
    '5401.T': { tags: ['steel-production'], industry: 'mining-materials' }, // Nippon Steel
    '5406.T': { tags: ['steel-production', 'machinery'], industry: 'mining-materials' }, // Kobe Steel
    '6301.T': { tags: ['construction-machinery', 'mining-equipment'], industry: 'construction-engineering' }, // Komatsu
    '6326.T': { tags: ['agricultural-machinery', 'water'], industry: 'agtech' }, // Kubota
    '6367.T': { tags: ['transport-solutions', 'hvac'], industry: 'construction-engineering' }, // Daikin
    '6988.T': { tags: ['industrial-materials', 'tapes'], industry: 'chemicals' }, // Nitto Denko
    '4063.T': { tags: ['chemicals', 'wafers'], industry: 'semiconductors' }, // Shin-Etsu (Refined)
    '4188.T': { tags: ['chemicals', 'plastics'], industry: 'chemicals' }, // Mitsubishi Chemical
    '3402.T': { tags: ['chemicals', 'fibers', 'housing'], industry: 'chemicals' }, // Toray
    '5020.T': { tags: ['oil-gas', 'energy'], industry: 'oil-gas' }, // ENEOS
    '1605.T': { tags: ['oil-gas', 'exploration'], industry: 'oil-gas' }, // Inpex
    '5201.T': { tags: ['glass', 'chemicals'], industry: 'chemicals' }, // AGC

    // --- REAL ESTATE & CONSTRUCTION ---
    '8801.T': { tags: ['commercial-real-estate'], industry: 'real-estate' }, // Mitsui Fudosan
    '8802.T': { tags: ['commercial-real-estate'], industry: 'real-estate' }, // Mitsubishi Estate
    '8830.T': { tags: ['residential-real-estate'], industry: 'real-estate' }, // Sumitomo Realty
    '1925.T': { tags: ['residential-construction'], industry: 'construction-engineering' }, // Daiwa House
    '1928.T': { tags: ['residential-construction'], industry: 'construction-engineering' }, // Sekisui House
    '1801.T': { tags: ['construction-engineering'], industry: 'construction-engineering' }, // Taisei
    '1803.T': { tags: ['construction-engineering'], industry: 'construction-engineering' }, // Shimizu
    '8951.T': { tags: ['reit'], industry: 'real-estate' }, // Nippon Building Fund
    '3281.T': { tags: ['reit', 'logistics'], industry: 'real-estate' }, // GLP J-REIT

    // --- FINANCE (Others) ---
    '8591.T': { tags: ['leasing', 'financial-services'], industry: 'financials' }, // ORIX
    '8766.T': { tags: ['insurance', 'property-casualty'], industry: 'insurance' }, // Tokio Marine
    '8725.T': { tags: ['insurance', 'property-casualty'], industry: 'insurance' }, // MS&AD
    '8630.T': { tags: ['insurance', 'property-casualty'], industry: 'insurance' }, // Sompo
    '8750.T': { tags: ['insurance', 'life-health'], industry: 'insurance' }, // Dai-ichi Life
    '7182.T': { tags: ['banking', 'postal-services'], industry: 'banking' }, // Japan Post Bank
    '6178.T': { tags: ['conglomerate', 'logistics', 'finance'], industry: 'transportation-logistics' }, // Japan Post Holdings
    '8473.T': { tags: ['fintech', 'investment'], industry: 'fintech' }, // SBI Holdings
}

async function classifyRemaining() {
    console.log('🇯🇵 Classifying Remaining JP Companies (Batch 2)...')

    let updated = 0
    let errors = 0

    for (const [ticker, data] of Object.entries(REMAINING_MAPPING)) {
        const { error } = await supabase
            .from('companies')
            .update({
                value_chain_tags: data.tags,
                industry: data.industry,
                is_featured: true,
                updated_at: new Date().toISOString()
            })
            .eq('ticker', ticker)

        if (error) {
            console.error(`❌ Error updating ${ticker}:`, error.message)
            errors++
        } else {
            updated++
        }
    }

    console.log(`\n✨ Classification complete! Updated ${updated} more companies. Errors: ${errors}`)
}

classifyRemaining()
