/**
 * Generic LLM-Powered Industry Classifier
 * dynamically fetches taxonomy from DB and classifies companies.
 * 
 * Usage: npx tsx scripts/reclassify-industry-generic.ts --industry=slug
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const args = process.argv.slice(2)
const industryArg = args.find(a => a.startsWith('--industry='))
const industrySlug = industryArg ? industryArg.split('=')[1] : null

if (!industrySlug) {
    console.error('❌ Please provide an industry slug: --industry=slug')
    process.exit(1)
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fetchTaxonomy(slug: string) {
    const { data: streams, error } = await supabase
        .from('value_chain_streams')
        .select(`
            slug,
            display_name,
            categories:value_chain_categories(
                slug,
                display_name,
                products:value_chain_products(
                    slug,
                    display_name,
                    description
                )
            )
        `)
        .eq('industry', slug)
        .order('sort_order')

    if (error || !streams) {
        throw new Error(`Failed to fetch taxonomy for ${slug}: ${error?.message}`)
    }

    // Transform into clean object for LLM
    const taxonomy: any = {}

    // Sort logic handled in DB or here? DB order is by sort_order but we didn't join securely with sort.
    // Assuming partial sort.

    for (const stream of streams) {
        taxonomy[stream.slug] = {}
        const cats = stream.categories || []

        for (const cat of cats) {
            let tags = (cat.products || []).map((p: any) => p.slug)

            // If no sub-products, the category itself acts as the tag
            if (tags.length === 0) {
                tags = [cat.slug]
            }

            taxonomy[stream.slug][cat.slug] = {
                name: cat.display_name,
                tags: tags
            }
        }
    }

    return taxonomy
}

async function classifyCompany(
    name: string,
    description: string,
    currentTags: string[],
    taxonomy: any
): Promise<{ stream: string, category: string, tags: string[] } | null> {
    const prompt = `You are an expert ${industrySlug} industry analyst. Classify this company into a STRICT taxonomy.
    
    COMPANY: ${name}
    DESCRIPTION: ${description}
    CURRENT TAGS: ${JSON.stringify(currentTags)}

    TAXONOMY RULES:
    1. Select ONE stream from the provided list.
    2. Select ONE primary category ID from that stream.
    3. Select relevant tags from the allowed list for that category.

    ALLOWED TAXONOMY:
    ${JSON.stringify(taxonomy, null, 2)}

    INSTRUCTIONS:
    - If a company does multiple things, pick the DOMINANT category.
    - Select tags ONLY from the specific category you chose.
    - JSON OUTPUT ONLY.

    Example Output:
    {
        "stream": "upstream",
        "category": "raw-materials",
        "tags": ["specific-tag-1"]
    }
    `

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()
        const match = text.match(/\{[\s\S]*?\}/)
        if (match) {
            return JSON.parse(match[0])
        }
    } catch (e) {
        console.error(`Error classifying ${name}:`, e)
    }
    return null
}

async function main() {
    console.log(`🚀 Starting Generic Classification for: ${industrySlug}...\n`)

    // 1. Fetch Taxonomy
    let taxonomy
    try {
        taxonomy = await fetchTaxonomy(industrySlug)
        console.log('📖 Taxonomy loaded from DB.')
    } catch (e: any) {
        console.error(e.message)
        process.exit(1)
    }

    if (Object.keys(taxonomy).length === 0) {
        console.error('❌ Taxonomy is empty! Run migration first.')
        process.exit(1)
    }

    // 2. Fetch Companies
    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .eq('industry', industrySlug)

    if (!companies || companies.length === 0) {
        console.log('⚠️ No companies found in DB for this industry.')
        return
    }

    console.log(`Found ${companies.length} companies to classify.`)

    let updated = 0

    // 3. Classify Loop
    for (const company of companies) {
        console.log(`\nAnalyzing ${company.ticker} (${company.name})...`)

        const result = await classifyCompany(
            company.name,
            company.description || '',
            company.value_chain_tags || [],
            taxonomy
        )

        if (result) {
            // Validate result against taxonomy to prevent hallucinations
            const stream = taxonomy[result.stream]
            if (stream) {
                const cat = stream[result.category]
                if (cat) {
                    const validTags = cat.tags
                    const filteredTags = result.tags.filter(t => validTags.includes(t))

                    if (filteredTags.length === 0 && result.tags.length > 0) {
                        console.warn(`  ⚠️ Hallucinated tags removed: ${result.tags}`)
                    }

                    console.log(`  -> Stream: ${result.stream}`)
                    console.log(`  -> Category: ${result.category}`)
                    console.log(`  -> Tags: ${filteredTags.join(', ')}`)

                    // Update DB
                    const { error } = await supabase
                        .from('companies')
                        .update({
                            stream_slug: result.stream,
                            category_slug: result.category,
                            value_chain_tags: filteredTags
                        })
                        .eq('ticker', company.ticker)

                    if (!error) {
                        console.log('  ✅ Updated DB')
                        updated++
                    } else {
                        console.error('  ❌ DB Error:', error.message)
                    }
                } else {
                    console.error(`  ❌ Invalid Category: ${result.category}`)
                }
            } else {
                console.error(`  ❌ Invalid Stream: ${result.stream}`)
            }
        } else {
            console.log('  ⚠️ Failed to generate valid JSON')
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 200)) // 5 req/sec max (Generative AI limit is higher often)
    }

    console.log(`\n🎉 Done! Updated ${updated} companies for ${industrySlug}.`)
}

main()
