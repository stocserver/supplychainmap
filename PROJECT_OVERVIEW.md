# Supply Chain Map - Project Overview

A comprehensive web application for exploring US public companies through their industry value chains and supply chain relationships.

## 🎯 Project Goals

1. **Investor Education**: Help investors understand companies within their industry context
2. **Value Chain Analysis**: Visualize complete supply chains from raw materials to end products
3. **Market Intelligence**: Provide real-time company data and industry insights
4. **Supply Chain Mapping**: Identify upstream and downstream relationships

## 🏗️ Architecture

### Frontend (Next.js 14)

```
Next.js 14 (App Router)
├── Server Components (default)
│   ├── Data fetching from Supabase
│   ├── Yahoo Finance integration
│   └── SEO optimization
└── Client Components ('use client')
    ├── Interactive search
    ├── Dynamic company cards
    └── Form interactions
```

### Backend (Supabase + API Routes)

```
Supabase (PostgreSQL)
├── Companies table (cached Yahoo Finance data)
├── Industries & Value Chains (curated data)
├── Relationships (supply chain connections)
└── Row Level Security (public read access)

Next.js API Routes
├── /api/companies/:ticker (Yahoo Finance proxy)
├── /api/industries (industry data)
└── Future: search, filters, user data
```

### Data Flow

```
User Request
    ↓
Next.js Server Component
    ↓
Supabase (check cache)
    ↓ (if not cached or expired)
Yahoo Finance API
    ↓
Store in Supabase
    ↓
Return to Client
```

## 📊 Data Sources

### Yahoo Finance (Primary)

- **What**: Real-time stock quotes, company profiles, financials
- **How**: yahoo-finance2 npm package
- **Caching**: 24 hours for profile data, 5 minutes for quotes
- **Rate Limits**: None specified (but should be cached)

### Curated Data (Secondary)

- **What**: Industry classifications, value chains, relationships
- **How**: Manually researched and maintained
- **Storage**: Supabase + static files
- **Update Frequency**: As needed

## 🎨 Design Philosophy

Inspired by Taiwan's TPEX platform with modern improvements:

### Layout

- **Homepage**: Clean grid of industry cards (similar to TPEX)
- **Industry Pages**: Detailed value chain segments
- **Company Pages**: Comprehensive profiles
- **Responsive**: Mobile-first design

### Colors

