
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function check() {
    // Fetch ALL JP companies
    const { data } = await supabase
        .from('companies')
        .select('ticker, name')
        .eq('country', 'JP')

    if (data) {
        console.log(`Found ${data.length} companies.`)
        // Print in a format I can easily copy-paste into my prompt/context
        console.log(JSON.stringify(data, null, 2))
    }
}
check()
