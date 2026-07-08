import { supabaseServer } from '@/lib/supabase/server'
import type { ValueChainStageProducts, ProductCategory } from './industries'
import { normalizeCompanyClassification } from './company-format'

/**
 * Fetch value chain structure dynamically from company data.
 * Categories and products are generated from company tags, not predefined tables.
 * 
 * Flow:
 * 1. Fetch streams for industry (fixed: upstream/midstream/downstream)
 * 2. Fetch companies for industry
 * 3. Group companies by their category_slug OR first tag -> Categories
 * 4. Group by remaining tags -> Sub-products
 */
// Helper to map DB company to frontend format
const mapCompany = (co: {
    name: string;
    ticker: string;
    country: string;
    value_chain_tags: string[] | null;
}) => ({
    name: co.name,
    ticker: co.ticker,
    listing: (co.country === 'US' ? 'US' : 'Foreign') as 'US' | 'ADR' | 'Foreign',
    country: co.country,
    tags: co.value_chain_tags || []
})

export async function getValueChainFromDB(
    industrySlug: string
): Promise<ValueChainStageProducts[]> {
    const { data: companies, error: companiesError } = await supabaseServer
        .from('companies')
        .select('ticker, name, stream_slug, category_slug, value_chain_tags, product_tags, country, industry, industry_slug')
        .eq('industry_slug', industrySlug)

    if (companiesError) {
        console.error('Error fetching companies:', companiesError)
        return []
    }

    const allCompanies = (companies || []).map((row: any) => normalizeCompanyClassification(row))

    // 1. Try to fetch Full Structure from DB (Streams -> Categories -> Products)
    // ---------------------------------------------------------
    const { data: streams, error: streamsError } = await supabaseServer
        .from('value_chain_streams')
        .select(`
            *,
            categories:value_chain_categories(
                *,
                products:value_chain_products(*)
            )
        `)
        .eq('industry_slug', industrySlug)
        .order('sort_order')

    if (streamsError) {
        console.error('Error fetching value chain structure:', streamsError)
        return []
    }

    // Check if we have a defined structure (categories exist)
    const hasDefinedStructure = streams?.some(s => s.categories && s.categories.length > 0)

    if (hasDefinedStructure && streams) {
        // ---------------------------------------------------------
        // FULL DB MODE: Use DB Structure (The "Gold Standard" in SQL)
        // ---------------------------------------------------------
        return streams.map(stream => {
            // Sort categories by sort_order
            const sortedCategories = (stream.categories || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
            const streamTagIds = new Set<string>()
            sortedCategories.forEach((cat: any) => {
                streamTagIds.add(cat.slug)
                ;(cat.products || []).forEach((product: any) => streamTagIds.add(product.slug))
            })

            const streamCompanies = allCompanies.filter(c =>
                c.stream_slug === stream.slug ||
                (!c.stream_slug && (c.value_chain_tags || []).some((tag: string) => streamTagIds.has(tag)))
            )

            const products: ProductCategory[] = sortedCategories.map((cat: any) => {
                const sortedSubProducts = (cat.products || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                const categoryTagIds = new Set<string>([
                    cat.slug,
                    ...sortedSubProducts.map((sub: any) => sub.slug),
                ])

                // 1. Find companies for this MAIN CATEGORY
                const categoryCompanies = streamCompanies.filter(c =>
                    c.category_slug === cat.slug ||
                    (!c.category_slug && (c.value_chain_tags || []).some((tag: string) => categoryTagIds.has(tag)))
                )

                // 2. Hydrate Sub-Products (from value_chain_products table)
                const subProducts: ProductCategory[] = sortedSubProducts.map((sub: any) => {
                    // Find companies that match this tag
                    const tagCompanies = categoryCompanies.filter(c =>
                        c.value_chain_tags?.includes(sub.slug)
                    )

                    return {
                        id: sub.slug,
                        name: sub.display_name,
                        description: sub.description || '',
                        companiesDetailed: tagCompanies.map(mapCompany)
                    }
                })

                return {
                    id: cat.slug,
                    name: cat.display_name,
                    description: cat.description || '',
                    companiesDetailed: categoryCompanies.map(mapCompany),
                    subProducts: subProducts.length > 0 ? subProducts : undefined
                }
            })

            return {
                stage: stream.slug as 'upstream' | 'midstream' | 'downstream',
                stageLabel: stream.display_name,
                layout: 'grid',
                products: products
            }
        })
    }

    // ---------------------------------------------------------
    // DYNAMIC MODE: Generate from scratch (Fallback for unmigrated industries)
    // ---------------------------------------------------------

    // If no streams found even, return empty
    if (!streams?.length) {
        console.log(`No DB value chain found for ${industrySlug}`)
        return []
    }

    if (!allCompanies?.length) {
        // Return empty streams skeleton if exist
        return streams.map(stream => ({
            stage: stream.slug as 'upstream' | 'midstream' | 'downstream',
            stageLabel: stream.display_name,
            layout: 'grid',
            products: []
        }))
    }

    // Build dynamic categories from company data
    const result: ValueChainStageProducts[] = streams.map(stream => {
        // Get companies in this stream
        const streamCompanies = allCompanies.filter(co =>
            co.stream_slug === stream.slug
        )

        // Group companies by their primary category
        const categoryMap = new Map<string, typeof allCompanies>()

        for (const company of streamCompanies) {
            const categoryKey = company.category_slug ||
                (company.value_chain_tags?.[0]) ||
                'other'

            if (!categoryMap.has(categoryKey)) {
                categoryMap.set(categoryKey, [])
            }
            categoryMap.get(categoryKey)!.push(company)
        }

        const streamCategories = new Set(categoryMap.keys())

        const products: ProductCategory[] = Array.from(categoryMap.entries())
            .map(([categorySlug, categoryCompanies]) => {
                const subTagCounts = new Map<string, typeof allCompanies>()

                for (const company of categoryCompanies) {
                    const tags = company.value_chain_tags || []
                    const subTags = tags.filter((t: string) =>
                        t !== categorySlug && !streamCategories.has(t)
                    )

                    for (const tag of subTags) {
                        if (!subTagCounts.has(tag)) subTagCounts.set(tag, [])
                        subTagCounts.get(tag)!.push(company)
                    }
                }

                const subProducts: ProductCategory[] = Array.from(subTagCounts.entries())
                    .filter(([_, tagCompanies]) => tagCompanies.length >= 1)
                    .sort((a, b) => b[1].length - a[1].length)
                    .slice(0, 5)
                    .map(([tagSlug, tagCompanies]) => ({
                        id: tagSlug,
                        name: formatTagName(tagSlug),
                        description: '',
                        companiesDetailed: tagCompanies.map(mapCompany)
                    }))

                return {
                    id: categorySlug,
                    name: formatTagName(categorySlug),
                    description: '',
                    companiesDetailed: categoryCompanies.map(mapCompany),
                    subProducts: subProducts.length > 0 ? subProducts : undefined
                }
            })
            // Sort categories by size
            .sort((a, b) => (b.companiesDetailed?.length || 0) - (a.companiesDetailed?.length || 0))

        return {
            stage: stream.slug as 'upstream' | 'midstream' | 'downstream',
            stageLabel: stream.display_name,
            layout: 'grid' as const,
            products
        }
    })

    return result
}

/**
 * Convert a slug like 'seed-genetics' to 'Seed Genetics'
 */
function formatTagName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

/**
 * List of industries that use database-driven value chains.
 * Add industries here as they are migrated.
 */
export const DB_DRIVEN_INDUSTRIES = [
    'aerospace-defense',
    'agtech',
    'artificial-intelligence',
    'asset-management',
    'automotive',
    'banking',
    'biotechnology',
    'chemicals',
    'cloud-computing',
    'construction-engineering',
    'consumer-electronics',
    'consumer-products',
    'cybersecurity',
    'data-centers',
    'digital-health',
    'ecommerce',
    'electric-vehicles',
    'energy-storage',
    'fintech',
    'food-beverage',
    'heavy-industry',
    'hospitality',
    'insurance',
    'media-entertainment',
    'medical-devices',
    'mining-materials',
    'oil-gas',
    'pharmaceuticals',
    'real-estate',
    'retail',
    'robotics-automation',
    'semiconductors',
    'software-saas',
    'solar-energy',
    'space-technology',
    'telecommunications',
    'transportation-logistics',
    'utilities',
    'wholesale-trading',
]
