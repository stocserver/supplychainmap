
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function check() {
    const { data: kikkoman } = await supabase.from('companies').select('*').eq('ticker', '2801.T').single()
    const { data: shizuoka } = await supabase.from('companies').select('*').eq('ticker', '5831.T').single()
    console.log('Kikkoman (2801.T):', kikkoman)
    console.log('Shizuoka Financial (5831.T):', shizuoka)
}
check()
