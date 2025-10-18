-- Add category to industries, constrained to our canonical set
ALTER TABLE industries
ADD COLUMN IF NOT EXISTS category TEXT;

-- Optional: add a CHECK constraint to keep values consistent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'industries_category_check'
  ) THEN
    ALTER TABLE industries
    ADD CONSTRAINT industries_category_check CHECK (
      category IN (
        'tech',
        'financials',
        'energy-materials',
        'transport',
        'healthcare',
        'consumer',
        'real-estate',
        'hospitality',
        'agriculture'
      )
      OR category IS NULL
    );
  END IF;
END $$;

-- Company to industry mapping (explicit, separate from 'featured' listing)
CREATE TABLE IF NOT EXISTS company_industries (
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (company_id, industry_id)
);

CREATE INDEX IF NOT EXISTS idx_company_industries_company ON company_industries(company_id);
CREATE INDEX IF NOT EXISTS idx_company_industries_industry ON company_industries(industry_id);

ALTER TABLE company_industries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON company_industries FOR SELECT USING (true);


