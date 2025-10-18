-- Add lightweight classification fields directly on companies
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS industry_slug TEXT,
  ADD COLUMN IF NOT EXISTS industry_category TEXT,
  ADD COLUMN IF NOT EXISTS product_tags TEXT[];

CREATE INDEX IF NOT EXISTS idx_companies_industry_slug ON companies(industry_slug);
CREATE INDEX IF NOT EXISTS idx_companies_industry_category ON companies(industry_category);


