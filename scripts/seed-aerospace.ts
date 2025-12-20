
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const AEROSPACE_COMPANIES = [
    // MANUFACTURERS
    { ticker: 'BA', name: 'Boeing', country: 'US', tags: ['aircraft-manufacturing', 'commercial-aircraft', 'defense-systems', 'fighter-aircraft'] },
    { ticker: 'LMT', name: 'Lockheed Martin', country: 'US', tags: ['defense-systems', 'fighter-aircraft', 'missile-systems'] },
    { ticker: 'NOC', name: 'Northrop Grumman', country: 'US', tags: ['defense-systems', 'fighter-aircraft', 'space-systems'] },
    { ticker: 'GD', name: 'General Dynamics', country: 'US', tags: ['defense-systems', 'business-jets'] },
    { ticker: 'TXT', name: 'Textron', country: 'US', tags: ['business-jets', 'defense-systems'] },
    { ticker: 'ERJ', name: 'Embraer', country: 'US', tags: ['aircraft-manufacturing', 'commercial-aircraft', 'business-jets'] }, // ADR but treats as US often in lists

    // SYSTEMS & COMPONENTS
    { ticker: 'RTX', name: 'RTX Corp (Raytheon)', country: 'US', tags: ['aerospace-components', 'aircraft-engines', 'defense-systems', 'missile-systems'] },
    { ticker: 'GE', name: 'GE Aerospace', country: 'US', tags: ['aerospace-components', 'aircraft-engines'] },
    { ticker: 'HON', name: 'Honeywell', country: 'US', tags: ['aerospace-components', 'avionics-systems'] },
    { ticker: 'TDG', name: 'TransDigm', country: 'US', tags: ['aerospace-components'] },
    { ticker: 'HWM', name: 'Howmet Aerospace', country: 'US', tags: ['aerospace-components', 'raw-materials', 'titanium-alloys'] },
    { ticker: 'SPR', name: 'Spirit AeroSystems', country: 'US', tags: ['aerospace-components', 'aircraft-manufacturing'] },
    { ticker: 'LII', name: 'Lennox (Heatcraft)', country: 'US', tags: ['aerospace-components'] },
    { ticker: 'LHX', name: 'L3Harris', country: 'US', tags: ['defense-systems', 'avionics-systems'] },

    // AIRLINES
    { ticker: 'DAL', name: 'Delta Air Lines', country: 'US', tags: ['airlines', 'legacy-carriers'] },
    { ticker: 'UAL', name: 'United Airlines', country: 'US', tags: ['airlines', 'legacy-carriers'] },
    { ticker: 'AAL', name: 'American Airlines', country: 'US', tags: ['airlines', 'legacy-carriers'] },
    { ticker: 'LUV', name: 'Southwest Airlines', country: 'US', tags: ['airlines', 'low-cost-carriers'] },
]

async function seed() {
    console.log('✈️  Seeding Aerospace & Defense companies...')

    for (const co of AEROSPACE_COMPANIES) {
        const { error } = await supabase
            .from('companies')
            .upsert({
                ticker: co.ticker,
                name: co.name,
                country: co.country,
                industry: 'aerospace-defense',
                value_chain_tags: co.tags,
                is_featured: true,
                updated_at: new Date().toISOString()
            }, { onConflict: 'ticker' })

        if (error) {
            console.error(`❌ Error seeding ${co.ticker}:`, error.message)
        } else {
            console.log(`✅ Seeded ${co.name} (${co.ticker})`)
        }
    }
}

seed()
