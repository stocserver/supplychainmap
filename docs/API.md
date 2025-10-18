# API Documentation

The Supply Chain Map platform provides several API endpoints for accessing company and industry data.

## Base URL

```
http://localhost:3000/api (development)
https://your-domain.com/api (production)
```

## Authentication

Currently, all endpoints are public. Future versions will include API key authentication.

## Endpoints

### Companies

#### Get Company by Ticker

Get detailed information about a specific company.

```
GET /api/companies/:ticker
```

**Parameters:**

- `ticker` (string, required): Stock ticker symbol (e.g., AAPL, MSFT)

**Response:**

```json
{
  "ticker": "AAPL",
  "name": "Apple Inc.",
  "price": 175.5,
  "change": 2.5,
  "changePercent": 1.45,
  "marketCap": 2800000000000,
  "volume": 50000000,
  "exchange": "NASDAQ"
}
```

**Example:**

```bash
curl http://localhost:3000/api/companies/AAPL
```

#### Get Company Profile

Get comprehensive company profile including sector, industry, and description.

```
GET /api/companies/:ticker/profile
```

**Response:**

```json
{
  "ticker": "AAPL",
  "name": "Apple Inc.",
  "sector": "Technology",
  "industry": "Consumer Electronics",
  "description": "Apple Inc. designs, manufactures...",
  "website": "https://www.apple.com",
  "employees": 164000,
  "country": "US",
  "marketCap": 2800000000000,
  "exchange": "NASDAQ"
}
```

#### Search Companies

Search for companies by name or ticker.

```
GET /api/companies/search?q=:query
```

**Parameters:**

- `q` (string, required): Search query

**Response:**

```json
{
  "results": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "exchange": "NASDAQ"
    }
  ]
}
```

### Industries

#### List All Industries

Get all industries with basic information.

```
GET /api/industries
```

**Response:**

```json
{
  "industries": [
    {
      "id": "semiconductors",
      "name": "Semiconductors",
      "slug": "semiconductors",
      "description": "Chip design, manufacturing, and equipment",
      "companyCount": 8
    }
  ]
}
```

#### Get Industry Details

Get detailed information about a specific industry.

```
GET /api/industries/:slug
```

**Parameters:**

- `slug` (string, required): Industry slug (e.g., semiconductors)

**Response:**

```json
{
  "id": "semiconductors",
  "name": "Semiconductors",
  "slug": "semiconductors",
  "description": "Chip design, manufacturing, and equipment",
  "subcategories": ["Chip Design", "Fab Equipment", "Manufacturing"],
  "companies": [
    {
      "ticker": "NVDA",
      "name": "NVIDIA Corporation",
      "marketCap": 1200000000000
    }
  ]
}
```

### Product-centric model

Industries can also be defined with a product-first value chain using per-industry files under `lib/industries/*.products.ts`. The model uses leaf-only company assignment and deduped counts.

```ts
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;
  companiesDetailed?: ProductCompanyRef[]; // attach to leaf nodes
  subProducts?: ProductCategory[];
}
```

Counting rules:

- Product count = unique companies in its subtree (itself + descendants), deduped by ticker/name.
- Stage totals = deduped union of all leaf companies in that stage.
- Sibling counts may not arithmetically sum to parent due to overlaps; this is expected.

#### Get Industry Companies

Get all companies in a specific industry.

```
GET /api/industries/:slug/companies
```

**Response:**

```json
{
  "companies": [
    {
      "ticker": "NVDA",
      "name": "NVIDIA Corporation",
      "price": 450.0,
      "marketCap": 1200000000000
    }
  ]
}
```

### Value Chains

#### Get Value Chain

Get value chain information with positioned companies.

```
GET /api/value-chains/:id
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Semiconductor Value Chain",
  "industry": "Semiconductors",
  "segments": [
    {
      "position": "upstream",
      "name": "Materials & Equipment",
      "companies": ["AMAT", "ASML"]
    },
    {
      "position": "midstream",
      "name": "Manufacturing",
      "companies": ["TSM", "INTC"]
    },
    {
      "position": "downstream",
      "name": "Design & Distribution",
      "companies": ["NVDA", "AMD"]
    }
  ]
}
```

## Yahoo Finance Integration

The platform uses `yahoo-finance2` npm package to fetch real-time market data.

### Caching Strategy

1. **Company Quotes**: Cached for 5 minutes
2. **Company Profiles**: Cached for 24 hours
3. **Search Results**: Cached for 1 hour

### Rate Limiting

Currently no rate limiting implemented. Future versions will include:

- 100 requests per 15 minutes per IP
- 1000 requests per day for authenticated users

## Error Handling

All endpoints return standard HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

**Error Response Format:**

```json
{
  "error": "Company not found",
  "statusCode": 404
}
```

## Usage Examples

### JavaScript/TypeScript

```typescript
// Fetch company data
async function getCompany(ticker: string) {
  const response = await fetch(`/api/companies/${ticker}`);
  if (!response.ok) {
    throw new Error("Company not found");
  }
  return await response.json();
}

// Search companies
async function searchCompanies(query: string) {
  const response = await fetch(`/api/companies/search?q=${query}`);
  return await response.json();
}
```

### Python

```python
import requests

# Get company data
def get_company(ticker):
    response = requests.get(f'http://localhost:3000/api/companies/{ticker}')
    return response.json()

# Search companies
def search_companies(query):
    response = requests.get(
        f'http://localhost:3000/api/companies/search',
        params={'q': query}
    )
    return response.json()
```

## Future Enhancements

- [ ] GraphQL API
- [ ] WebSocket for real-time quotes
- [ ] Bulk data export
- [ ] Historical price data
- [ ] Financial statements API
- [ ] ESG data integration
