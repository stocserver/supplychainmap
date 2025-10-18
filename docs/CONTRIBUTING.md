# Contributing Guide

Thank you for considering contributing to Supply Chain Map! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title**: Describe the issue concisely
2. **Description**: Explain what happened vs. what you expected
3. **Steps to reproduce**: List exact steps to trigger the bug
4. **Environment**: OS, browser, Node version
5. **Screenshots**: If applicable

**Example**:

```
Title: Company search returns no results

Description:
When searching for "AAPL" in the companies page, no results are displayed
even though the company exists in the data.

Steps to Reproduce:
1. Go to /companies
2. Type "AAPL" in search box
3. Observe no results shown

Environment:
- OS: Windows 11
- Browser: Chrome 120
- Node: v18.17.0
```

### Suggesting Features

For feature requests, create an issue with:

1. **Clear title**: What feature you want
2. **Problem**: What problem does this solve?
3. **Solution**: Describe your proposed solution
4. **Alternatives**: What alternatives have you considered?
5. **Additional context**: Screenshots, mockups, etc.

### Contributing Code

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/supplychainmap.git
cd supplychainmap
```

#### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

#### 3. Make Your Changes

Follow our coding standards (see below).

#### 4. Test Your Changes

```bash
# Run the dev server
npm run dev

# Check TypeScript
npm run type-check

# Run linter
npm run lint
```

#### 5. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add value chain visualization"
git commit -m "fix: resolve company search filter bug"
git commit -m "docs: update API documentation"
```

Commit types:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, missing semi colons, etc.
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding tests
- `chore:` - Updating build tasks, package manager configs, etc.

#### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:

- Clear title describing the change
- Description of what changed and why
- Link to related issues
- Screenshots if UI changes

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// Good
interface CompanyData {
  ticker: string;
  name: string;
  marketCap: number;
}

// Avoid
const data: any = {};
```

### React/Next.js

- Use functional components
- Use Server Components by default
- Add `'use client'` only when needed
- Follow Next.js 14 App Router conventions

```typescript
// Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component (when needed)
("use client");
export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <div onClick={() => setState()}>Click me</div>;
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow existing color/spacing patterns
- Use shadcn/ui components when available
- Keep components responsive

```typescript
// Good
<div className="flex items-center gap-4 rounded-lg bg-card p-6">

// Avoid custom CSS unless necessary
<div style={{ display: 'flex', padding: '24px' }}>
```

### File Organization

```
app/
  feature/
    page.tsx              # Main page
    layout.tsx            # Layout if needed
    loading.tsx           # Loading state
    error.tsx             # Error boundary

components/
  feature/
    feature-card.tsx      # Specific component
    feature-list.tsx      # Another component

lib/
  feature/
    client.ts             # API client
    utils.ts              # Utility functions
    types.ts              # TypeScript types
```

### Naming Conventions

- **Components**: PascalCase (`CompanyCard.tsx`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`CompanyData`)

### Code Comments

```typescript
// Good: Explain WHY, not WHAT
// Yahoo Finance rate limits require caching
const cachedData = await getFromCache(ticker);

// Avoid: Obvious comments
// Set the ticker to AAPL
const ticker = "AAPL";
```

## API Changes

When adding/modifying API routes:

1. Update `docs/API.md`
2. Add proper error handling
3. Include TypeScript types
4. Add rate limiting if needed

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Your code
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Database Changes

When modifying the database schema:

1. Create a new migration file
2. Update `docs/DATABASE.md`
3. Test locally before submitting

```sql
-- supabase/migrations/002_description.sql
ALTER TABLE companies ADD COLUMN new_field TEXT;
CREATE INDEX idx_companies_new_field ON companies(new_field);
```

## Documentation

Update documentation when:

- Adding new features
- Changing APIs
- Modifying database schema
- Changing deployment process

Documentation files:

- `README.md` - Overview and quick start
- `docs/API.md` - API endpoints
- `docs/DATABASE.md` - Database schema
- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/GETTING_STARTED.md` - Setup instructions

## Testing Checklist

Before submitting a PR, verify:

- [ ] Code runs without errors
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Linter passes (`npm run lint`)
- [ ] All pages load correctly
- [ ] Changes work on mobile
- [ ] No console errors
- [ ] Documentation updated
- [ ] Commit messages follow convention

## Review Process

1. **Automated checks**: GitHub Actions will run tests
2. **Code review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, we'll merge your PR

## Areas for Contribution

### High Priority

- Interactive value chain visualizations
- Supply chain relationship mapping
- Performance optimizations
- Mobile responsiveness improvements

### Medium Priority

- Additional industry categories
- ESG metrics integration
- News/filings integration
- User authentication

### Documentation

- Improve API documentation
- Add more code examples
- Create video tutorials
- Translate documentation

### Data Quality

- Add more companies to industries
- Verify supply chain relationships
- Update industry descriptions
- Add company logos

## Questions?

- Open an issue with the `question` label
- Check existing documentation in `/docs`
- Review closed PRs for examples

## Recognition

Contributors will be:

- Listed in README.md
- Credited in release notes
- Given shout-outs on social media

Thank you for contributing to Supply Chain Map! 🙏

