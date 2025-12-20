
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    console.log('Fetching all companies with missing tags...')

    const { data: companies, error } = await supabase
        .from('companies')
        .select('ticker, name, description, industry, value_chain_tags')
        .or('value_chain_tags.is.null,value_chain_tags.eq.{}')
        .order('industry', { ascending: true })

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log(`Found ${companies.length} untagged companies.`)

    // Group by industry for easier analysis
    const grouped: Record<string, any[]> = {}
    companies.forEach(c => {
        const ind = c.industry || 'Unknown'
        if (!grouped[ind]) grouped[ind] = []
        grouped[ind].push({
            ticker: c.ticker,
            name: c.name,
            desc: c.description ? c.description.substring(0, 150) + "..." : "No description"
        })
    })

    const outputPath = path.resolve(__dirname, 'untagged_dump.json')
    fs.writeFileSync(outputPath, JSON.stringify(grouped, null, 2))
    console.log(`Saved report to ${outputPath}`)
}

main()
