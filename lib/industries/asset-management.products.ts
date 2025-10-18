import { ValueChainStageProducts } from "@/lib/data/industries"

export const assetManagementProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Market Infrastructure & Distribution',
    layout: 'grid',
    products: [
      {
        id: 'market-infrastructure',
        name: 'Market Infrastructure',
        description: 'Index providers, market data, and trading venues',
        longDescription: 'Providers of essential services and platforms that enable financial markets to function, including the creation and maintenance of market indices, dissemination of financial data, and operation of trading venues for various asset classes. These services are crucial for investment analysis, portfolio benchmarking, and efficient capital allocation.',
        companiesDetailed: [
          { name: 'S&P Global', ticker: 'SPGI', listing: 'US' },
          { name: 'MSCI', ticker: 'MSCI', listing: 'US' },
          { name: 'NASDAQ', ticker: 'NDAQ', listing: 'US' },
          { name: 'Intercontinental Exchange', ticker: 'ICE', listing: 'US' }
        ],
        tags: ['Benchmarks', 'Data', 'Exchanges']
      },
      {
        id: 'distribution',
        name: 'Distribution Platforms',
        description: 'Broker-dealers and investment platforms',
        longDescription: 'Platforms and intermediaries that connect asset managers with investors. This includes broker-dealers, registered investment advisors (RIAs), and digital investment platforms that facilitate the sale and distribution of investment products to individual and institutional clients.',
        companiesDetailed: [
          { name: 'Charles Schwab', ticker: 'SCHW', listing: 'US' },
          { name: 'Morgan Stanley', ticker: 'MS', listing: 'US' },
          { name: 'Goldman Sachs', ticker: 'GS', listing: 'US' }
        ],
        tags: ['Wealth Platforms', 'RIAs']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Asset Managers',
    layout: 'hybrid',
    products: [
      {
        id: 'traditional-asset-mgmt',
        name: 'Traditional Asset Management',
        description: 'Active and passive public markets managers',
        longDescription: 'Firms that manage investment portfolios primarily in publicly traded securities such as stocks, bonds, and money market instruments. This includes both active strategies (seeking to outperform benchmarks) and passive strategies (replicating index performance) for institutional and retail clients.',
        companiesDetailed: [
          { name: 'BlackRock', ticker: 'BLK', listing: 'US' },
          { name: 'T. Rowe Price', ticker: 'TROW', listing: 'US' },
          { name: 'Franklin Resources', ticker: 'BEN', listing: 'US' },
          { name: 'Invesco', ticker: 'IVZ', listing: 'US' },
          { name: 'State Street', ticker: 'STT', listing: 'US' }
        ],
        tags: ['Active', 'Institutional']
      },
      {
        id: 'alternative-investments',
        name: 'Alternative Investments',
        description: 'Private equity, credit, and real assets managers',
        longDescription: 'Managers specializing in non-traditional asset classes like private equity, private credit, hedge funds, real estate, and infrastructure. These investments often offer diversification, higher potential returns, and less liquidity than public market securities.',
        companiesDetailed: [
          { name: 'Blackstone', ticker: 'BX', listing: 'US' },
          { name: 'KKR', ticker: 'KKR', listing: 'US' },
          { name: 'Apollo Global', ticker: 'APO', listing: 'US' },
          { name: 'Carlyle Group', ticker: 'CG', listing: 'US' },
          { name: 'Ares Management', ticker: 'ARES', listing: 'US' }
        ],
        tags: ['Private Markets', 'Credit', 'Real Assets']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Investor Services & Custody',
    layout: 'grid',
    products: [
      {
        id: 'investor-services',
        name: 'Investor Services',
        description: 'Fund administration and transfer agency',
        longDescription: 'Specialized service providers that support asset managers with back-office operations, including fund accounting, net asset value (NAV) calculation, regulatory compliance, shareholder record-keeping, and reporting. These services are critical for operational efficiency and regulatory adherence.',
        companiesDetailed: [
          { name: 'SS&C Technologies', ticker: 'SSNC', listing: 'US' },
          { name: 'Broadridge', ticker: 'BR', listing: 'US' }
        ],
        tags: ['Administration', 'Shareholder Services']
      },
      {
        id: 'custody',
        name: 'Custody & Asset Servicing',
        description: 'Global custody, accounting, and fund servicing',
        longDescription: 'Services that involve the safekeeping of financial assets, trade settlement, and related administrative functions for institutional investors. Custodians also provide accounting, performance reporting, and regulatory compliance support to ensure asset safety and operational integrity.',
        companiesDetailed: [
          { name: 'BNY Mellon', ticker: 'BK', listing: 'US' },
          { name: 'State Street', ticker: 'STT', listing: 'US' },
          { name: 'Northern Trust', ticker: 'NTRS', listing: 'US' }
        ],
        tags: ['Custody', 'Asset Servicing']
      }
    ]
  }
]


