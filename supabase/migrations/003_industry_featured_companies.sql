-- Join table mapping industries to featured company tickers
CREATE TABLE IF NOT EXISTS industry_featured_companies (
  industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
  ticker VARCHAR(10) NOT NULL,
  position_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (industry_id, ticker)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_ifc_industry ON industry_featured_companies(industry_id);
CREATE INDEX IF NOT EXISTS idx_ifc_ticker ON industry_featured_companies(ticker);

-- RLS
ALTER TABLE industry_featured_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON industry_featured_companies FOR SELECT USING (true);


