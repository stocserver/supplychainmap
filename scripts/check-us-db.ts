
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkUS() {
    const { data, error } = await supabase
        .from('companies')
        .select('ticker, name')
        .eq('country', 'US')
        .limit(5);

    console.log('US Companies in DB:', data);

    const { count } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

    console.log('Total Companies in DB:', count);
}
checkUS();
