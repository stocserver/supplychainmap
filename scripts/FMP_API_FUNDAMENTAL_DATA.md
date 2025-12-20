# Financial Modeling Prep (FMP) API - Fundamental Data Endpoints

This document summarizes the fundamental data endpoints provided by the Financial Modeling Prep API that are used in this project.

## Base URL
```
https://financialmodelingprep.com/stable/
```

## Authentication
All endpoints require an API key passed as a query parameter:
```
?apikey=YOUR_API_KEY
```

---

## Fundamental Data Endpoints

### 1. **Quote** - Real-time Stock Quote
**Endpoint:** `/quote`

**Parameters:**
- `symbol` (required): Stock ticker symbol
- `apikey` (required): Your API key

**Example:**
```
https://financialmodelingprep.com/stable/quote?symbol=AAPL&apikey=YOUR_API_KEY
```

**Data Provided:**
- Current stock price
- Price change and percentage change
- Trading volume and average volume
- Market capitalization
- P/E ratio
- EPS (Earnings Per Share)
- Day high/low
- Year high/low
- Shares outstanding

**Used in scripts:**
- `step3-import-fundamentals-to-supabase.ts`
- `import-single-ticker.ts`
- `import-product-file-companies.ts`
- `import-specific-tickers.ts`
- `step3-import-batch-fundamentals.ts`

---

### 2. **Profile** - Company Profile Information
**Endpoint:** `/profile`

**Parameters:**
- `symbol` (required): Stock ticker symbol
- `apikey` (required): Your API key

**Example:**
```
https://financialmodelingprep.com/stable/profile?symbol=AAPL&apikey=YOUR_API_KEY
```

**Data Provided:**
- Company name
- Sector and industry classification
- Company description
- Website URL
- Logo/image URL
- Country and exchange
- CIK (Central Index Key)
- ISIN, CUSIP identifiers
- IPO date
- Beta (volatility measure)
- Full-time employees count
- Market capitalization

**Used in scripts:**
- All fundamental import scripts

---

### 3. **Income Statement** - Annual Financial Statements
**Endpoint:** `/income-statement`

**Parameters:**
- `symbol` (required): Stock ticker symbol
- `period` (required): `annual` or `quarter`
- `limit` (optional): Number of periods to retrieve (default varies)
- `apikey` (required): Your API key

**Example (Annual):**
```
https://financialmodelingprep.com/stable/income-statement?symbol=AAPL&period=annual&limit=5&apikey=YOUR_API_KEY
```

**Example (Quarterly):**
```
https://financialmodelingprep.com/stable/income-statement?symbol=AAPL&period=quarter&limit=5&apikey=YOUR_API_KEY
```

**Data Provided:**
- Revenue
- Cost of revenue
- Gross profit and gross profit ratio
- Operating income and operating income ratio
- Net income and net income ratio
- EPS (Earnings Per Share) - basic and diluted
- EBITDA and EBITDA ratio
- Date of statement
- Additional line items (operating expenses, interest expense, etc.)

**Used in scripts:**
- All scripts that import fundamentals (both annual and quarterly)

---

### 4. **Balance Sheet Statement** - Assets, Liabilities, Equity
**Endpoint:** `/balance-sheet-statement`

**Parameters:**
- `symbol` (required): Stock ticker symbol
- `period` (required): `annual` or `quarter`
- `limit` (optional): Number of periods to retrieve
- `apikey` (required): Your API key

**Example (Annual):**
```
https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=AAPL&period=annual&limit=5&apikey=YOUR_API_KEY
```

**Example (Quarterly):**
```
https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=AAPL&period=quarter&limit=5&apikey=YOUR_API_KEY
```

**Data Provided:**
- Total assets
- Total liabilities
- Total stockholders' equity
- Cash and cash equivalents
- Total debt
- Net debt
- Date of statement
- Additional balance sheet items (current assets, non-current assets, etc.)

**Used in scripts:**
- All scripts that import fundamentals (both annual and quarterly)

---

### 5. **Cash Flow Statement** - Operating, Investing, Financing Activities
**Endpoint:** `/cash-flow-statement`

**Parameters:**
- `symbol` (required): Stock ticker symbol
- `period` (required): `annual` or `quarter`
- `limit` (optional): Number of periods to retrieve
- `apikey` (required): Your API key

**Example (Annual):**
```
https://financialmodelingprep.com/stable/cash-flow-statement?symbol=AAPL&period=annual&limit=5&apikey=YOUR_API_KEY
```

**Example (Quarterly):**
```
https://financialmodelingprep.com/stable/cash-flow-statement?symbol=AAPL&period=quarter&limit=5&apikey=YOUR_API_KEY
```

**Data Provided:**
- Operating cash flow
- Capital expenditure (CapEx)
- Free cash flow
- Dividends paid
- Date of statement
- Additional cash flow items (investing activities, financing activities, etc.)

**Used in scripts:**
- All scripts that import fundamentals (both annual and quarterly)

---

