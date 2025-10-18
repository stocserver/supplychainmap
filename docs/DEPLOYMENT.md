# Deployment Guide

This guide covers deploying the Supply Chain Map platform to production.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier available)
- Vercel account (recommended) or other hosting platform
- Git repository

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: supply-chain-map
   - Database Password: (generate strong password)
   - Region: (choose closest to your users)

### 2. Get API Credentials

From your Supabase project dashboard:

1. Go to Settings > API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secure!)

### 3. Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Setup Database Schema

Run the SQL from `docs/DATABASE.md` in the Supabase SQL editor:

1. Go to SQL Editor in Supabase dashboard
2. Copy schema from DATABASE.md
3. Run the SQL commands

### 5. Seed Initial Data (Optional)

```bash
# Run seed file
supabase db reset
```

## Vercel Deployment (Recommended)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Connect to Vercel

```bash
# Login
vercel login

# Link project
vercel link
```

### 3. Set Environment Variables

In Vercel dashboard or via CLI:

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

Or in Vercel dashboard:

1. Go to Project Settings > Environment Variables
2. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `NEXT_PUBLIC_APP_URL`: Your production URL

### 4. Deploy

```bash
# Deploy to production
vercel --prod
```

Or push to GitHub main branch for automatic deployment.

## Alternative: Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. Build and Run

```bash
# Build image
docker build -t supply-chain-map .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_secret_key \
  supply-chain-map
```

### 3. Docker Compose

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## Environment Configuration

### Production Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Optional: Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

## Custom Domain Setup

### Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS records as instructed

### Cloudflare (Optional)

For additional CDN and security:

1. Add site to Cloudflare
2. Update nameservers
3. Enable:
   - SSL/TLS encryption
   - Auto minify
   - Brotli compression
   - Rocket Loader

## Performance Optimization

### 1. Enable Caching

```typescript
// next.config.js
const nextConfig = {
  images: {
    domains: ["logo.clearbit.com"],
  },
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=300, stale-while-revalidate=600",
        },
      ],
    },
  ],
};
```

### 2. Image Optimization

Already configured in `next.config.js` for company logos.

### 3. Database Connection Pooling

Supabase provides this by default.

## Monitoring and Analytics

### 1. Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

### 3. Uptime Monitoring

Use services like:

- UptimeRobot (free)
- Pingdom
- StatusCake

## Backup Strategy

### Database Backups

Supabase automatic backups:

- Free tier: Daily backups (7 days retention)
- Pro tier: Hourly backups (30 days retention)

### Manual Backup

```bash
# Export database
supabase db dump > backup-$(date +%Y%m%d).sql

# Restore from backup
psql -h your-host -U postgres -d postgres < backup.sql
```

## Security Checklist

- [ ] Environment variables secured
- [ ] Service role key not exposed
- [ ] Row Level Security enabled on all tables
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] HTTPS enabled
- [ ] Security headers configured

## Post-Deployment

### 1. Test All Features

- Homepage loads correctly
- Industry pages display data
- Company search works
- API endpoints respond
- Yahoo Finance integration active

### 2. Setup Monitoring

- Configure uptime monitoring
- Setup error tracking
- Enable analytics

### 3. SEO Optimization

```typescript
// app/layout.tsx
export const metadata = {
  title: "Supply Chain Map - US Industry Value Chains",
  description:
    "Explore US public companies through their industry value chains",
  openGraph: {
    title: "Supply Chain Map",
    description:
      "Explore US public companies through their industry value chains",
    url: "https://your-domain.com",
    siteName: "Supply Chain Map",
  },
};
```

## Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Database Connection Issues

- Check Supabase project status
- Verify environment variables
- Check database connection pooling limits

### API Rate Limits

- Implement caching
- Add rate limiting middleware
- Use Supabase for data storage instead of real-time Yahoo Finance calls

## Scaling Considerations

### Application Level

1. **Edge Functions**: Use Vercel Edge Functions for API routes
2. **ISR**: Implement Incremental Static Regeneration
3. **CDN**: Use Cloudflare or similar CDN

### Database Level

1. **Read Replicas**: Available on Supabase Pro plan
2. **Connection Pooling**: Already configured
3. **Indexes**: Optimize based on query patterns

## Support

For deployment issues:

- Vercel: [vercel.com/support](https://vercel.com/support)
- Supabase: [supabase.com/support](https://supabase.com/support)
- Project Issues: GitHub Issues

