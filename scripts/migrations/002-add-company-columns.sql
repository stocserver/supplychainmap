-- Add stream and category columns to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stream_slug TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS category_slug TEXT;
