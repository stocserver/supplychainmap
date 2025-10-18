# Quick Start - Supply Chain Map

Get up and running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free)

## Setup Steps

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Setup Supabase (2 min)

**Create Project:**

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Click "New Project"
3. Name: `supply-chain-map`
4. Wait ~2 minutes for project to initialize

**Get API Keys:**

1. Go to Project Settings → API
2. Copy these values:
   - Project URL
   - `anon` public key
   - `service_role` secret key

**Setup Database:**

1. Go to SQL Editor in Supabase
2. Copy all SQL from `supabase/migrations/001_initial_schema.sql`
3. Paste and click "Run"

### 3. Configure Environment (1 min)

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Run Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## What You'll See

✅ **Homepage**: Grid of 20+ industries  
✅ **Industry Pages**: Click any industry to see details  
✅ **Companies**: Real-time stock data from Yahoo Finance  
✅ **Search**: Find companies by ticker

## Test It Out

1. **Homepage**: Click "Semiconductors"
2. **Industry Page**: See NVDA, AMD, INTC companies
3. **Company Card**: Click on any company
4. **Company Profile**: View full details

## Project Structure

```
├── app/              ← Pages and routes
├── components/       ← React components
├── lib/              ← Utilities and data
├── docs/             ← Full documentation
└── supabase/         ← Database schema
```

## Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # Check TypeScript
npm run lint         # Run linter
```

## Next Steps

- ✏️ **Customize**: Edit `lib/data/industries.ts` to add industries
- 🎨 **Style**: Modify colors in `app/globals.css`
- 📚 **Learn More**: Read `docs/GETTING_STARTED.md`
- 🚀 **Deploy**: Follow `docs/DEPLOYMENT.md`

## Need Help?

- **Full Guide**: See `docs/GETTING_STARTED.md`
- **API Docs**: See `docs/API.md`
- **Database**: See `docs/DATABASE.md`

## Troubleshooting

**"Company data not loading"**  
→ Wait a few seconds, Yahoo Finance loads dynamically

**"Supabase connection error"**  
→ Check your `.env.local` credentials

**Build errors**  
→ Delete `.next` and `node_modules`, then `npm install`

---

**That's it!** You now have a working supply chain platform.

For detailed information, see the full documentation in the `/docs` folder.

