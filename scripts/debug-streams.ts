
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    // Check streams
    const { data: streams } = await supabase
        .from('value_chain_streams')
        .select('*')
        .eq('industry', 'agtech')

    console.log("Streams:", streams)
}

main()
