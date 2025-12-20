import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log('Fetching all companies...')

    // Paginate to get all
    let allCompanies: any[] = []
    let from = 0
    const step = 999

    while (true) {
        const { data: batch, error } = await supabase
            .from('companies')
            .select('ticker, name, description, industry, value_chain_tags, country, market_cap')
            .range(from, from + step)

        if (error) {
            console.error('Error:', error)
            break
        }
        if (!batch || batch.length === 0) break
        allCompanies = [...allCompanies, ...batch]
        from += step + 1
    }

    console.log(`Fetched ${allCompanies.length} companies total.`)

    // Split by country
    const jpCompanies = allCompanies.filter(c => c.country === 'JP')
    const usCompanies = allCompanies.filter(c => c.country === 'US')
    const otherCompanies = allCompanies.filter(c => c.country !== 'JP' && c.country !== 'US')

    console.log(`JP: ${jpCompanies.length}, US: ${usCompanies.length}, Other: ${otherCompanies.length}`)

    // Format for readability
    const format = (companies: any[]) => companies.map(c => ({
        ticker: c.ticker,
        name: c.name,
        industry: c.industry,
        tags: c.value_chain_tags,
        market_cap: c.market_cap,
        desc: c.description ? c.description.substring(0, 100) : null
    }))

    // Group by industry for easier review
    const groupByIndustry = (companies: any[]) => {
        const grouped: Record<string, any[]> = {}
        companies.forEach(c => {
            const ind = c.industry || 'UNKNOWN'
            if (!grouped[ind]) grouped[ind] = []
            grouped[ind].push(c)
        })
        return grouped
    }

    // Save
    const jpPath = path.resolve(__dirname, 'dump_jp_companies.json')
    const usPath = path.resolve(__dirname, 'dump_us_companies.json')

    fs.writeFileSync(jpPath, JSON.stringify(groupByIndustry(format(jpCompanies)), null, 2))
    fs.writeFileSync(usPath, JSON.stringify(groupByIndustry(format(usCompanies)), null, 2))

    console.log(`Saved JP data to ${jpPath}`)
    console.log(`Saved US data to ${usPath}`)
}

main()
