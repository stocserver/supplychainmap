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
          { name: 'Intercontinental Exchange', ticker: 'ICE', listing: 'US' },
          { name: 'CME Group', ticker: 'CME', listing: 'US' },
          { name: 'Cboe Global Markets', ticker: 'CBOE', listing: 'US' },
          { name: 'MarketAxess', ticker: 'MKTX', listing: 'US' },
          { name: 'Tradeweb Markets', ticker: 'TW', listing: 'US' },
          { name: 'Morningstar', ticker: 'MORN', listing: 'US' },
          { name: 'FactSet', ticker: 'FDS', listing: 'US' },
          { name: 'Thomson Reuters', ticker: 'TRI', listing: 'US' }
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
          { name: 'Goldman Sachs', ticker: 'GS', listing: 'US' },
          { name: 'Interactive Brokers', ticker: 'IBKR', listing: 'US' },
          { name: 'Robinhood', ticker: 'HOOD', listing: 'US' },
          { name: 'LPL Financial', ticker: 'LPLA', listing: 'US' },
          { name: 'Raymond James', ticker: 'RJF', listing: 'US' },
          { name: 'Stifel Financial', ticker: 'SF', listing: 'US' },
          { name: 'Ameriprise Financial', ticker: 'AMP', listing: 'US' }
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
          { name: 'State Street', ticker: 'STT', listing: 'US' },
          { name: 'AllianceBernstein', ticker: 'AB', listing: 'US' },
          { name: 'Janus Henderson', ticker: 'JHG', listing: 'US' },
          { name: 'Artisan Partners', ticker: 'APAM', listing: 'US' },
          { name: 'Federated Hermes', ticker: 'FHI', listing: 'US' },
          { name: 'Affiliated Managers Group', ticker: 'AMG', listing: 'US' },
          { name: 'SEI Investments', ticker: 'SEIC', listing: 'US' },
          { name: 'Cohen & Steers', ticker: 'CNS', listing: 'US' },
          { name: 'Virtus Investment Partners', ticker: 'VRTS', listing: 'US' },
          { name: 'Lazard Asset Management', ticker: 'LAZ', listing: 'US' },
          { name: 'Ameriprise Financial', ticker: 'AMP', listing: 'US' }
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
          { name: 'Ares Management', ticker: 'ARES', listing: 'US' },
          { name: 'TPG', ticker: 'TPG', listing: 'US' },
          { name: 'Blue Owl Capital', ticker: 'OWL', listing: 'US' },
          { name: 'Brookfield Asset Management', ticker: 'BAM', listing: 'US' },
          { name: 'Hamilton Lane', ticker: 'HLNE', listing: 'US' },
          { name: 'StepStone Group', ticker: 'STEP', listing: 'US' }
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
          { name: 'Northern Trust', ticker: 'NTRS', listing: 'US' },
          { name: 'JPMorgan', ticker: 'JPM', listing: 'US' },
          { name: 'Citigroup', ticker: 'C', listing: 'US' }
        ],
        tags: ['Custody', 'Asset Servicing']
      }
    ]
  }
]