- **Primary**: Blue (#0066CC) - Trust, technology
- **Secondary**: Green (#10B981) - Growth, positive change
- **Accent**: Purple (#8B5CF6) - Innovation
- **Semantic**: Red/Green for market movement

### Typography

- **Font**: Inter (clean, modern, readable)
- **Hierarchy**: Clear heading sizes
- **Spacing**: Generous white space

## 📁 File Structure

```
supplychainmap/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage (industry grid)
│   ├── globals.css              # Global styles
│   │
│   ├── industries/              # Industry section
│   │   ├── page.tsx            # Industry list
│   │   └── [slug]/             # Dynamic industry pages
│   │       └── page.tsx        # Industry detail
│   │
│   ├── companies/               # Company section
│   │   ├── page.tsx            # Company search/list
│   │   └── [ticker]/           # Dynamic company pages
│   │       └── page.tsx        # Company profile
│   │
│   ├── about/                   # About page
│   │   └── page.tsx
│   │
│   └── api/                     # API Routes
│       └── companies/
│           └── [ticker]/
│               └── route.ts     # Company data endpoint
│
├── components/                   # React Components
│   ├── ui/                      # Base UI (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   │
│   ├── layout/                  # Layout components
│   │   ├── header.tsx
│   │   └── footer.tsx
│   │
│   └── companies/               # Domain components
│       └── company-card.tsx
│
├── lib/                         # Utilities & Logic
│   ├── utils.ts                # Helper functions
│   │
│   ├── data/                   # Static data
│   │   └── industries.ts      # Industry definitions
│   │
│   ├── supabase/               # Database
│   │   ├── client.ts          # Client-side
│   │   └── server.ts          # Server-side
│   │
│   └── yahoo-finance/          # External API
│       └── client.ts          # Yahoo Finance wrapper
│
├── supabase/                    # Database
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── docs/                        # Documentation
│   ├── API.md                  # API reference
│   ├── DATABASE.md             # Database schema
│   ├── DEPLOYMENT.md           # Deploy guide
│   ├── GETTING_STARTED.md      # Setup guide
│   └── CONTRIBUTING.md         # Contributor guide
│
├── Configuration Files
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.ts      # Tailwind config
│   ├── next.config.js          # Next.js config
│   ├── postcss.config.js       # PostCSS config
│   └── .eslintrc.json         # ESLint config
│
└── Environment
    ├── .env.local.example      # Environment template
    └── .gitignore             # Git ignore rules
```

## 🔄 Development Workflow

### Local Development

```bash
# 1. Setup
npm install
cp .env.local.example .env.local
# Edit .env.local with Supabase credentials

# 2. Database
# Run migration in Supabase SQL editor

# 3. Develop
npm run dev
# Open http://localhost:3000

# 4. Type check
npm run type-check

# 5. Lint
npm run lint
```

### Adding New Features

1. **New Industry**: Edit `lib/data/industries.ts`
2. **New Component**: Add to `components/`
3. **New Page**: Add to `app/`
4. **New API**: Add to `app/api/`
5. **Database Change**: Create migration in `supabase/migrations/`

## 📈 Future Enhancements

### Phase 1 (Current - MVP)

- [x] Industry browsing
- [x] Company search
- [x] Real-time market data
- [x] Responsive design
- [ ] Performance optimization

### Phase 2 (Next)

- [ ] Interactive value chain diagrams (React Flow)
- [ ] Advanced search and filters
- [ ] Supply chain relationship visualization
- [ ] Company comparison tool
- [ ] User accounts (watchlists)

### Phase 3 (Future)

- [ ] ESG metrics integration
- [ ] News and SEC filings
- [ ] Industry trend analysis
- [ ] Export functionality (CSV, PDF)
- [ ] API for developers
- [ ] Mobile app (React Native)

### Phase 4 (Advanced)

- [ ] AI-powered insights
- [ ] Predictive analytics
- [ ] Custom alerts
- [ ] Collaborative features
- [ ] Premium subscriptions

## 🔧 Technology Decisions

### Why Next.js 14?

- Server Components for performance
- Built-in API routes
- Excellent SEO
- Great developer experience
- Easy deployment (Vercel)

### Why Supabase?

- PostgreSQL (robust, scalable)
- Real-time capabilities
- Row Level Security
- Free tier generous
- Excellent DX
- Built-in auth (future)

### Why Yahoo Finance?

- Free, no API key needed
- Comprehensive data
- Reliable uptime
- Well-maintained npm package
- Real-time quotes

### Why Tailwind CSS?

- Utility-first approach
- Fast development
- Consistent design
- Small bundle size
- Great with shadcn/ui

## 🎯 Target Audience

### Primary Users

1. **Individual Investors**: Research companies and industries
2. **Financial Analysts**: Analyze value chains and relationships
3. **Students**: Learn about industries and supply chains
4. **Researchers**: Study industry dynamics

### Use Cases

1. **Investment Research**: "What companies are in the EV battery supply chain?"
2. **Competitor Analysis**: "Who are NVIDIA's competitors and suppliers?"
3. **Industry Overview**: "What are the segments of the semiconductor industry?"
4. **Market Trends**: "Which clean energy companies should I watch?"

## 📊 Success Metrics

### MVP Success

- [ ] 1,000+ monthly active users
- [ ] <2s page load time
- [ ] 95%+ uptime
- [ ] Mobile responsive (works on all devices)

### Growth Metrics

- Monthly active users
- Page views per session
- Search usage
- Average session duration
- Return visitor rate

### Technical Metrics

- Lighthouse score >90
- Core Web Vitals (green)
- Error rate <1%
- API response time <500ms

## 🔒 Security Considerations

### Data Protection

- Environment variables secured
- Service role key never exposed to client
- RLS enabled on all Supabase tables
- Input sanitization on all forms

### API Security

- Rate limiting (future)
- CORS configuration
- Error messages don't leak sensitive info
- Proper HTTP status codes

### Best Practices

- Dependencies kept up to date
- Regular security audits
- HTTPS in production
- Content Security Policy

## 🌍 Deployment Strategy

### Development

- Local: `npm run dev`
- Hot reload enabled
- Source maps for debugging

### Staging (Future)

- Vercel preview deployments
- Separate Supabase project
- Test data

### Production

- Vercel (primary recommendation)
- Custom domain
- Environment variables via Vercel
- Analytics enabled
- Error tracking (Sentry)

## 📝 Contributing

See `docs/CONTRIBUTING.md` for:

- Code of conduct
- How to contribute
- Coding standards
- PR process
- Areas needing help

## 📞 Support & Resources

### Documentation

- `/docs` - All documentation
- Code comments in complex areas
- TypeScript types for clarity

### External Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 🙏 Acknowledgments

- Inspired by [TPEX Industrial Value Chain Platform](https://ic.tpex.org.tw/)
- Data powered by Yahoo Finance
- Built with open source tools
- Community contributions welcome

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**License**: MIT