### 6. **Key Metrics (TTM)** - Trailing Twelve Months Metrics
**Endpoint:** `/key-metrics-ttm`

**Parameters:**
- `symbol` (required): Stock ticker symbol
- `limit` (optional): Number of records (typically 1 for TTM)
- `apikey` (required): Your API key

**Example:**
```
https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=AAPL&limit=1&apikey=YOUR_API_KEY
```

**Data Provided:**
- Market capitalization
- Enterprise value
- P/E ratio
- EV/Revenue ratio
- EV/EBITDA ratio
- Price-to-book ratio
- Price-to-sales ratio
- Dividend yield
- Payout ratio
- And many other valuation and profitability metrics

**Used in scripts:**
- `step3-import-fundamentals-to-supabase.ts`
- `import-single-ticker.ts`
- `import-product-file-companies.ts`
- `import-specific-tickers.ts`
- `step3-import-fundamentals-only.ts`

---

### 7. **Financial Ratios (TTM)** - Trailing Twelve Months Ratios
**Endpoint:** `/ratios-ttm`

**Parameters:**
- `symbol` (required): Stock ticker symbol
- `limit` (optional): Number of records (typically 1 for TTM)
- `apikey` (required): Your API key

**Example:**
```
https://financialmodelingprep.com/stable/ratios-ttm?symbol=AAPL&limit=1&apikey=YOUR_API_KEY
```

**Data Provided:**
- Liquidity ratios (current ratio, quick ratio, cash ratio)
- Profitability ratios (gross profit margin, operating profit margin, net profit margin, ROE, ROA, ROIC)
- Debt ratios (debt-to-equity, debt-to-assets)
- Efficiency ratios (asset turnover, inventory turnover)
- Market capitalization
- And many other financial ratios

**Used in scripts:**
- `step3-import-fundamentals-to-supabase.ts`
- `import-single-ticker.ts`
- `import-product-file-companies.ts`
- `import-specific-tickers.ts`
- `step3-import-fundamentals-only.ts`

---

## Summary of Data Categories

### Current Market Data
- **Quote**: Real-time stock price, volume, market cap, P/E, EPS

### Company Information
- **Profile**: Company details, sector, industry, description, identifiers

### Financial Statements (Historical)
- **Income Statement** (annual & quarterly): Revenue, expenses, profit, EPS, EBITDA
- **Balance Sheet** (annual & quarterly): Assets, liabilities, equity, cash, debt
- **Cash Flow Statement** (annual & quarterly): Operating, investing, financing cash flows

### Calculated Metrics
- **Key Metrics (TTM)**: Valuation multiples, profitability metrics
- **Ratios (TTM)**: Liquidity, profitability, debt, efficiency ratios

---

## API Usage in This Project

### Typical API Calls Per Company
The most comprehensive script (`step3-import-fundamentals-to-supabase.ts`) makes approximately **10 API calls per company**:
1. Quote
2. Profile
3. Income Statement (annual)
4. Balance Sheet (annual)
5. Cash Flow Statement (annual)
6. Income Statement (quarterly)
7. Balance Sheet (quarterly)
8. Cash Flow Statement (quarterly)
9. Key Metrics (TTM)
10. Ratios (TTM)

### Rate Limiting
- Scripts implement rate limiting (typically 300 requests per minute)
- Minimum interval between requests is calculated: `60000ms / rpm`

### Data Storage
All fundamental data is stored in Supabase `companies` table in a JSON `data` field, structured as:
```json
{
  "quote": { ... },
  "profile": { ... },
  "incomeStatement": { ... },
  "balanceSheet": { ... },
  "cashFlow": { ... },
  "keyMetrics": { ... },
  "ratios": { ... },
  "historicalFinancials": {
    "incomeStatements": [ ... ],
    "balanceSheets": [ ... ],
    "cashFlowStatements": [ ... ],
    "incomeStatementsQuarterly": [ ... ],
    "balanceSheetsQuarterly": [ ... ],
    "cashFlowStatementsQuarterly": [ ... ]
  },
  "last_updated": "ISO timestamp"
}
```

---

## Notes

1. **Period Options**: Financial statements support both `annual` and `quarter` periods
2. **Limit Parameter**: Used to control how many historical periods are retrieved (typically 5 years for annual, 5 quarters for quarterly)
3. **TTM Endpoints**: Key Metrics and Ratios are provided as "Trailing Twelve Months" (TTM), representing the most recent 12-month period
4. **Error Handling**: Scripts handle missing data gracefully, allowing partial imports if some endpoints fail
5. **Ticker Normalization**: Some scripts include ticker alias mappings for companies with symbol changes or special characters

---

## Additional FMP API Endpoints (Not Currently Used)

The FMP API likely provides many more endpoints that are not currently used in this project, such as:
- Company key executives
- Company calendar (earnings dates, etc.)
- Stock splits and dividends
- Analyst estimates
- SEC filings
- Enterprise value
- DCF (Discounted Cash Flow) models
- And more...

For the complete API documentation, visit: https://financialmodelingprep.com/developer/docs/

