
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing environment variables')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Manual Mapping of Key JP Companies
const JP_TAGS: Record<string, string[]> = {
    // SEMICONDUCTORS
    '8035.T': ['production-equipment', 'wafer-manufacturing'], // Tokyo Electron
    '6857.T': ['production-equipment', 'packaging-testing', 'packaging-equipment'], // Advantest
    '4063.T': ['chemicals', 'wafer-manufacturing'], // Shin-Etsu
    '3436.T': ['chemicals', 'wafer-manufacturing'], // SUMCO
    '6723.T': ['ic-design', 'automotive-chips', 'semiconductors'], // Renesas
    '6920.T': ['production-equipment'], // Lasertec
    '6146.T': ['production-equipment', 'packaging-equipment'], // Disco
    '7735.T': ['production-equipment'], // Screen
    '7729.T': ['production-equipment'], // Tokyo Seimitsu
    '6963.T': ['semiconductors'], // Rohm

    // AUTOMOTIVE
    '7203.T': ['auto-manufacturing', 'mass-market', 'traditional-oems', 'vehicle-manufacturing'], // Toyota
    '7267.T': ['auto-manufacturing', 'mass-market', 'traditional-oems', 'vehicle-manufacturing'], // Honda
    '7201.T': ['auto-manufacturing', 'mass-market', 'traditional-oems', 'vehicle-manufacturing'], // Nissan
    '6902.T': ['auto-parts-suppliers', 'electronics'], // Denso
    '7259.T': ['auto-parts-suppliers', 'engine-components'], // Aisin
    '5108.T': ['tires'], // Bridgestone

    // ROBOTICS & AUTOMATION
    '6954.T': ['industrial-robots', 'sensors-actuators'], // Fanuc
    '6506.T': ['industrial-robots'], // Yaskawa
    '6383.T': ['warehouse-automation'], // Daifuku
    '6861.T': ['sensors-actuators'], // Keyence
    '6273.T': ['sensors-actuators'], // SMC

    // TELECOM & OTHERS
    '9984.T': ['telecommunications', 'asset-management'], // SoftBank
    '9432.T': ['telecommunications', 'infrastructure'], // NTT
    '6758.T': ['media-entertainment', 'gaming', 'consumer-products'], // Sony
    '7974.T': ['gaming', 'media-entertainment'], // Nintendo
    '8058.T': ['trading-companies', 'materials'], // Mitsubishi Corp (Sogo Shosha) - loose mapping
}

async function tagCompanies() {
    console.log('🏷️  Applying tags to Japanese companies...')

    let success = 0
    let errors = 0

    for (const [ticker, tags] of Object.entries(JP_TAGS)) {
        // We use UPDATE because companies should already exist from seed
        // We also set 'is_featured' to true for these key players
        const { error } = await supabase
            .from('companies')
            .update({
                value_chain_tags: tags,
                is_featured: true,
                updated_at: new Date().toISOString()
            })
            .eq('ticker', ticker)

        if (error) {
            console.error(`❌ Error tagging ${ticker}:`, error.message)
            errors++
        } else {
            // console.log(`✅ Tagged ${ticker}`)
            process.stdout.write('.')
            success++
        }
    }

    console.log(`\n✨ Tagging complete! Updated ${success} companies. Errors: ${errors}`)
}

tagCompanies()
