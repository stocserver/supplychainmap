import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { productStagesByIndustry } from '@/lib/data/product-stages'
import type { ProductCategory, ValueChainStageProducts } from '@/lib/data/industries'

dotenv.config({ path: '.env.local' })
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

type StreamRow = {
  id: string
}

type CategoryRow = {
  id: string
}

async function upsertStream(industrySlug: string, stage: ValueChainStageProducts, sortOrder: number): Promise<StreamRow> {
  const payload = {
    industry_slug: industrySlug,
    industry: industrySlug,
    slug: stage.stage,
    display_name: stage.stageLabel,
    sort_order: sortOrder,
  }

  const { data: existing, error: selectError } = await supabase
    .from('value_chain_streams')
    .select('id')
    .eq('industry_slug', industrySlug)
    .eq('slug', stage.stage)
    .maybeSingle()

  if (selectError) throw selectError

  if (existing) {
    const { data, error } = await supabase
      .from('value_chain_streams')
      .update(payload)
      .eq('id', existing.id)
      .select('id')
      .single()

    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('value_chain_streams')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw error
  return data
}

async function upsertCategory(streamId: string, product: ProductCategory, sortOrder: number): Promise<CategoryRow> {
  const payload = {
    stream_id: streamId,
    slug: product.id,
    display_name: product.name,
    description: product.description || null,
    sort_order: sortOrder,
  }

  const { data: existing, error: selectError } = await supabase
    .from('value_chain_categories')
    .select('id')
    .eq('stream_id', streamId)
    .eq('slug', product.id)
    .maybeSingle()

  if (selectError) throw selectError

  if (existing) {
    const { data, error } = await supabase
      .from('value_chain_categories')
      .update(payload)
      .eq('id', existing.id)
      .select('id')
      .single()

    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('value_chain_categories')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw error
  return data
}

async function upsertProduct(categoryId: string, product: ProductCategory, sortOrder: number): Promise<void> {
  const payload = {
    category_id: categoryId,
    slug: product.id,
    display_name: product.name,
    description: product.description || null,
    sort_order: sortOrder,
  }

  const { data: existing, error: selectError } = await supabase
    .from('value_chain_products')
    .select('id')
    .eq('category_id', categoryId)
    .eq('slug', product.id)
    .maybeSingle()

  if (selectError) throw selectError

  if (existing) {
    const { error } = await supabase
      .from('value_chain_products')
      .update(payload)
      .eq('id', existing.id)

    if (error) throw error
    return
  }

  const { error } = await supabase
    .from('value_chain_products')
    .insert(payload)

  if (error) throw error
}

async function seedIndustry(industrySlug: string, stages: ValueChainStageProducts[]) {
  let categoryCount = 0
  let subProductCount = 0

  for (const [stageIndex, stage] of stages.entries()) {
    const stream = await upsertStream(industrySlug, stage, stageIndex)

    for (const [categoryIndex, category] of stage.products.entries()) {
      const categoryRow = await upsertCategory(stream.id, category, categoryIndex)
      categoryCount += 1

      for (const [productIndex, subProduct] of (category.subProducts || []).entries()) {
        await upsertProduct(categoryRow.id, subProduct, productIndex)
        subProductCount += 1
      }
    }
  }

  return { categoryCount, subProductCount }
}

async function main() {
  const { error: schemaCheckError } = await supabase
    .from('value_chain_streams')
    .select('id, industry_slug')
    .limit(1)

  if (schemaCheckError) {
    const message = schemaCheckError.message || 'Unknown schema check error'
    const hint = message.toLowerCase().includes('fetch failed')
      ? 'Check network access and Supabase connectivity, then rerun the seed.'
      : 'Apply supabase/migrations/006_normalize_value_chain_data.sql before running this seed.'

    throw new Error(
      `Value-chain schema check failed: ${message}. ${hint}`
    )
  }

  const onlyIndustry = process.argv.find(arg => arg.startsWith('--industry='))?.split('=')[1]
  const entries = Object.entries(productStagesByIndustry)
    .filter(([industrySlug]) => !onlyIndustry || industrySlug === onlyIndustry)

  if (onlyIndustry && entries.length === 0) {
    throw new Error(`No product stages found for industry: ${onlyIndustry}`)
  }

  let totalCategories = 0
  let totalSubProducts = 0

  for (const [industrySlug, stages] of entries) {
    const result = await seedIndustry(industrySlug, stages)
    totalCategories += result.categoryCount
    totalSubProducts += result.subProductCount
    console.log(`${industrySlug}: ${stages.length} streams, ${result.categoryCount} top-level categories, ${result.subProductCount} nested sub-products`)
  }

  console.log(`Seeded ${entries.length} industries, ${totalCategories} top-level categories, ${totalSubProducts} nested sub-products`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
