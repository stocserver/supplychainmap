
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log("Migrating 'aerospace' -> 'aerospace-defense'...")

    const { error } = await supabase
        .from('companies')
        .update({ industry: 'aerospace-defense' })
        .eq('industry', 'aerospace')

    if (error) {
        console.error("Error:", error)
    } else {
        console.log("✅ Migration complete.")
    }
}

main()
