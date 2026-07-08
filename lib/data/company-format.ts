export type CompanyClassificationRow = {
  industry?: string | null
  industry_slug?: string | null
  value_chain_tags?: string[] | null
  product_tags?: string[] | null
}

export function normalizeIndustrySlug(row: CompanyClassificationRow): string | null {
  return row.industry_slug || row.industry || null
}

export function normalizeValueChainTags(row: CompanyClassificationRow): string[] {
  return row.value_chain_tags || row.product_tags || []
}

export function normalizeCompanyClassification<T extends CompanyClassificationRow>(row: T): T & {
  industry: string | null
  industry_slug: string | null
  value_chain_tags: string[]
  product_tags: string[]
} {
  const industrySlug = normalizeIndustrySlug(row)
  const tags = normalizeValueChainTags(row)

  return {
    ...row,
    industry: industrySlug,
    industry_slug: industrySlug,
    value_chain_tags: tags,
    product_tags: tags,
  }
}
