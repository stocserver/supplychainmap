
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!)

async function main() {
    const ticker = process.argv[2] || '5020.T'
    console.log(`Inspecting ${ticker}...`)

    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('ticker', ticker)
        .single()

    if (error) console.error(error)
    else console.log(JSON.stringify(data, null, 2))
}

main()
