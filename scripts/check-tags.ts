
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTags() {
    console.log('Checking tags for Japanese companies...');

    // Fetch a mix of companies we know about and random ones
    const tickers = ['7011.T', '7012.T', '7203.T', '9984.T'];

    const { data, error } = await supabase
        .from('companies')
        .select('ticker, name, industry, value_chain_tags')
        .in('ticker', tickers);

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    console.log('Found companies:', data);

    // Also check if any companies have tags at all
    const { data: anyTags, error: tagError } = await supabase
        .from('companies')
        .select('ticker, name, value_chain_tags')
        .eq('country', 'JP')
        .not('value_chain_tags', 'is', null)
        .limit(5);

    if (tagError) {
        console.error("Error checking for any tags:", tagError);
    } else {
        console.log('Sample of ANY Japanese companies with tags:', anyTags);
    }
}

checkTags();
