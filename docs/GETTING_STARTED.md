# Getting Started Guide

This guide will help you set up the Supply Chain Map platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **npm** or **pnpm**: Comes with Node.js
- **Git**: [Download here](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd supplychainmap
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:

- Next.js 14
- React 18
- Supabase client
- yahoo-finance2
- Tailwind CSS
- UI components

## Step 3: Setup Supabase

### Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"

### Configure Your Project

1. **Project Name**: `supply-chain-map`
2. **Database Password**: Generate a strong password
3. **Region**: Choose closest to your location
4. Click "Create new project" (takes ~2 minutes)

### Get Your API Keys

Once your project is ready:

1. Go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. You'll need two keys:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Starts with `eyJhbG...`
   - **service_role key**: Also starts with `eyJhbG...` (keep this secret!)

### Setup Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run** (bottom right)

You should see "Success. No rows returned" - this is correct!

## Step 4: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` in your text editor

3. Replace the placeholder values with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Never commit `.env.local` to version control!

## Step 5: Run the Development Server

```bash
npm run dev
```

Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

You should see the Supply Chain Map homepage! 🎉

## Step 6: Verify Everything Works

### Test the Homepage

- You should see a grid of 20+ industries
- Each industry card should have an icon and description

### Test Industry Pages

1. Click on any industry (e.g., "Semiconductors")
2. You should see:
   - Industry overview
   - Value chain segments
   - Featured companies
   - Company cards with live stock data

### Test Company Search

1. Click "Companies" in the navigation
2. Try searching for a ticker like "AAPL" or "MSFT"
3. Company cards should load with real-time data from Yahoo Finance

### Test Company Profile

1. Click on any company card
2. You should see:
   - Company name and ticker
   - Market cap, employees, country
   - Company description
   - Industry classification

## Common Issues and Solutions

### Issue: "Failed to fetch company data"

**Solution**: This is normal on first load. Yahoo Finance data loads dynamically. Wait a few seconds and refresh.

### Issue: Supabase connection error

**Solutions**:

1. Verify your `.env.local` file has correct credentials
2. Check that your Supabase project is running (green status in dashboard)
3. Ensure you've run the database migration SQL

### Issue: Build errors with TypeScript

**Solution**:

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Issue: Styling looks broken

**Solution**: Make sure Tailwind CSS is working:

```bash
# Check if PostCSS config exists
ls postcss.config.js

# Restart dev server
npm run dev
```

## Understanding the Project Structure

```
supplychainmap/
├── app/                      # Next.js 14 App Router
│   ├── page.tsx             # Homepage (industry grid)
│   ├── industries/          # Industry pages
│   ├── companies/           # Company pages
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── layout/              # Header, Footer
│   └── companies/           # Company-specific components
├── lib/                     # Utilities and helpers
│   ├── data/                # Static data (industries)
│   ├── supabase/            # Database client
│   └── yahoo-finance/       # Yahoo Finance integration
├── docs/                    # Documentation
└── supabase/                # Database migrations
```

## Next Steps

### 1. Explore the Data

Browse through different industries and companies. All data is fetched live from Yahoo Finance.

### 2. Customize Industries

Edit `lib/data/industries.ts` to:

- Add new industries
- Modify descriptions
- Change featured companies
- Update colors and icons

### 3. Product-centric value chain (standard)

We use a product-first model across all industries. Each stage (Upstream/Midstream/Downstream) contains products, which can contain nested sub-products.

Rules for data authors:

1. Leaf-only company assignment
   - Attach companies only to leaf products. Parents are structural containers and should not hold companies.
2. Deduped counting
   - A product’s company count is the number of UNIQUE companies in its subtree (itself + descendants), deduped by ticker/name.
   - Stage totals are the deduped union across all leaves in that stage.
   - Sibling counts may not arithmetically sum to the parent due to deduping and legitimate overlaps.
3. Overlap policy
   - If a company legitimately appears in multiple leaves, list it in each relevant leaf. Totals remain deduped at parent/stage levels.
4. Listing metadata
   - For each company, set `listing` to `US | ADR | Foreign | Private`. Provide `ticker` for US/ADR; optionally add `country` and `url` for Foreign/Private.
5. Example (Semiconductors Midstream)
   - Wafer Fabrication
     - Foundries & IDMs (TSM, INTC, MU, GFS, UMC)
     - Production Equipment → Lithography (ASML), Etch (AMAT, LRCX), Deposition & CMP (AMAT, LRCX), Inspection/Metrology (KLAC)
     - Chemicals & Materials → Photoresists (DOW, DD, JSR), Ultra‑Pure Gases (LIN, APD), Silicon Wafers (SUMCO, Shin‑Etsu), Fab Consumables (ENTG)
     - Photomasks (PLAB, DNP)

Types:

```ts
export type ListingType = "US" | "ADR" | "Foreign" | "Private";

export interface ProductCompanyRef {
  name: string;
  ticker?: string;
  listing: ListingType;
  exchange?: string;
  country?: string;
  url?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;
  companiesDetailed?: ProductCompanyRef[];
  subProducts?: ProductCategory[];
  flowsTo?: string[];
  tags?: string[];
}
```

Rendering:

- The UI aggregates companies recursively for each product (and stage) and dedupes by ticker/name. Sub-product tiles show their own counts; parent products show the deduped total for the subtree.

### 4. Modify the Design

- Edit colors in `app/globals.css`
- Change component styles in `components/`
- Update Tailwind config in `tailwind.config.ts`

## Development Tips

### Hot Reload

Next.js automatically reloads when you save files. Just edit and save - your browser updates instantly!

### TypeScript

The project uses TypeScript for type safety. Your editor should show helpful autocomplete and error checking.

### Data Fetching

- **Server Components**: Fetch data directly (default in App Router)
- **Client Components**: Use `'use client'` directive for interactive components
- **API Routes**: Located in `app/api/`

### Caching Strategy

Yahoo Finance requests should be cached to avoid rate limits:

1. Store company data in Supabase after first fetch
2. Refresh data every 24 hours
3. Use Supabase as primary data source

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Type checking
npm run type-check   # Check TypeScript errors

# Linting
npm run lint         # Run ESLint
```

## Learning Resources

### Next.js 14

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### Supabase

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)

### Yahoo Finance Integration

- [yahoo-finance2 npm package](https://www.npmjs.com/package/yahoo-finance2)

### Tailwind CSS

- [Tailwind Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## Getting Help

If you encounter issues:

1. **Check Documentation**: See `/docs` folder
2. **Console Logs**: Open browser DevTools (F12) to check for errors
3. **Server Logs**: Check your terminal for server-side errors
4. **Supabase Logs**: Check Supabase dashboard > Logs

## What's Next?

Now that you have the platform running:

1. **Explore the codebase**: Read through the files to understand the architecture
2. **Add features**: Implement value chain visualizations
3. **Improve data**: Add more companies and industries
4. **Deploy**: Follow `docs/DEPLOYMENT.md` to deploy to Vercel

Happy coding! 🚀
