/**
 * Fix industry slug mismatches in DB to match frontend structure.ts
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapping: old DB slug -> correct frontend slug
const SLUG_FIXES: Record<string, string> = {
    'aerospace': 'aerospace-defense',  // LLM used "aerospace" but frontend uses "aerospace-defense"
}

async function main() {
    console.log('🔧 Fixing industry slug mismatches...\n')

    for (const [oldSlug, newSlug] of Object.entries(SLUG_FIXES)) {
        console.log(`Updating: "${oldSlug}" -> "${newSlug}"`)

        const { data, error } = await supabase
            .from('companies')
            .update({ industry: newSlug })
            .eq('industry', oldSlug)
            .select('ticker, name')

        if (error) {
            console.error(`  ❌ Error:`, error.message)
        } else {
            console.log(`  ✅ Updated ${data?.length || 0} companies`)
            if (data && data.length > 0) {
                data.slice(0, 5).forEach(c => console.log(`     - ${c.name}`))
                if (data.length > 5) console.log(`     ... and ${data.length - 5} more`)
            }
        }
    }

    console.log('\n✅ Slug fixes complete!')
}

main()
