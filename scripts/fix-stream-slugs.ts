/**
 * Fix missing stream_slug for companies based on their category_slug
 * Maps category_slug to the correct stream
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map category_slug to stream_slug for semiconductors
const semiconductorsCategoryToStream: Record<string, string> = {
    // Upstream
    'ip-design': 'upstream',
    'ic-design': 'upstream',
    'cpu': 'upstream',
    'gpu': 'upstream',
    'ai-accelerators': 'upstream',
    'analog': 'upstream',
    'rf': 'upstream',
    'mobile-soc': 'upstream',
    // Midstream
    'foundries-idms': 'midstream',
    'equipment': 'midstream',
    'dep': 'midstream',
    'litho': 'midstream',
    'etch': 'midstream',
    'inspect': 'midstream',
    'materials': 'midstream',
    'photoresist': 'midstream',
    'gases': 'midstream',
    'wafers': 'midstream',
    'consumables': 'midstream',
    'photomasks': 'midstream',
    'wafer-fab': 'midstream',
    // Downstream
    'packaging': 'downstream',
    'bga': 'downstream',
    'substrates': 'downstream',
    'test': 'downstream',
    'pkg-equip': 'downstream',
    'modules': 'downstream',
    'memory-mods': 'downstream',
    'rf-mods': 'downstream',
    'power-mods': 'downstream',
    'distribution': 'downstream',
    'to-smartphones': 'downstream',
    'to-pc': 'downstream',
    'to-automotive': 'downstream',
    'to-dc': 'downstream',
}

async function main() {
    console.log('🔧 Fixing stream_slug for semiconductor companies...\n')

    // Fetch semiconductor companies without stream_slug
    const { data: companies } = await supabase
        .from('companies')
        .select('ticker, category_slug, value_chain_tags')
        .eq('industry', 'semiconductors')
        .is('stream_slug', null)

    console.log(`Found ${companies?.length || 0} companies without stream_slug`)

    let updated = 0
    for (const company of companies || []) {
        // Determine stream from category_slug or first tag
        const category = company.category_slug || company.value_chain_tags?.[0]
        const stream = semiconductorsCategoryToStream[category]

        if (stream) {
            const { error } = await supabase
                .from('companies')
                .update({ stream_slug: stream })
                .eq('ticker', company.ticker)

            if (!error) {
                console.log(`✅ ${company.ticker}: ${category} → ${stream}`)
                updated++
            } else {
                console.log(`❌ ${company.ticker}: ${error.message}`)
            }
        } else {
            console.log(`⚠️ ${company.ticker}: Unknown category '${category}'`)
        }
    }

    console.log(`\n✅ Updated ${updated} companies`)
}

main()
