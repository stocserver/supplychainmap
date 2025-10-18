# Yahoo Finance API - Current Status & Alternatives

## 🚨 Current Situation

Yahoo Finance has implemented strict anti-bot measures that block most programmatic access:

- **Direct API calls**: Return 401 Unauthorized
- **yahoo-finance2 library**: Gets blocked with "Unsupported redirect" errors
- **Root cause**: Yahoo requires browser-like cookies and crumb tokens that change frequently

## ✅ Recommended Solutions

### Option 1: Use Financial Modeling Prep (FREE) ⭐ **RECOMMENDED**

**Pros:**

- ✅ 250 API calls/day (FREE tier)
- ✅ No credit card required
- ✅ Real-time stock data
- ✅ Company profiles, financials, news
- ✅ Very reliable and fast
- ✅ Great documentation

**Setup:**

1. Sign up at: https://site.financialmodelingprep.com/register
2. Get your free API key
3. 250 requests/day is plenty for your app

**Example:**

```typescript
const API_KEY = "your_api_key";
const response = await fetch(
  `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${API_KEY}`
);
```

### Option 2: Alpha Vantage (FREE but Limited)

**Pros:**

- ✅ No credit card required
- ✅ Comprehensive data
- ✅ Good documentation

**Cons:**

- ❌ Only 25 API calls/day (very limited)
- ❌ 5 calls per minute limit

**Best for:** Small projects, testing

### Option 3: IEX Cloud (FREE Tier)

**Pros:**

- ✅ 50,000 messages/month
- ✅ Real-time data
- ✅ Reliable service

**Cons:**

- ❌ Requires credit card (but won't charge on free tier)

### Option 4: Use Static/Seed Data

**For Development:**

- Create a seed file with sample company data
- Perfect for building the UI and features
- Switch to real API later

**Example:**

```typescript
// lib/data/sample-companies.ts
export const sampleData = {
  AAPL: {
    name: "Apple Inc.",
    price: 175.5,
    marketCap: 2800000000000,
    // ... more data
  },
};
```

## 📋 Implementation Guide

### Using Financial Modeling Prep

1. **Sign up for free API key**
   https://site.financialmodelingprep.com/register

2. **Update environment variables**

```env
FMP_API_KEY=your_api_key_here
```

3. **Update the client** (`lib/yahoo-finance/direct-client.ts`):

```typescript
const FMP_API_KEY = process.env.FMP_API_KEY;

export async function getQuote(ticker: string) {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${FMP_API_KEY}`
  );
  const data = await response.json();
  return data[0]; // FMP returns an array
}

export async function getCompanyProfile(ticker: string) {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${FMP_API_KEY}`
  );
  const data = await response.json();
  return data[0];
}
```

4. **Caching Strategy**

- Cache responses in Supabase
- Refresh every 24 hours for profiles
- Refresh every 5 minutes for prices
- This keeps you well under the 250/day limit

## 💡 Best Practice: Hybrid Approach

1. **For MVP/Development:**

   - Use static seed data for 10-20 sample companies
   - Build all features without API dependency

2. **For Production:**

   - Use Financial Modeling Prep (250 free calls/day)
   - Cache everything in Supabase
   - Only fetch when data is stale (24hr+ old)

3. **Scaling:**
   - If you need more calls, upgrade FMP ($14/month for 5,000/day)
   - Or use multiple free APIs as fallbacks

## 🎯 My Recommendation

**For your Supply Chain Map project:**

1. **Now (Development):**

   - Create seed data for your 150 featured companies
   - Store in Supabase manually or via one-time import
   - Build all UI/features with this data

2. **Before Launch:**

   - Sign up for Financial Modeling Prep (FREE)
   - Create cron job to refresh data daily
   - Use cached data for all page loads

3. **After Launch:**
   - Monitor API usage
   - Add more caching if needed
   - Consider upgrading FMP if you get lots of traffic

This approach:

- ✅ Works immediately
- ✅ No API headaches during development
- ✅ Free for production
- ✅ Scales when needed

## 📝 Next Steps

Would you like me to:

1. **Create a seed data file** with your 150 featured companies?
2. **Set up Financial Modeling Prep** integration?
3. **Build a data import script** to populate Supabase?

Let me know your preference!

