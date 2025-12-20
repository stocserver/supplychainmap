-- Semiconductors Value Chain Migration
-- Run this in Supabase SQL Editor

-- ===================
-- STREAMS
-- ===================
INSERT INTO value_chain_streams (industry, slug, display_name, sort_order, color) VALUES
('semiconductors', 'upstream', 'Upstream', 1, 'blue'),
('semiconductors', 'midstream', 'Midstream', 2, 'purple'),
('semiconductors', 'downstream', 'Downstream', 3, 'green')
ON CONFLICT (industry, slug) DO NOTHING;

-- ===================
-- CATEGORIES (Main product boxes)
-- ===================

-- Upstream Categories
INSERT INTO value_chain_categories (stream_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_streams WHERE industry='semiconductors' AND slug='upstream'), 'ip-design', 'IP Design / IC Design Services', 'Reusable circuit IP and outsourced IC design services', 1),
((SELECT id FROM value_chain_streams WHERE industry='semiconductors' AND slug='upstream'), 'ic-design', 'IC Design (Fabless)', 'Chip design firms (GPUs, CPUs, SoCs, etc.)', 2)
ON CONFLICT (stream_id, slug) DO NOTHING;

-- Midstream Categories
INSERT INTO value_chain_categories (stream_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_streams WHERE industry='semiconductors' AND slug='midstream'), 'wafer-fab', 'Wafer Fabrication', 'Foundries and IDMs manufacture ICs on silicon wafers', 1)
ON CONFLICT (stream_id, slug) DO NOTHING;

-- Downstream Categories
INSERT INTO value_chain_categories (stream_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_streams WHERE industry='semiconductors' AND slug='downstream'), 'packaging', 'IC Packaging & Testing', 'Assemble, protect, connect, and test finished dies', 1),
((SELECT id FROM value_chain_streams WHERE industry='semiconductors' AND slug='downstream'), 'modules', 'IC Modules', 'Combine chips into functional assemblies', 2),
((SELECT id FROM value_chain_streams WHERE industry='semiconductors' AND slug='downstream'), 'distribution', 'Distribution (End Markets)', 'Route components to device makers and OEMs', 3)
ON CONFLICT (stream_id, slug) DO NOTHING;

-- ===================
-- PRODUCTS (Sub-categories)
-- ===================

-- IC Design sub-products
INSERT INTO value_chain_products (category_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='ic-design'), 'gpu', 'GPU Designs', 'Graphics processors for AI, gaming, visualization', 1),
((SELECT id FROM value_chain_categories WHERE slug='ic-design'), 'cpu', 'CPU Designs', 'General-purpose processors for PCs, servers', 2),
((SELECT id FROM value_chain_categories WHERE slug='ic-design'), 'mobile-soc', 'Mobile SoCs', 'System-on-chips for smartphones and tablets', 3),
((SELECT id FROM value_chain_categories WHERE slug='ic-design'), 'ai-accelerators', 'AI Accelerators', 'Specialized chips for training and inference', 4),
((SELECT id FROM value_chain_categories WHERE slug='ic-design'), 'analog', 'Analog ICs', 'Power management, converters, interface chips', 5),
((SELECT id FROM value_chain_categories WHERE slug='ic-design'), 'rf', 'RF & Connectivity', 'Wireless transceivers, front-end modules', 6)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Wafer Fab sub-products
INSERT INTO value_chain_products (category_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'foundries-idms', 'Foundries & IDMs', 'Contract foundries and integrated device manufacturers', 1),
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'equipment', 'Production Equipment', 'Lithography, etch, deposition, inspection tools', 2),
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'materials', 'Chemicals & Materials', 'Specialty chemicals, gases, substrates', 3),
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'photomasks', 'Photomasks', 'Quartz plates with circuit patterns', 4)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Equipment sub-products (nested under equipment - we'll put them directly for simplicity)
INSERT INTO value_chain_products (category_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'litho', 'Lithography (EUV/DUV)', 'Optical systems project circuit patterns', 5),
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'etch', 'Etching Tools', 'Remove material selectively', 6),
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'dep', 'Deposition & CMP', 'Thin-film deposition and planarization', 7),
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'inspect', 'Inspection/Metrology', 'Detect defects and measure features', 8)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Materials sub-products
INSERT INTO value_chain_products (category_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'photoresist', 'Photoresists', 'Light-sensitive polymers for patterning', 9),
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'gases', 'Ultra-Pure Gases', 'Process gases with low contaminants', 10),
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'wafers', 'Silicon Wafers', 'Monocrystalline silicon substrates', 11),
((SELECT id FROM value_chain_categories WHERE slug='wafer-fab'), 'consumables', 'Fab Consumables', 'Filters, slurries, specialty materials', 12)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Packaging sub-products
INSERT INTO value_chain_products (category_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='packaging'), 'bga', 'BGA / QFN / Flip-Chip', 'Package families for electrical I/O', 1),
((SELECT id FROM value_chain_categories WHERE slug='packaging'), 'substrates', 'Substrates & Interposers', 'ABF/BT substrates and silicon interposers', 2),
((SELECT id FROM value_chain_categories WHERE slug='packaging'), 'test', 'Test & Handlers', 'Equipment for wafer sort, final test', 3),
((SELECT id FROM value_chain_categories WHERE slug='packaging'), 'pkg-equip', 'Packaging Equipment', 'Bonding, dicing, molding equipment', 4)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Modules sub-products
INSERT INTO value_chain_products (category_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='modules'), 'memory-mods', 'Memory Modules', 'DRAM and NAND assemblies', 1),
((SELECT id FROM value_chain_categories WHERE slug='modules'), 'rf-mods', 'RF Modules', 'Front-end and connectivity modules', 2),
((SELECT id FROM value_chain_categories WHERE slug='modules'), 'power-mods', 'Power Modules', 'High-efficiency power conversion', 3)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Distribution sub-products
INSERT INTO value_chain_products (category_id, slug, display_name, description, sort_order) VALUES
((SELECT id FROM value_chain_categories WHERE slug='distribution'), 'to-smartphones', 'To Smartphones', 'Distribution to smartphone makers', 1),
((SELECT id FROM value_chain_categories WHERE slug='distribution'), 'to-pc', 'To PCs & Servers', 'Distribution to PC/server OEMs', 2),
((SELECT id FROM value_chain_categories WHERE slug='distribution'), 'to-automotive', 'To Automotive', 'Distribution to automotive OEMs', 3),
((SELECT id FROM value_chain_categories WHERE slug='distribution'), 'to-dc', 'To Data Centers', 'Distribution to data center operators', 4)
ON CONFLICT (category_id, slug) DO NOTHING;
