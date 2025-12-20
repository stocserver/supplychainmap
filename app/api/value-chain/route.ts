import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    // Create Supabase client inside handler to ensure env vars are loaded
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')

    if (!industry) {
        return NextResponse.json({ error: 'industry parameter required' }, { status: 400 })
    }

    try {
        // Fetch streams for this industry
        const { data: streams, error: streamsError } = await supabase
            .from('value_chain_streams')
            .select('*')
            .eq('industry', industry)
            .order('sort_order')

        if (streamsError) throw streamsError

        // Fetch categories for each stream
        const { data: categories, error: categoriesError } = await supabase
            .from('value_chain_categories')
            .select('*')
            .in('stream_id', streams?.map(s => s.id) || [])
            .order('sort_order')

        if (categoriesError) throw categoriesError

        // Fetch products for each category
        const { data: products, error: productsError } = await supabase
            .from('value_chain_products')
            .select('*')
            .in('category_id', categories?.map(c => c.id) || [])
            .order('sort_order')

        if (productsError) throw productsError

        // Fetch companies for this industry with their classifications
        const { data: companies, error: companiesError } = await supabase
            .from('companies')
            .select('ticker, name, stream_slug, category_slug, value_chain_tags, country')
            .eq('industry', industry)

        if (companiesError) throw companiesError

        // Build the tree structure
        const result = streams?.map(stream => ({
            stage: stream.slug,
            stageLabel: stream.display_name,
            color: stream.color,
            products: categories
                ?.filter(c => c.stream_id === stream.id)
                .map(category => ({
                    id: category.slug,
                    name: category.display_name,
                    description: category.description,
                    companiesDetailed: companies
                        ?.filter(co => co.category_slug === category.slug)
                        .map(co => ({
                            name: co.name,
                            ticker: co.ticker,
                            listing: co.country === 'US' ? 'US' : 'Foreign',
                            country: co.country,
                            tags: co.value_chain_tags || []
                        })) || [],
                    subProducts: products
                        ?.filter(p => p.category_id === category.id)
                        .map(product => ({
                            id: product.slug,
                            name: product.display_name,
                            description: product.description,
                            companiesDetailed: companies
                                ?.filter(co => co.value_chain_tags?.includes(product.slug))
                                .map(co => ({
                                    name: co.name,
                                    ticker: co.ticker,
                                    listing: co.country === 'US' ? 'US' : 'Foreign',
                                    country: co.country,
                                    tags: co.value_chain_tags || []
                                })) || []
                        })) || []
                })) || []
        })) || []

        return NextResponse.json({
            industry,
            stages: result,
            totalCompanies: companies?.length || 0
        })

    } catch (error: any) {
        console.error('Error fetching value chain:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
