
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!)

// Comprehensive Manual Mapping of Japanese Companies
// Format: Ticker: { tags: [], industry: '' }
const JP_MAPPING: Record<string, { tags: string[], industry: string }> = {
    // --- SEMICONDUCTORS ---
    '8035.T': { tags: ['production-equipment', 'wafer-manufacturing'], industry: 'semiconductors' }, // Tokyo Electron
    '6857.T': { tags: ['production-equipment', 'packaging-testing'], industry: 'semiconductors' }, // Advantest
    '4063.T': { tags: ['chemicals', 'wafer-manufacturing'], industry: 'semiconductors' }, // Shin-Etsu
    '3436.T': { tags: ['chemicals', 'wafer-manufacturing'], industry: 'semiconductors' }, // SUMCO
    '6723.T': { tags: ['ic-design', 'automotive-chips', 'semiconductors'], industry: 'semiconductors' }, // Renesas
    '6920.T': { tags: ['production-equipment'], industry: 'semiconductors' }, // Lasertec
    '6146.T': { tags: ['production-equipment', 'packaging-equipment'], industry: 'semiconductors' }, // Disco
    '7735.T': { tags: ['production-equipment'], industry: 'semiconductors' }, // Screen Holdings
    '7729.T': { tags: ['production-equipment'], industry: 'semiconductors' }, // Tokyo Seimitsu
    '6963.T': { tags: ['semiconductors', 'power-management-ics'], industry: 'semiconductors' }, // Rohm
    '6752.T': { tags: ['batteries', 'electronics'], industry: 'consumer-products' }, // Panasonic (Cross-industry)
    '6503.T': { tags: ['power-electronics', 'infrastructure'], industry: 'transportation-logistics' }, // Mitsubishi Electric
    '6501.T': { tags: ['infrastructure', 'transportation'], industry: 'transportation-logistics' }, // Hitachi

    // --- AUTOMOTIVE ---
    '7203.T': { tags: ['auto-manufacturing', 'mass-market', 'traditional-oems'], industry: 'automotive' }, // Toyota
    '7267.T': { tags: ['auto-manufacturing', 'mass-market', 'traditional-oems'], industry: 'automotive' }, // Honda
    '7201.T': { tags: ['auto-manufacturing', 'mass-market', 'traditional-oems'], industry: 'automotive' }, // Nissan
    '7269.T': { tags: ['auto-manufacturing', 'mass-market'], industry: 'automotive' }, // Suzuki
    '7270.T': { tags: ['auto-manufacturing', 'mass-market'], industry: 'automotive' }, // Subaru
    '7261.T': { tags: ['auto-manufacturing', 'mass-market'], industry: 'automotive' }, // Mazda
    '7202.T': { tags: ['auto-manufacturing', 'commercial-vehicles'], industry: 'automotive' }, // Isuzu
    '7205.T': { tags: ['auto-manufacturing', 'commercial-vehicles'], industry: 'automotive' }, // Hino
    '6902.T': { tags: ['auto-parts-suppliers', 'electronics'], industry: 'automotive' }, // Denso
    '7259.T': { tags: ['auto-parts-suppliers', 'engine-components'], industry: 'automotive' }, // Aisin
    '5108.T': { tags: ['tires'], industry: 'automotive' }, // Bridgestone
    '5101.T': { tags: ['tires'], industry: 'automotive' }, // Yokohama Rubber

    // --- ROBOTICS & AUTOMATION ---
    '6954.T': { tags: ['industrial-robots', 'sensors-actuators'], industry: 'robotics-automation' }, // Fanuc
    '6506.T': { tags: ['industrial-robots'], industry: 'robotics-automation' }, // Yaskawa
    '6383.T': { tags: ['warehouse-automation'], industry: 'robotics-automation' }, // Daifuku
    '6861.T': { tags: ['sensors-actuators'], industry: 'robotics-automation' }, // Keyence
    '6273.T': { tags: ['sensors-actuators', 'pneumatics'], industry: 'robotics-automation' }, // SMC
    '6645.T': { tags: ['sensors-actuators', 'diagnostics'], industry: 'robotics-automation' }, // Omron

    // --- CONSUMER & RETAIL ---
    '9983.T': { tags: ['apparel', 'retail'], industry: 'retail' }, // Fast Retailing (Uniqlo)
    '3382.T': { tags: ['retail', 'convenience-stores'], industry: 'retail' }, // Seven & i Holdings
    '8002.T': { tags: ['trading-companies', 'food-beverage'], industry: 'food-beverage' }, // Marubeni
    '8001.T': { tags: ['trading-companies', 'retail'], industry: 'retail' }, // Itochu
    '8031.T': { tags: ['trading-companies', 'energy'], industry: 'energy-materials' }, // Mitsui
    '8053.T': { tags: ['trading-companies', 'materials'], industry: 'mining-materials' }, // Sumitomo Corp
    '8058.T': { tags: ['trading-companies', 'materials'], industry: 'mining-materials' }, // Mitsubishi Corp
    '7974.T': { tags: ['gaming', 'media-entertainment', 'consumer-products'], industry: 'media-entertainment' }, // Nintendo
    '6758.T': { tags: ['media-entertainment', 'gaming', 'electronics'], industry: 'media-entertainment' }, // Sony

    // --- PHARMACEUTICALS ---
    '4502.T': { tags: ['drug-development', 'manufacturing'], industry: 'pharmaceuticals' }, // Takeda
    '4503.T': { tags: ['drug-development', 'manufacturing'], industry: 'pharmaceuticals' }, // Astellas
    '4519.T': { tags: ['drug-development', 'manufacturing'], industry: 'pharmaceuticals' }, // Chugai
    '4568.T': { tags: ['drug-development', 'manufacturing'], industry: 'pharmaceuticals' }, // Daiichi Sankyo
    '4523.T': { tags: ['drug-development', 'manufacturing'], industry: 'pharmaceuticals' }, // Eisai
    '4507.T': { tags: ['drug-development', 'manufacturing'], industry: 'pharmaceuticals' }, // Shionogi
    '4578.T': { tags: ['drug-development', 'manufacturing'], industry: 'pharmaceuticals' }, // Otsuka

    // --- BANKING & FINANCE ---
    '8306.T': { tags: ['commercial-banking', 'corporate-lending', 'investment-banking'], industry: 'banking' }, // MUFG
    '8316.T': { tags: ['commercial-banking', 'corporate-lending', 'investment-banking'], industry: 'banking' }, // SMFG
    '8411.T': { tags: ['commercial-banking', 'corporate-lending'], industry: 'banking' }, // Mizuho
    '8604.T': { tags: ['investment-banking', 'wealth-management'], industry: 'financials' }, // Nomura
    '8601.T': { tags: ['investment-banking', 'wealth-management'], industry: 'financials' }, // Daiwa

    // --- TELECOM ---
    '9432.T': { tags: ['carriers', 'infrastructure'], industry: 'telecommunications' }, // NTT
    '9433.T': { tags: ['carriers', 'infrastructure'], industry: 'telecommunications' }, // KDDI
    '9984.T': { tags: ['telecommunications', 'asset-management', 'tech-investor'], industry: 'telecommunications' }, // SoftBank Group
    '9434.T': { tags: ['carriers'], industry: 'telecommunications' }, // SoftBank Corp

    // --- ELECTRONIC COMPONENTS ---
    '6981.T': { tags: ['electronics', 'passive-components'], industry: 'semiconductors' }, // Murata
    '6762.T': { tags: ['electronics', 'passive-components'], industry: 'semiconductors' }, // TDK
    '6971.T': { tags: ['electronics', 'passive-components'], industry: 'semiconductors' }, // Kyocera
    '6594.T': { tags: ['electronics', 'motors'], industry: 'robotics-automation' }, // Nidec

    // --- CHEMICALS ---
    '4183.T': { tags: ['chemicals', 'specialty'], industry: 'chemicals' }, // Mitsui Chemicals
    '3407.T': { tags: ['chemicals', 'specialty'], industry: 'chemicals' }, // Asahi Kasei
    '3405.T': { tags: ['chemicals', 'specialty'], industry: 'chemicals' }, // Kuraray
    '4005.T': { tags: ['chemicals', 'specialty'], industry: 'chemicals' }, // Sumitomo Chemical

    // --- MACHINERY & HEAVY INDUSTRY ---
    '6301.T': { tags: ['construction-engineering', 'infrastructure'], industry: 'construction-engineering' }, // Komatsu
    '7011.T': { tags: ['defense', 'infrastructure', 'aerospace'], industry: 'aerospace-defense' }, // Mitsubishi Heavy Industries
    '7012.T': { tags: ['defense', 'infrastructure', 'aerospace'], industry: 'aerospace-defense' }, // Kawasaki Heavy Industries
    '7013.T': { tags: ['defense', 'infrastructure', 'marine'], industry: 'aerospace-defense' }, // IHI
}

async function classify() {
    console.log('🇯🇵 Classifying Japanese Companies (Agent Mode)...')

    let updated = 0
    let errors = 0

    for (const [ticker, data] of Object.entries(JP_MAPPING)) {
        const { error } = await supabase
            .from('companies')
            .update({
                value_chain_tags: data.tags,
                industry: data.industry,
                is_featured: true, // Key companies are featured
                updated_at: new Date().toISOString()
            })
            .eq('ticker', ticker)

        if (error) {
            console.error(`❌ Error updating ${ticker}:`, error.message)
            errors++
        } else {
            process.stdout.write('.')
            updated++
        }
    }

    console.log(`\n✨ Classification complete! Updated ${updated} key Japanese companies. Errors: ${errors}`)
}

classify()
