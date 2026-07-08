-- Normalize company classification and value-chain structure.
--
-- Canonical company fields:
--   industry_slug     primary industry taxonomy slug
--   stream_slug       upstream/midstream/downstream
--   category_slug     primary value-chain category
--   value_chain_tags  product/category tags used for matching
--
-- Legacy compatibility:
--   companies.industry and companies.product_tags are kept in sync while app
--   code and existing data are migrated.

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS industry_slug TEXT,
  ADD COLUMN IF NOT EXISTS stream_slug TEXT,
  ADD COLUMN IF NOT EXISTS category_slug TEXT,
  ADD COLUMN IF NOT EXISTS value_chain_tags TEXT[],
  ADD COLUMN IF NOT EXISTS product_tags TEXT[];

UPDATE companies
SET
  industry_slug = COALESCE(NULLIF(industry_slug, ''), NULLIF(industry, '')),
  value_chain_tags = COALESCE(value_chain_tags, product_tags, ARRAY[]::TEXT[]),
  product_tags = COALESCE(product_tags, value_chain_tags, ARRAY[]::TEXT[])
WHERE
  industry_slug IS NULL
  OR industry_slug = ''
  OR value_chain_tags IS NULL
  OR product_tags IS NULL;

CREATE INDEX IF NOT EXISTS idx_companies_industry_slug ON companies(industry_slug);
CREATE INDEX IF NOT EXISTS idx_companies_stream_slug ON companies(stream_slug);
CREATE INDEX IF NOT EXISTS idx_companies_category_slug ON companies(category_slug);
CREATE INDEX IF NOT EXISTS idx_companies_value_chain_tags ON companies USING GIN(value_chain_tags);
CREATE INDEX IF NOT EXISTS idx_companies_product_tags ON companies USING GIN(product_tags);

CREATE OR REPLACE FUNCTION normalize_company_classification()
RETURNS TRIGGER AS $$
BEGIN
  NEW.industry_slug := COALESCE(NULLIF(NEW.industry_slug, ''), NULLIF(NEW.industry, ''));
  NEW.industry := COALESCE(NULLIF(NEW.industry, ''), NULLIF(NEW.industry_slug, ''));
  NEW.value_chain_tags := COALESCE(NEW.value_chain_tags, NEW.product_tags, ARRAY[]::TEXT[]);
  NEW.product_tags := COALESCE(NEW.product_tags, NEW.value_chain_tags, ARRAY[]::TEXT[]);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS normalize_companies_classification ON companies;
CREATE TRIGGER normalize_companies_classification
  BEFORE INSERT OR UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION normalize_company_classification();

CREATE TABLE IF NOT EXISTS value_chain_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_slug TEXT NOT NULL,
  industry TEXT,
  slug TEXT NOT NULL CHECK (slug IN ('upstream', 'midstream', 'downstream')),
  display_name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(industry_slug, slug)
);

ALTER TABLE value_chain_streams
  ADD COLUMN IF NOT EXISTS industry_slug TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE value_chain_streams
SET
  industry_slug = COALESCE(NULLIF(industry_slug, ''), NULLIF(industry, '')),
  industry = COALESCE(NULLIF(industry, ''), NULLIF(industry_slug, ''))
WHERE industry_slug IS NULL OR industry_slug = '' OR industry IS NULL OR industry = '';

CREATE INDEX IF NOT EXISTS idx_value_chain_streams_industry_slug ON value_chain_streams(industry_slug);
CREATE INDEX IF NOT EXISTS idx_value_chain_streams_industry ON value_chain_streams(industry);

CREATE OR REPLACE FUNCTION normalize_value_chain_stream()
RETURNS TRIGGER AS $$
BEGIN
  NEW.industry_slug := COALESCE(NULLIF(NEW.industry_slug, ''), NULLIF(NEW.industry, ''));
  NEW.industry := COALESCE(NULLIF(NEW.industry, ''), NULLIF(NEW.industry_slug, ''));
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS normalize_value_chain_streams ON value_chain_streams;
CREATE TRIGGER normalize_value_chain_streams
  BEFORE INSERT OR UPDATE ON value_chain_streams
  FOR EACH ROW
  EXECUTE FUNCTION normalize_value_chain_stream();

CREATE TABLE IF NOT EXISTS value_chain_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID NOT NULL REFERENCES value_chain_streams(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(stream_id, slug)
);

ALTER TABLE value_chain_categories
  ADD COLUMN IF NOT EXISTS stream_id UUID REFERENCES value_chain_streams(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_value_chain_categories_stream ON value_chain_categories(stream_id);

CREATE TABLE IF NOT EXISTS value_chain_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES value_chain_categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

ALTER TABLE value_chain_products
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES value_chain_categories(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_value_chain_products_category ON value_chain_products(category_id);
CREATE INDEX IF NOT EXISTS idx_value_chain_products_slug ON value_chain_products(slug);

ALTER TABLE value_chain_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_chain_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_chain_products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'value_chain_streams'
      AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access" ON value_chain_streams FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'value_chain_categories'
      AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access" ON value_chain_categories FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'value_chain_products'
      AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access" ON value_chain_products FOR SELECT USING (true);
  END IF;
END $$;
