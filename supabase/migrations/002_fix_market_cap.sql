-- Fix market_cap column to handle very large numbers
ALTER TABLE companies 
ALTER COLUMN market_cap TYPE numeric(20, 2);

-- Also ensure it can handle NULL values
ALTER TABLE companies 
ALTER COLUMN market_cap DROP NOT NULL;


