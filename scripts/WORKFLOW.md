# Data Seeding & Import Workflow

This document describes the 3-step process for updating data from `industries.ts` to Supabase and then importing fundamental data from FMP.

## Workflow Overview

1. **Step 1: Seed** - Load industries and companies from `industries.ts` into Supabase
2. **Step 2: Validate & Map** - Ensure all tickers exist and map relationships
3. **Step 3: Import Fundamentals** - Fetch and import financial data from FMP

---

## Step 1: Seed Industries & Companies

After updating `lib/data/industries.ts`, seed the database with industries and basic company data.

### Scripts (Run in this order):

1. **`step1-seed-industries.ts`** → Seeds industries table and featured companies mapping

   ```bash
   npm run step1:seed-industries
   ```

   - Creates/updates industries in Supabase
   - Creates `industry_featured_companies` mappings

2. **`step1-seed-companies.ts`** → Seeds basic company rows (ticker, name)
   ```bash
   npm run step1:seed-companies
   ```
   - Creates basic company entries in `companies` table
   - Aggregates tickers from industries.ts and product files

---

## Step 2: Validate & Map Relationships

Ensure all tickers are in Supabase and establish relationships.

### Scripts (Run in this order):

1. **`step2-validate-hardcoded-vs-db.ts`** → Validates and optionally seeds missing tickers

   ```bash
   # First, check what's missing
   npm run step2:validate

   # Then, seed missing tickers automatically
   npm run step2:validate:seed
   ```

   - Checks if all tickers from industries.ts exist in DB
   - Can automatically seed missing tickers with `--seed` flag
   - Reports public companies without tickers

2. **`step2-seed-company-industry-mappings.ts`** → Maps companies to industries

   ```bash
   npm run step2:seed-mappings
   ```

   - Creates `company_industries` join table entries
   - Maps companies to their primary industries

3. **`step2-seed-company-classification.ts`** → Seeds company classification fields
   ```bash
   npm run step2:seed-classification
   ```
   - Updates companies with `industry_slug` and `industry_category`

---

## Step 3: Import Fundamental Data from FMP

Fetch comprehensive financial data from Financial Modeling Prep API.

### Scripts (Choose one based on your needs):

1. **`step3-import-fundamentals-to-supabase.ts`** → **Recommended** - Full import with quotes + fundamentals

   ```bash
   # Import all seeded companies from DB (DEFAULT - includes valueChain, product files, etc.)
   npm run step3:import-fundamentals -- --limit=50 --rpm=300

   # Or with options:
   npm run step3:import-fundamentals -- --limit=10 --offset=0 --delay=2000 --usOnly --rpm=300
   ```

   - **Default behavior**: Loads ALL companies from DB (includes all seeded companies from valueChain and product files)
   - Fetches: Quote, Profile, Income, Balance, Cash Flow, Key Metrics, Ratios
   - Rate-limited sequential processing
   - ~7 API calls per company
   - Use `--useLocalList` to only import featured_companies from industries.ts

2. **`step3-import-fundamentals-only.ts`** → Fundamentals only (no quote data)

   ```bash
   npm run step3:import-fundamentals-only

   # Or with options:
   tsx scripts/step3-import-fundamentals-only.ts --limit=10 --offset=0 --rpm=300
   ```

   - Fetches: Profile, Income (annual + quarterly), Balance, Cash Flow, Metrics, Ratios
   - No quote/price data
   - Use when you only need financial statements

3. **`step3-import-batch-fundamentals.ts`** → Batch import with concurrency

   ```bash
   npm run step3:import-batch

   # Or with custom options:
   tsx scripts/step3-import-batch-fundamentals.ts --limit=10 --concurrency=5
   ```

   - Parallel processing for faster imports
   - Note: Currently missing key metrics and ratios
   - ⚠️ Use with caution - may hit rate limits

---

## Verification

### Check what's in the database:

**`verify-supabase-data.ts`** → Verifies data structure and completeness

```bash
npm run verify:data
```

- Shows which companies have full fundamentals
- Shows which have quote-only data
- Shows which have no data

---

## Complete Workflow Example

```bash
# 1. Seed industries and companies (this seeds ALL companies from industries.ts, valueChain, and product files)
npm run step1:seed-industries
npm run step1:seed-companies

# 2. Validate and map
npm run step2:validate:seed
npm run step2:seed-mappings
npm run step2:seed-classification

# 3. Import fundamentals (DEFAULT: imports ALL seeded companies from DB)
# Start small to test, then import more
npm run step3:import-fundamentals -- --limit=50 --rpm=300 --offset=0
npm run step3:import-fundamentals -- --limit=50 --rpm=300 --offset=50
# Continue with offset increments until all companies are imported

# 4. Verify
npm run verify:data
```

**Note**: By default, Step 3 imports ALL companies seeded in Step 1 (including valueChain companies and product file companies), not just featured_companies. This ensures every company you've defined gets fundamental data.

---

## FMP API Limits

- **Free Tier**: 250 API calls per day
- **With full import**: ~7 calls/company = ~35 companies/day max
- **Fundamentals-only**: ~6 calls/company = ~41 companies/day max

---

## Notes

- Always update `industries.ts` first, then run Step 1 & 2
- Step 3 can be run incrementally (use `--limit` and `--offset`)
- All scripts are now prefixed with step numbers (step1-, step2-, step3-) for clear workflow organization
