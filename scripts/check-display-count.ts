
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkCount() {
    const { count, error } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('country', 'JP')
        .gt('market_cap', 0); // Replicating the frontend filter

    console.log(`Japan Companies with Market Cap > 0: ${count}`);
    if (error) console.error(error);
}
checkCount();
