import { ValueChainStageProducts } from "@/lib/data/industries"

export const bankingProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Infrastructure & Technology',
    layout: 'flow',
    products: [
      {
        id: 'core-banking-tech',
        name: 'Core Banking Technology',
        description: 'Core banking systems and infrastructure platforms',
        longDescription: 'Technology platforms that provide the foundational systems for banking operations including account management, transaction processing, and customer data management.',
        companiesDetailed: [
          { name: 'Fiserv', ticker: 'FISV', listing: 'US' },
          { name: 'Fidelity National Information Services', ticker: 'FIS', listing: 'US' },
          { name: 'Jack Henry & Associates', ticker: 'JKHY', listing: 'US' },
          { name: 'Temenos', ticker: 'TEMN', listing: 'Foreign' },
          { name: 'Infosys', ticker: 'INFY', listing: 'ADR' },
          { name: 'TCS', ticker: 'TCS', listing: 'ADR' }
        ],
        tags: ['Core Banking', 'Transaction Processing', 'Account Management']
      },
      {
        id: 'financial-data',
        name: 'Financial Data & Analytics',
        description: 'Financial data providers and analytics platforms',
        longDescription: 'Companies that provide financial data, market intelligence, and analytics tools used by banks for risk management, compliance, and decision-making.',
        companiesDetailed: [
          { name: 'Bloomberg', ticker: 'BB', listing: 'US' },
          { name: 'Refinitiv', ticker: 'TRI', listing: 'US' },
          { name: 'FactSet', ticker: 'FDS', listing: 'US' },
          { name: 'S&P Global', ticker: 'SPGI', listing: 'US' },
          { name: 'MSCI', ticker: 'MSCI', listing: 'US' },
          { name: 'Morningstar', ticker: 'MORN', listing: 'US' }
        ],
        tags: ['Market Data', 'Analytics', 'Risk Management']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Banking Services',
    layout: 'hybrid',
    products: [
      {
        id: 'commercial-banking',
        name: 'Commercial Banking',
        description: 'Business banking services and corporate lending',
        longDescription: 'Banking services for businesses including commercial loans, treasury management, trade finance, and corporate banking solutions.',
        companiesDetailed: [
          { name: 'JPMorgan Chase', ticker: 'JPM', listing: 'US' },
          { name: 'Bank of America', ticker: 'BAC', listing: 'US' },
          { name: 'Wells Fargo', ticker: 'WFC', listing: 'US' },
          { name: 'Citigroup', ticker: 'C', listing: 'US' },
          { name: 'Goldman Sachs', ticker: 'GS', listing: 'US' },
          { name: 'Morgan Stanley', ticker: 'MS', listing: 'US' },
          { name: 'U.S. Bancorp', ticker: 'USB', listing: 'US' },
          { name: 'PNC Financial', ticker: 'PNC', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'corporate-lending',
            name: 'Corporate Lending',
            description: 'Large corporate loans and credit facilities',
            longDescription: 'Origination and portfolio management of revolving credit facilities, term loans, and bridge financing for investment-grade and leveraged borrowers. Activities include underwriting, syndication, covenant structuring, pricing, and ongoing credit monitoring across cycles. Revenue is driven by fees and net interest income; risks include credit losses, concentration, and interest-rate exposure.',
            companiesDetailed: [
              { name: 'JPMorgan Chase', ticker: 'JPM', listing: 'US' },
              { name: 'Bank of America', ticker: 'BAC', listing: 'US' },
              { name: 'Goldman Sachs', ticker: 'GS', listing: 'US' }
            ]
          },
          {
            id: 'treasury-services',
            name: 'Treasury Services',
            description: 'Cash management and treasury solutions',
            longDescription: 'End-to-end cash and liquidity services for corporates, including payables, receivables, lockbox, virtual accounts, FX, and short-term investing. Platforms integrate with ERP/TMS systems to optimize working capital and provide real-time visibility. Key differentiators include global network reach, API connectivity, and fraud controls.',
            companiesDetailed: [
              { name: 'JPMorgan Chase', ticker: 'JPM', listing: 'US' },
              { name: 'Bank of America', ticker: 'BAC', listing: 'US' },
              { name: 'Wells Fargo', ticker: 'WFC', listing: 'US' }
            ]
          }
        ],
        tags: ['Corporate Banking', 'Commercial Lending', 'Treasury Management']
      },
      {
        id: 'investment-banking',
        name: 'Investment Banking',
        description: 'Capital markets, M&A, and advisory services',
        longDescription: 'Investment banking services including mergers & acquisitions, capital raising, trading, and financial advisory services.',
        companiesDetailed: [
          { name: 'Goldman Sachs', ticker: 'GS', listing: 'US' },
          { name: 'Morgan Stanley', ticker: 'MS', listing: 'US' },
          { name: 'JPMorgan Chase', ticker: 'JPM', listing: 'US' },
          { name: 'Bank of America', ticker: 'BAC', listing: 'US' },
          { name: 'Citigroup', ticker: 'C', listing: 'US' },
          { name: 'Credit Suisse', ticker: 'CS', listing: 'ADR' },
          { name: 'Deutsche Bank', ticker: 'DB', listing: 'ADR' }
        ],
        tags: ['M&A', 'Capital Markets', 'Trading', 'Advisory']
      },
      {
        id: 'wealth-management',
        name: 'Wealth Management',
        description: 'Private banking and investment advisory services',
        longDescription: 'High-net-worth individual and family wealth management services including investment advisory, estate planning, and private banking.',
        companiesDetailed: [
          { name: 'Morgan Stanley', ticker: 'MS', listing: 'US' },
          { name: 'Goldman Sachs', ticker: 'GS', listing: 'US' },
          { name: 'Charles Schwab', ticker: 'SCHW', listing: 'US' },
          { name: 'Raymond James', ticker: 'RJF', listing: 'US' },
          { name: 'LPL Financial', ticker: 'LPLA', listing: 'US' },
          { name: 'Ameriprise Financial', ticker: 'AMP', listing: 'US' }
        ],
        tags: ['Private Banking', 'Investment Advisory', 'Estate Planning']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Consumer & Digital Services',
    layout: 'grid',
    products: [
      {
        id: 'retail-banking',
        name: 'Retail Banking',
        description: 'Consumer banking services and digital platforms',
        longDescription: 'Consumer-focused banking services including checking accounts, savings accounts, personal loans, mortgages, and digital banking platforms.',
        companiesDetailed: [
          { name: 'JPMorgan Chase', ticker: 'JPM', listing: 'US' },
          { name: 'Bank of America', ticker: 'BAC', listing: 'US' },
          { name: 'Wells Fargo', ticker: 'WFC', listing: 'US' },
          { name: 'Citigroup', ticker: 'C', listing: 'US' },
          { name: 'U.S. Bancorp', ticker: 'USB', listing: 'US' },
          { name: 'PNC Financial', ticker: 'PNC', listing: 'US' },
          { name: 'Truist Financial', ticker: 'TFC', listing: 'US' },
          { name: 'Capital One', ticker: 'COF', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'digital-banking',
            name: 'Digital Banking',
            description: 'Mobile and online banking platforms',
            longDescription: 'Consumer-facing mobile apps and web portals for onboarding, KYC, account management, money movement (ACH/Zelle/wire), card controls, and customer support. Emphasis on security (biometrics, device binding), reliability, and UX. Banks increasingly expose services via APIs and embed experiences in partner channels.',
            companiesDetailed: [
              { name: 'Capital One', ticker: 'COF', listing: 'US' },
              { name: 'Ally Financial', ticker: 'ALLY', listing: 'US' },
              { name: 'Discover Financial', ticker: 'DFS', listing: 'US' }
            ]
          },
          {
            id: 'mortgage-banking',
            name: 'Mortgage Banking',
            description: 'Home loans and mortgage services',
            longDescription: 'Origination, underwriting, and servicing of residential mortgages including conforming, jumbo, and government-backed loans. Processes cover application, credit/income verification, appraisal, closing, secondary-market sale/securitization, and servicing. Profitability depends on gain-on-sale margins, prepayment speeds, and cost-to-originate.',
            companiesDetailed: [
              { name: 'Wells Fargo', ticker: 'WFC', listing: 'US' },
              { name: 'JPMorgan Chase', ticker: 'JPM', listing: 'US' },
              { name: 'Bank of America', ticker: 'BAC', listing: 'US' },
              { name: 'Rocket Companies', ticker: 'RKT', listing: 'US' }
            ]
          }
        ],
        tags: ['Consumer Banking', 'Digital Banking', 'Mortgages', 'Personal Loans']
      },
      {
        id: 'credit-cards',
        name: 'Credit Cards & Payments',
        description: 'Credit card issuing and payment processing',
        longDescription: 'Credit card issuing, payment processing, and related financial services for consumers and businesses.',
        companiesDetailed: [
          { name: 'American Express', ticker: 'AXP', listing: 'US' },
          { name: 'Capital One', ticker: 'COF', listing: 'US' },
          { name: 'Discover Financial', ticker: 'DFS', listing: 'US' },
          { name: 'Synchrony Financial', ticker: 'SYF', listing: 'US' },
          { name: 'Visa', ticker: 'V', listing: 'US' },
          { name: 'Mastercard', ticker: 'MA', listing: 'US' },
          { name: 'PayPal', ticker: 'PYPL', listing: 'US' },
          { name: 'Square', ticker: 'SQ', listing: 'US' }
        ],
        tags: ['Credit Cards', 'Payment Processing', 'Digital Payments']
      }
    ]
  }
]
