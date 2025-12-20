-- Value Chain Lookup Tables Migration
-- Run this in Supabase SQL Editor

-- 1. Streams Table (Upstream, Midstream, Downstream per industry)
CREATE TABLE IF NOT EXISTS value_chain_streams (
    id SERIAL PRIMARY KEY,
    industry TEXT NOT NULL,
    slug TEXT NOT NULL,
    display_name TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    color TEXT,
    UNIQUE(industry, slug)
);

-- 2. Categories Table (Seeds & Biotech, Ag Equipment, etc.)
CREATE TABLE IF NOT EXISTS value_chain_categories (
    id SERIAL PRIMARY KEY,
    stream_id INT REFERENCES value_chain_streams(id),
    slug TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    UNIQUE(stream_id, slug)
);

-- 3. Products Table (Seed Genetics, Tractors, etc.)
CREATE TABLE IF NOT EXISTS value_chain_products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES value_chain_categories(id),
    slug TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    UNIQUE(category_id, slug)
);

-- ===================
-- POPULATE AGTECH DATA
-- ===================

-- Streams for AgTech
INSERT INTO value_chain_streams (industry, slug, display_name, sort_order, color) VALUES
('agtech', 'upstream', 'Seeds & Inputs', 1, 'blue'),
('agtech', 'midstream', 'Equipment & Precision Ag', 2, 'purple'),
('agtech', 'downstream', 'Farming Services & Processing', 3, 'green')
ON CONFLICT (industry, slug) DO NOTHING;

-- Get stream IDs (for reference in categories)
-- Upstream = 1, Midstream = 2, Downstream = 3 (assuming fresh DB)

-- Categories for AgTech Upstream
INSERT INTO value_chain_categories (stream_id, slug, display_name, sort_order) VALUES
((SELECT id FROM value_chain_streams WHERE industry='agtech' AND slug='upstream'), 'seeds-biotech', 'Seeds & Biotech', 1),
((SELECT id FROM value_chain_streams WHERE industry='agtech' AND slug='upstream'), 'fertilizers', 'Fertilizers', 2)
ON CONFLICT (stream_id, slug) DO NOTHING;

-- Categories for AgTech Midstream
INSERT INTO value_chain_categories (stream_id, slug, display_name, sort_order) VALUES
((SELECT id FROM value_chain_streams WHERE industry='agtech' AND slug='midstream'), 'ag-equipment', 'Ag Equipment', 1),
((SELECT id FROM value_chain_streams WHERE industry='agtech' AND slug='midstream'), 'precision-ag', 'Precision Ag', 2)
ON CONFLICT (stream_id, slug) DO NOTHING;

-- Categories for AgTech Downstream
INSERT INTO value_chain_categories (stream_id, slug, display_name, sort_order) VALUES
((SELECT id FROM value_chain_streams WHERE industry='agtech' AND slug='downstream'), 'farming-services', 'Farming Services', 1),
((SELECT id FROM value_chain_streams WHERE industry='agtech' AND slug='downstream'), 'food-processing', 'Food Processing', 2)
ON CONFLICT (stream_id, slug) DO NOTHING;

-- Products for Seeds & Biotech
INSERT INTO value_chain_products (category_id, slug, display_name, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='seeds-biotech'), 'seed-genetics', 'Seed Genetics & Breeding', 1),
((SELECT id FROM value_chain_categories WHERE slug='seeds-biotech'), 'crop-protection', 'Crop Protection Chemicals', 2)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Products for Fertilizers
INSERT INTO value_chain_products (category_id, slug, display_name, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='fertilizers'), 'commodity-fertilizers', 'Commodity Fertilizers', 1),
((SELECT id FROM value_chain_categories WHERE slug='fertilizers'), 'specialty-nutrients', 'Specialty Nutrients', 2)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Products for Ag Equipment
INSERT INTO value_chain_products (category_id, slug, display_name, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='ag-equipment'), 'tractors-harvesters', 'Tractors & Harvesters', 1),
((SELECT id FROM value_chain_categories WHERE slug='ag-equipment'), 'planting-equipment', 'Planting & Tillage Equipment', 2)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Products for Precision Ag
INSERT INTO value_chain_products (category_id, slug, display_name, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='precision-ag'), 'guidance-systems', 'GPS Guidance & Auto-Steer', 1),
((SELECT id FROM value_chain_categories WHERE slug='precision-ag'), 'irrigation-systems', 'Smart Irrigation', 2),
((SELECT id FROM value_chain_categories WHERE slug='precision-ag'), 'farm-software', 'Farm Management Software', 3)
ON CONFLICT (category_id, slug) DO NOTHING;

-- ===================
-- ADD COLUMNS TO COMPANIES (optional - for denormalized access)
-- ===================
-- ALTER TABLE companies ADD COLUMN IF NOT EXISTS stream_slug TEXT;
-- ALTER TABLE companies ADD COLUMN IF NOT EXISTS category_slug TEXT;
