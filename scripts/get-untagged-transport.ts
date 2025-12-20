
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

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
    const { data: companies, error } = await supabase
        .from('companies')
        .select('ticker, name, description, industry, value_chain_tags')
        // We are looking for Transportation-Logistics industry
        .ilike('industry', '%transport%')
    //.is('value_chain_tags', null)

    // We can also check for empty array if your DB uses that
    // .eq('value_chain_tags', '{}') 

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log(`Found ${companies.length} untagged companies.`)
    console.log(JSON.stringify(companies, null, 2))
}

main()
