
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log('🔍 Verifying LAC tags...')
    const { data } = await supabase.from('companies').select('*').eq('ticker', 'LAC').single()
    console.log('Result:', data)
}

main()
