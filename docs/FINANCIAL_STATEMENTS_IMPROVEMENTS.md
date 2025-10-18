# Financial Statements UI Improvements

## ✨ What's New

### 1. **Spreadsheet-Style Layout**

- Financial data displayed in **traditional table format** with years/quarters as columns
- Easy to compare across periods at a glance
- Similar to professional financial statements (like the reference image provided)

### 2. **Comma Separators for Numbers**

- All numbers now display with proper formatting: `56,334` instead of `56334`
- Makes large numbers easier to read
- Professional financial report appearance

### 3. **Annual & Quarterly Toggle**

- **Toggle button** at the top to switch between:
  - **Annual**: Last 5 years of annual financial statements
  - **Quarterly**: Last 12 quarters of quarterly reports
- User controls which view they want to see
- Works across all tabs (Income Statement, Balance Sheet, Cash Flow)

### 4. **Sticky Column Headers**

- Item names stay visible when scrolling horizontally
- Easy to reference which row you're looking at
- Better UX for wide tables

### 5. **Color-Coded Rows**

- 🟦 **Blue**: Key subtotals (Gross Profit, Operating Income, Total Assets)
- 🟩 **Green**: Bottom line items (Net Income, Equity, Operating CF, Free CF)
- 🟧 **Orange**: Liabilities
- Makes it easy to spot important line items

### 6. **Inline Margin Calculations**

- Profit margins shown directly below main items
- Example:
  ```
  Gross Profit         39,430  38,365  40,633
    Gross Margin        70.0%   70.6%   70.0%
  ```
- All margins auto-calculated even if API doesn't provide them

---

## 📊 Example Output

### Income Statement - Annual View

```
Item                    2024    2023    2022    2021    2020
────────────────────────────────────────────────────────────
Revenue                56,334  54,318  58,054  56,197  45,804
  Cost of Revenue      16,904  15,953  17,421  17,013  13,872
Gross Profit           39,430  38,365  40,633  39,184  31,932
  Gross Margin          70.0%   70.6%   70.0%   69.7%   69.7%
Operating Income        9,137  11,542  14,262  14,901  11,483
  Operating Margin      16.2%   21.2%   24.6%   26.5%   25.1%
Net Income              4,278   7,006  11,837  12,063   7,011
  Net Margin             7.6%   12.9%   20.4%   21.5%   15.3%
EPS (Basic)             $2.40   $3.95   $6.63   $6.76   $3.92
EPS (Diluted)           $2.39   $3.92   $6.58   $6.71   $3.90
```

### Income Statement - Quarterly View

```
Item                   Q4 2024  Q3 2024  Q2 2024  Q1 2024
──────────────────────────────────────────────────────────
Revenue                 14,462   14,460   14,462   12,950
  Cost of Revenue        4,301    4,305    4,336    3,962
Gross Profit           10,161   10,155   10,126    8,988
  Gross Margin           70.3%    70.2%    70.0%    69.4%
...
```

---

## 🔧 How to Import Data with Quarterly Reports

The import script now fetches **both annual AND quarterly data**:

```bash
npm run reimport:fix
```

This will:

- ✅ Fetch last **5 years** of annual data
- ✅ Fetch last **12 quarters** of quarterly data
- ✅ Calculate missing profit margins
- ✅ Fix EPS Diluted field mapping
- ✅ Store everything in Supabase

**API Usage:**

- **13 API calls per company** (was 7 before)
  - 2 for quote & profile
  - 3 for annual statements (income, balance, cash flow)
  - 3 for quarterly statements
  - 2 for key metrics & ratios
- With 250 free calls/day, you can import ~**19 companies per day**

---

## 📦 Data Structure in Supabase

Quarterly data is stored in: `companies.data.historicalFinancials`

```json
{
  "historicalFinancials": {
    // Annual data (5 years)
    "incomeStatements": [...],
    "balanceSheets": [...],
    "cashFlowStatements": [...],

    // Quarterly data (12 quarters) - NEW!
    "incomeStatementsQuarterly": [...],
    "balanceSheetsQuarterly": [...],
    "cashFlowStatementsQuarterly": [...]
  }
}
```

---

## 🎨 UI Components Modified

### `components/company/FinancialStatements.tsx`

**New Features:**

- `useState` hook to manage Annual/Quarterly toggle
- `formatMillion()` - Formats numbers with commas (e.g., 56,334)
- `formatPeriodHeader()` - Shows "2024" or "Q4 2024" based on period
- Responsive table with sticky left column
- Horizontal scroll for many periods
- Color-coded background rows

**Toggle Button:**

```tsx
<Button
  variant={period === 'annual' ? 'default' : 'ghost'}
  onClick={() => setPeriod('annual')}
>
  Annual
</Button>
<Button
  variant={period === 'quarterly' ? 'default' : 'ghost'}
  onClick={() => setPeriod('quarterly')}
>
  Quarterly
</Button>
```

---

## 📝 Files Modified

1. **`components/company/FinancialStatements.tsx`**

   - Complete redesign to spreadsheet layout
   - Added Annual/Quarterly toggle
   - Added comma formatting
   - Added color coding

2. **`scripts/reimport-with-fix.ts`**

   - Now fetches quarterly data (12 quarters)
   - Stores quarterly data in Supabase
   - Updated API call count (13 per company)

3. **`components/ui/tabs.tsx`** (created)
   - Added missing shadcn/ui tabs component

---

## 🚀 How to Use

### 1. Import Company Data with Quarterly Reports

```bash
npm run reimport:fix
```

### 2. View the Financial Statements

```bash
npm run dev
```

Navigate to: `http://localhost:3000/companies/ABBV`

### 3. Toggle Between Annual & Quarterly

- Click **"Annual"** button to see 5 years of data
- Click **"Quarterly"** button to see 12 quarters of data
- Works across all financial statement tabs

---

## 📊 Data Format

**Numbers:** All amounts shown in **millions** with comma separators

- Revenue: `56,334` = $56.334 billion
- Numbers align right for easy comparison

**Percentages:** Shown with 1 decimal place

- Gross Margin: `70.0%`
- Net Margin: `16.2%`

**EPS:** Shown in dollars with 2 decimals

- EPS (Diluted): `$2.39`

**Quarters:** Shown as period + year

- `Q4 2024`, `Q3 2024`, `Q2 2024`, etc.

---

## ✅ Benefits

1. **Easy Trend Analysis** - See 5 years or 12 quarters side-by-side
2. **Professional Format** - Traditional financial statement layout
3. **User Control** - Toggle between annual and quarterly views
4. **Better Readability** - Comma separators and color coding
5. **Complete Data** - Both annual and quarterly data stored
6. **Responsive** - Works on desktop with horizontal scrolling

---

## 🔮 Future Enhancements

Potential improvements:

- [ ] Export to CSV/Excel
- [ ] Growth rate calculations (YoY, QoQ)
- [ ] Charts/graphs alongside tables
- [ ] Comparison view (compare 2 companies side-by-side)
- [ ] Custom date range selection
- [ ] Hide/show specific line items

