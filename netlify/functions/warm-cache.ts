import { Handler, schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";

// Configuration
const CACHE_TTL_SECONDS = 300; // 5 minutes

// Initialize clients
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const redis = new Redis(process.env.REDIS_URL ||
    "redis://default:HDvuHCKtZWhSprrdZYCzbU7mUABaMG7V@redis-10654.c74.us-east-1-4.ec2.cloud.redislabs.com:10654"
);

// Country code to database country filter mapping
const COUNTRY_MAP: Record<string, string[]> = {
    US: ["US", "United States"],
    CN: ["CN", "China", "HK", "Hong Kong"],
    JP: ["JP", "Japan"],
    TW: ["TW", "Taiwan"],
    KR: ["KR", "South Korea", "Korea"],
    EU: [
        "GB", "DE", "FR", "NL", "CH", "IT", "ES", "SE", "DK", "NO", "FI", "BE", "AT", "IE", "PT", "LU",
        "United Kingdom", "Germany", "France", "Netherlands", "Switzerland", "Italy", "Spain",
        "Sweden", "Denmark", "Norway", "Finland", "Belgium", "Austria", "Ireland", "Portugal", "Luxembourg",
    ],
};

const REGIONS = Object.keys(COUNTRY_MAP);

async function fetchCompaniesForRegion(regionCode: string): Promise<any[]> {
    const countryFilter = COUNTRY_MAP[regionCode] || COUNTRY_MAP["US"];

    const { data, error } = await supabase
        .from("companies")
        .select("ticker, name, market_cap, industry, country, logo_url, value_chain_tags, data")
        .gt("market_cap", 0)
        .in("country", countryFilter)
        .order("market_cap", { ascending: false, nullsFirst: false })
        .limit(2000);

    if (error) {
        console.error(`Error fetching ${regionCode}:`, error.message);
        return [];
    }

    // Flatten the data to include only essential financial metrics
    return (data || []).map((c) => ({
        ticker: c.ticker,
        name: c.name,
        market_cap: c.market_cap,
        industry: c.industry,
        country: c.country,
        logo_url: c.logo_url,
        value_chain_tags: c.value_chain_tags,
        revenue: c.data?.incomeStatement?.revenue || 0,
        netIncome: c.data?.incomeStatement?.netIncome || 0,
    }));
}

async function warmCacheForRegion(regionCode: string): Promise<number> {
    const cacheKey = `companies_list_v2_${regionCode}`;
    const companies = await fetchCompaniesForRegion(regionCode);

    if (companies.length > 0) {
        await redis.set(cacheKey, JSON.stringify(companies), "EX", CACHE_TTL_SECONDS);
        return companies.length;
    }

    return 0;
}

async function warmAllCaches(): Promise<{ [key: string]: number }> {
    const results: { [key: string]: number } = {};

    for (const region of REGIONS) {
        const count = await warmCacheForRegion(region);
        results[region] = count;
        console.log(`✅ ${region}: ${count} companies cached`);
    }

    return results;
}

// Scheduled function handler - runs every 5 minutes
const handler: Handler = async (event, context) => {
    console.log("🔥 Cache warming triggered at", new Date().toISOString());

    try {
        const results = await warmAllCaches();

        // Close Redis connection to prevent hanging
        await redis.quit();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Cache warmed successfully",
                timestamp: new Date().toISOString(),
                results,
            }),
        };
    } catch (error: any) {
        console.error("Cache warming failed:", error);
        await redis.quit();

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Cache warming failed",
                error: error.message,
            }),
        };
    }
};

// Export as scheduled function (runs every 5 minutes)
export { handler };
export const config = {
    schedule: "*/5 * * * *",
};
