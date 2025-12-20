
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkCoverage() {
    const { data: allCompanies, error } = await supabase
        .from('companies')
        .select('ticker, country, value_chain_tags');

    if (error || !allCompanies) {
        console.log("Error:", error);
        return;
    }

    let tagged = 0;
    let untagged = 0;
    const byCountry: Record<string, { tagged: number, untagged: number }> = {};

    allCompanies.forEach(c => {
        const hasTags = c.value_chain_tags && c.value_chain_tags.length > 0;
        const country = c.country || 'Unknown';

        if (!byCountry[country]) byCountry[country] = { tagged: 0, untagged: 0 };

        if (hasTags) {
            tagged++;
            byCountry[country].tagged++;
        } else {
            untagged++;
            byCountry[country].untagged++;
        }
    });

    console.log(`\n📊 Database Coverage Analysis:`);
    console.log(`Total Companies: ${allCompanies.length}`);
    console.log(`✅ Tagged: ${tagged} (${((tagged / allCompanies.length) * 100).toFixed(1)}%)`);
    console.log(`⚠️ Untagged: ${untagged} (${((untagged / allCompanies.length) * 100).toFixed(1)}%)`);

    console.log(`\n🌍 Breakdown by Country:`);
    Object.keys(byCountry).forEach(c => {
        const stats = byCountry[c];
        console.log(`[${c}] Tagged: ${stats.tagged} | Untagged: ${stats.untagged}`);
    });

    // Show a few examples of untagged companies
    const untaggedExamples = allCompanies.filter(c => !c.value_chain_tags || c.value_chain_tags.length === 0).slice(0, 5);
    console.log('\n🔍 Examples of Untagged Companies:', untaggedExamples.map(c => c.ticker));
}

checkCoverage();
