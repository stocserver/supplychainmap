-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker VARCHAR(10) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sector TEXT,
  industry TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  country VARCHAR(2) DEFAULT 'US',
  exchange VARCHAR(10),
  market_cap BIGINT,
  employees INTEGER,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for companies
CREATE INDEX idx_companies_ticker ON companies(ticker);
CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_market_cap ON companies(market_cap DESC);

-- Industries table
CREATE TABLE industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(20),
  icon TEXT,
  level INTEGER DEFAULT 0,
  parent_id UUID REFERENCES industries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for industries
CREATE INDEX idx_industries_slug ON industries(slug);
CREATE INDEX idx_industries_parent ON industries(parent_id);

-- Value chains table
CREATE TABLE value_chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  position_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for value_chains
CREATE INDEX idx_value_chains_industry ON value_chains(industry_id);
CREATE INDEX idx_value_chains_slug ON value_chains(slug);

-- Company chains table
CREATE TABLE company_chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  value_chain_id UUID REFERENCES value_chains(id) ON DELETE CASCADE,
  position_type TEXT CHECK (position_type IN ('upstream', 'midstream', 'downstream')),
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, value_chain_id)
);

-- Indexes for company_chains
CREATE INDEX idx_company_chains_company ON company_chains(company_id);
CREATE INDEX idx_company_chains_value_chain ON company_chains(value_chain_id);
CREATE INDEX idx_company_chains_position ON company_chains(position_type);

-- Company relationships table
CREATE TABLE company_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('supplier', 'partner', 'competitor')),
  strength INTEGER CHECK (strength >= 1 AND strength <= 5),
  verified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(supplier_id, customer_id, relationship_type)
);

-- Indexes for company_relationships
CREATE INDEX idx_relationships_supplier ON company_relationships(supplier_id);
CREATE INDEX idx_relationships_customer ON company_relationships(customer_id);

-- Company financials table
CREATE TABLE company_financials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  fiscal_year INTEGER,
  fiscal_quarter INTEGER,
  revenue BIGINT,
  net_income BIGINT,
  operating_income BIGINT,
  total_assets BIGINT,
  total_liabilities BIGINT,
  shareholders_equity BIGINT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, fiscal_year, fiscal_quarter)
);

-- Indexes for company_financials
CREATE INDEX idx_financials_company ON company_financials(company_id);
CREATE INDEX idx_financials_year ON company_financials(fiscal_year DESC);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_financials ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read access)
CREATE POLICY "Public read access" ON companies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON industries FOR SELECT USING (true);
CREATE POLICY "Public read access" ON value_chains FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_chains FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_relationships FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_financials FOR SELECT USING (true);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for companies updated_at
CREATE TRIGGER update_companies_updated_at 
  BEFORE UPDATE ON companies
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();


