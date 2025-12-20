/**
 * Add fake heavy-industry companies to test dynamic categories
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const fakeCompanies = [
    // Upstream - Materials & Engineering
    {
        ticker: 'HEAVY1',
        name: 'Steel Dragon Corp',
        industry: 'heavy-industry',
        country: 'US',
        stream_slug: 'upstream',
        category_slug: 'steel-metals',
        value_chain_tags: ['steel-metals', 'specialty-alloys']
    },
    {
        ticker: 'HEAVY2',
        name: 'Engineering Masters Inc',
        industry: 'heavy-industry',
        country: 'US',
        stream_slug: 'upstream',
        category_slug: 'engineering-services',
        value_chain_tags: ['engineering-services', 'plant-design']
    },
    {
        ticker: 'HEAVY3',
        name: 'Mega Materials Ltd',
        industry: 'heavy-industry',
        country: 'US',
        stream_slug: 'upstream',
        category_slug: 'steel-metals',
        value_chain_tags: ['steel-metals', 'carbon-fiber']
    },
    // Midstream - Manufacturing
    {
        ticker: 'HEAVY4',
        name: 'Ocean Shipbuilders',
        industry: 'heavy-industry',
        country: 'US',
        stream_slug: 'midstream',
        category_slug: 'shipbuilding',
        value_chain_tags: ['shipbuilding', 'naval-vessels']
    },
    {
        ticker: 'HEAVY5',
        name: 'Turbine Power Systems',
        industry: 'heavy-industry',
        country: 'US',
        stream_slug: 'midstream',
        category_slug: 'power-systems',
        value_chain_tags: ['power-systems', 'gas-turbines']
    },
    {
        ticker: 'HEAVY6',
        name: 'Factory Robotics Inc',
        industry: 'heavy-industry',
        country: 'US',
        stream_slug: 'midstream',
        category_slug: 'industrial-machinery',
        value_chain_tags: ['industrial-machinery', 'factory-robots']
    },
    // Downstream - Infrastructure
    {
        ticker: 'HEAVY7',
        name: 'Plant Builders Global',
        industry: 'heavy-industry',
        country: 'US',
        stream_slug: 'downstream',
        category_slug: 'plant-construction',
        value_chain_tags: ['plant-construction', 'energy-plants']
    },
    {
        ticker: 'HEAVY8',
        name: 'Rail Systems Corp',
        industry: 'heavy-industry',
        country: 'US',
        stream_slug: 'downstream',
        category_slug: 'rail-rolling-stock',
        value_chain_tags: ['rail-rolling-stock', 'high-speed-rail']
    },
    {
        ticker: 'HEAVY9',
        name: 'Infrastructure Titans',
        industry: 'heavy-industry',
        country: 'US',
        stream_slug: 'downstream',
        category_slug: 'plant-construction',
        value_chain_tags: ['plant-construction', 'chemical-plants']
    },
]

async function main() {
    console.log('Adding 9 fake heavy-industry companies...\n')

    for (const company of fakeCompanies) {
        const { error } = await supabase
            .from('companies')
            .upsert(company, { onConflict: 'ticker' })

        if (error) {
            console.log(`❌ ${company.ticker}: ${error.message}`)
        } else {
            console.log(`✅ ${company.ticker}: ${company.name} (${company.stream_slug})`)
        }
    }

    console.log('\n✅ Done! Check /industries/heavy-industry')
}

main()
