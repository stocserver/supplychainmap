# FMP Income Statement Data Fix

## Issue Summary

When checking the FMP (Financial Modeling Prep) income statement data integration, we discovered that some critical fields were **not being mapped correctly** from the FMP API to the Supabase database.

## Problems Identified

### 1. **Missing Calculated Ratios**

The FMP API does **not** return these ratio fields in the income statement endpoint:

- `grossProfitRatio`
- `operatingIncomeRatio`
- `netIncomeRatio`
- `ebitdaratio`

However, the `FinancialStatements` component expects these fields to exist and display profit margins.

### 2. **Field Name Casing Mismatch**

The FMP API returns camelCase field names, but the import script was looking for lowercase:

- API returns: `epsDiluted` → Script looked for: `epsdiluted` ❌
- API returns: `ebitdaRatio` → Script looked for: `ebitdaratio` ❌

This caused the EPS (Diluted) value to be stored as `null` even though the API provides it.

## Solutions Implemented

### ✅ Fix 1: Calculate Missing Ratios

Updated `scripts/import-fundamentals-to-supabase.ts` to calculate ratios when they're not provided by the API:

```typescript
grossProfitRatio: latestIncome.grossProfitRatio ||
  (latestIncome.revenue ? latestIncome.grossProfit / latestIncome.revenue : null),

operatingIncomeRatio: latestIncome.operatingIncomeRatio ||
  (latestIncome.revenue ? latestIncome.operatingIncome / latestIncome.revenue : null),

netIncomeRatio: latestIncome.netIncomeRatio ||
  (latestIncome.revenue ? latestIncome.netIncome / latestIncome.revenue : null),

ebitdaratio: latestIncome.ebitdaRatio || latestIncome.ebitdaratio ||
  (latestIncome.revenue ? latestIncome.ebitda / latestIncome.revenue : null),
```

### ✅ Fix 2: Correct Field Name Casing

Updated the field mappings to check both camelCase and lowercase versions:

```typescript
epsdiluted: latestIncome.epsDiluted || latestIncome.epsdiluted,
```

### ✅ Fix 3: Defensive UI Component

Updated `components/company/FinancialStatements.tsx` to gracefully handle missing ratios:

```typescript
// Before (would crash if ratio is null)
{(incomeStatement.grossProfitRatio * 100).toFixed(1)}%

// After (shows 'N/A' if missing)
{incomeStatement.grossProfitRatio ?
  (incomeStatement.grossProfitRatio * 100).toFixed(1) + '%' : 'N/A'}
```

## Verification Tests

Created comprehensive test scripts:

1. **`scripts/test-income-statement.ts`** - Tests raw FMP API response

   - Run: `npm run test:income`
   - Validates all income statement fields
   - Shows what data FMP returns

2. **`scripts/test-income-statement-fix.ts`** - Tests the fix

   - Run: `npx tsx scripts/test-income-statement-fix.ts`
   - Simulates the fixed mapping logic
   - Confirms all fields are properly calculated

3. **`scripts/verify-income-ratios.ts`** - Verifies ratio calculations
   - Run: `npx tsx scripts/verify-income-ratios.ts`
   - Shows raw API data
   - Demonstrates ratio calculations

## Test Results

✅ **All tests passing!**

Example output for AAPL:

```
Revenue:            $391.04B
Gross Profit:       $180.68B
Operating Income:   $123.22B
Net Income:         $93.74B

Gross Margin:       46.2%    ← NOW CALCULATED ✅
Operating Margin:   31.5%    ← NOW CALCULATED ✅
Net Margin:         24.0%    ← NOW CALCULATED ✅

EPS (Basic):        $6.11
EPS (Diluted):      $6.08    ← NOW MAPPED CORRECTLY ✅

EBITDA:             $134.66B
EBITDA Margin:      34.4%    ← NOW CALCULATED ✅
```

## Re-importing Data

If you have companies with old/incorrect data in Supabase, re-import them:

```bash
# Re-import all fundamental data (uses fixed script)
npm run import:fundamentals
```

This will:

- Fetch fresh data from FMP API
- Apply the ratio calculations
- Correctly map all field names
- Update existing companies in Supabase

**Note:** This uses ~7 API calls per company. With FMP's 250 calls/day limit, you can update ~35 companies per day.

## Impact

### Before the Fix

- Profit margins showed as "NaN%" or crashed the UI
- EPS (Diluted) was always null/missing
- EBITDA margin was missing
- Component couldn't display complete financial data

### After the Fix

- ✅ All profit margins calculated and displayed correctly
- ✅ EPS (Diluted) properly captured from API
- ✅ EBITDA margin calculated
- ✅ Component displays complete, accurate financial data
- ✅ Graceful handling of any missing fields

## Files Modified

1. `scripts/import-fundamentals-to-supabase.ts` - Fixed data mapping and added calculations
2. `components/company/FinancialStatements.tsx` - Added defensive null checks
3. `package.json` - Added `test:income` script
4. Created test scripts:
   - `scripts/test-income-statement.ts`
   - `scripts/test-income-statement-fix.ts`
   - `scripts/verify-income-ratios.ts`

## API Endpoint Used

```
https://financialmodelingprep.com/stable/income-statement
  ?symbol={TICKER}
  &period=annual
  &limit=5
  &apikey={API_KEY}
```

This endpoint is working correctly and returning all necessary data. The issue was in how we were mapping and calculating derived fields.

## Conclusion

✅ **FMP income statement data is being fetched correctly**

The API is working as expected. The issues were in our data mapping layer, which have now been fixed. All companies imported going forward will have complete, accurate financial data displayed in the UI.

