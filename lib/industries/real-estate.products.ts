import { ValueChainStageProducts } from "@/lib/data/industries"

export const realEstateProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Land & Development',
    layout: 'flow',
    products: [
      {
        id: 'land-acquisition',
        name: 'Land Acquisition & Development',
        description: 'Land acquisition and real estate development',
        longDescription: 'Companies involved in the process of acquiring raw land, planning and designing real estate projects, and overseeing the construction of various property types including residential, commercial, industrial, and mixed-use developments. This foundational stage involves market research, zoning approvals, financing, and infrastructure development.',
        companiesDetailed: [
          { name: 'PulteGroup', ticker: 'PHM', listing: 'US' },
          { name: 'Lennar', ticker: 'LEN', listing: 'US' },
          { name: 'D.R. Horton', ticker: 'DHI', listing: 'US' },
          { name: 'NVR', ticker: 'NVR', listing: 'US' },
          { name: 'KB Home', ticker: 'KBH', listing: 'US' },
          { name: 'Toll Brothers', ticker: 'TOL', listing: 'US' },
          { name: 'Brookfield Properties', ticker: 'BPY', listing: 'US' },
          { name: 'Simon Property Group', ticker: 'SPG', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'residential-development',
            name: 'Residential Development',
            description: 'Single-family and multi-family housing development',
            longDescription: 'Development of residential properties, including single-family homes, townhouses, and multi-family apartment complexes. This segment addresses housing demand across various income levels and regions, focusing on community planning, home design, and construction quality.',
            companiesDetailed: [
              { name: 'PulteGroup', ticker: 'PHM', listing: 'US' },
              { name: 'Lennar', ticker: 'LEN', listing: 'US' },
              { name: 'D.R. Horton', ticker: 'DHI', listing: 'US' }
            ]
          },
          {
            id: 'commercial-development',
            name: 'Commercial Development',
            description: 'Office, retail, and industrial development',
            longDescription: 'Development of properties for business use, including office buildings, retail centers (malls, shopping centers), and industrial facilities (warehouses, distribution centers). This segment focuses on creating functional spaces that support commercial activities, enhance urban landscapes, and drive economic growth.',
            companiesDetailed: [
              { name: 'Brookfield Properties', ticker: 'BPY', listing: 'US' },
              { name: 'Simon Property Group', ticker: 'SPG', listing: 'US' },
              { name: 'Boston Properties', ticker: 'BXP', listing: 'US' }
            ]
          }
        ],
        tags: ['Development', 'Land Acquisition', 'Construction', 'Planning']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Property Ownership',
    layout: 'hybrid',
    products: [
      {
        id: 'residential-reits',
        name: 'Residential REITs',
        description: 'Real Estate Investment Trusts focused on residential properties',
        longDescription: 'Real Estate Investment Trusts (REITs) that specialize in owning, operating, and managing income-producing residential properties, such as apartment communities, single-family rental homes, and manufactured housing. These REITs provide investors with exposure to the residential housing market and generate revenue through rental income.',
        companiesDetailed: [
          { name: 'American Tower', ticker: 'AMT', listing: 'US' },
          { name: 'AvalonBay Communities', ticker: 'AVB', listing: 'US' },
          { name: 'Equity Residential', ticker: 'EQR', listing: 'US' },
          { name: 'UDR', ticker: 'UDR', listing: 'US' },
          { name: 'Camden Property Trust', ticker: 'CPT', listing: 'US' },
          { name: 'Essex Property Trust', ticker: 'ESS', listing: 'US' },
          { name: 'Mid-America Apartment Communities', ticker: 'MAA', listing: 'US' },
          { name: 'Invitation Homes', ticker: 'INVH', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'apartment-reits',
            name: 'Apartment REITs',
            description: 'Multi-family apartment properties',
            longDescription: 'REITs that own and manage large portfolios of multi-family apartment communities. They focus on acquiring, developing, and operating residential rental properties in urban and suburban markets, generating stable income from rents.',
            companiesDetailed: [
              { name: 'AvalonBay Communities', ticker: 'AVB', listing: 'US' },
              { name: 'Equity Residential', ticker: 'EQR', listing: 'US' },
              { name: 'Camden Property Trust', ticker: 'CPT', listing: 'US' }
            ]
          },
          {
            id: 'single-family-reits',
            name: 'Single-Family REITs',
            description: 'Single-family rental properties',
            longDescription: 'REITs that acquire, renovate, and manage portfolios of single-family homes for rental purposes. This segment provides housing options to a diverse tenant base and offers investors exposure to the growing single-family rental market.',
            companiesDetailed: [
              { name: 'Invitation Homes', ticker: 'INVH', listing: 'US' },
              { name: 'American Homes 4 Rent', ticker: 'AMH', listing: 'US' }
            ]
          }
        ],
        tags: ['Residential REITs', 'Apartments', 'Rental Properties', 'Housing']
      },
      {
        id: 'commercial-reits',
        name: 'Commercial REITs',
        description: 'Real Estate Investment Trusts focused on commercial properties',
        longDescription: 'Real Estate Investment Trusts (REITs) that own and operate income-producing commercial properties, including office buildings, retail centers (malls, shopping centers), and industrial facilities (warehouses, distribution centers). These REITs generate revenue through lease payments from commercial tenants.',
        companiesDetailed: [
          { name: 'Simon Property Group', ticker: 'SPG', listing: 'US' },
          { name: 'Boston Properties', ticker: 'BXP', listing: 'US' },
          { name: 'Prologis', ticker: 'PLD', listing: 'US' },
          { name: 'Realty Income', ticker: 'O', listing: 'US' },
          { name: 'Crown Castle', ticker: 'CCI', listing: 'US' },
          { name: 'American Tower', ticker: 'AMT', listing: 'US' },
          { name: 'SBA Communications', ticker: 'SBAC', listing: 'US' },
          { name: 'Digital Realty Trust', ticker: 'DLR', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'office-reits',
            name: 'Office REITs',
            description: 'Office building properties',
            longDescription: 'REITs that invest in and manage portfolios of office properties, ranging from urban high-rises to suburban office parks. They generate income from leasing office space to various businesses and are sensitive to economic cycles and remote work trends.',
            companiesDetailed: [
              { name: 'Boston Properties', ticker: 'BXP', listing: 'US' },
              { name: 'SL Green Realty', ticker: 'SLG', listing: 'US' },
              { name: 'Kilroy Realty', ticker: 'KRC', listing: 'US' }
            ]
          },
          {
            id: 'retail-reits',
            name: 'Retail REITs',
            description: 'Shopping centers and retail properties',
            longDescription: 'REITs that own and manage retail properties such as shopping malls, outlet centers, and strip retail centers. They generate revenue from lease payments from retail tenants and are influenced by consumer spending habits and e-commerce trends.',
            companiesDetailed: [
              { name: 'Simon Property Group', ticker: 'SPG', listing: 'US' },
              { name: 'Realty Income', ticker: 'O', listing: 'US' },
              { name: 'Kimco Realty', ticker: 'KIM', listing: 'US' }
            ]
          }
        ],
        tags: ['Commercial REITs', 'Office', 'Retail', 'Industrial']
      },
      {
        id: 'specialized-reits',
        name: 'Specialized REITs',
        description: 'Specialized real estate investment trusts',
        longDescription: 'REITs that focus on niche property types with unique operational characteristics, such as data centers, cell towers, healthcare facilities (e.g., hospitals, senior living), and timberland. These specialized assets often benefit from long-term leases and specific industry tailwinds.',
        companiesDetailed: [
          { name: 'Digital Realty Trust', ticker: 'DLR', listing: 'US' },
          { name: 'Equinix', ticker: 'EQIX', listing: 'US' },
          { name: 'American Tower', ticker: 'AMT', listing: 'US' },
          { name: 'Crown Castle', ticker: 'CCI', listing: 'US' },
          { name: 'SBA Communications', ticker: 'SBAC', listing: 'US' },
          { name: 'Welltower', ticker: 'WELL', listing: 'US' },
          { name: 'Ventas', ticker: 'VTR', listing: 'US' },
          { name: 'Healthpeak Properties', ticker: 'PEAK', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'data-center-reits',
            name: 'Data Center REITs',
            description: 'Data center and technology infrastructure',
            longDescription: 'REITs that own and operate specialized facilities designed to house computer servers and networking equipment. They provide power, cooling, and connectivity to technology companies, cloud providers, and enterprises, acting as critical infrastructure for the digital economy.',
            companiesDetailed: [
              { name: 'Digital Realty Trust', ticker: 'DLR', listing: 'US' },
              { name: 'Equinix', ticker: 'EQIX', listing: 'US' },
              { name: 'CoreSite Realty', ticker: 'COR', listing: 'US' }
            ]
          },
          {
            id: 'tower-reits',
            name: 'Tower REITs',
            description: 'Cell tower and wireless infrastructure',
            longDescription: 'REITs that own and operate communication infrastructure, primarily cell towers, for wireless carriers. They lease space on their towers to multiple tenants, generating stable income from long-term contracts and benefiting from increasing demand for wireless data and 5G deployment.',
            companiesDetailed: [
              { name: 'American Tower', ticker: 'AMT', listing: 'US' },
              { name: 'Crown Castle', ticker: 'CCI', listing: 'US' },
              { name: 'SBA Communications', ticker: 'SBAC', listing: 'US' }
            ]
          }
        ],
        tags: ['Specialized REITs', 'Data Centers', 'Towers', 'Healthcare']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Services & Management',
    layout: 'grid',
    products: [
      {
        id: 'property-management',
        name: 'Property Management',
        description: 'Property management and maintenance services',
        longDescription: 'Companies that provide professional services for the day-to-day operation, maintenance, and administration of real estate properties. This includes tenant relations, lease management, rent collection, facility maintenance, security, and financial reporting for residential, commercial, and industrial assets.',
        companiesDetailed: [
          { name: 'CBRE Group', ticker: 'CBRE', listing: 'US' },
          { name: 'JLL', ticker: 'JLL', listing: 'US' },
          { name: 'Colliers International', ticker: 'CIGI', listing: 'US' },
          { name: 'Cushman & Wakefield', ticker: 'CWK', listing: 'US' },
          { name: 'Marcus & Millichap', ticker: 'MMI', listing: 'US' },
          { name: 'Newmark Group', ticker: 'NMRK', listing: 'US' },
          { name: 'AvalonBay Communities', ticker: 'AVB', listing: 'US' },
          { name: 'Equity Residential', ticker: 'EQR', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'commercial-management',
            name: 'Commercial Property Management',
            description: 'Office and retail property management',
            longDescription: 'Management services tailored for commercial properties such as office buildings, retail centers, and industrial parks. This includes tenant acquisition and retention, lease administration, property maintenance, security, and strategic planning to maximize asset value and operational efficiency.',
            companiesDetailed: [
              { name: 'CBRE Group', ticker: 'CBRE', listing: 'US' },
              { name: 'JLL', ticker: 'JLL', listing: 'US' },
              { name: 'Colliers International', ticker: 'CIGI', listing: 'US' }
            ]
          },
          {
            id: 'residential-management',
            name: 'Residential Property Management',
            description: 'Apartment and housing management',
            longDescription: 'Management services for residential properties, including apartment complexes and single-family rental homes. This involves tenant screening, lease enforcement, rent collection, maintenance coordination, and community relations to ensure smooth operations and high occupancy rates.',
            companiesDetailed: [
              { name: 'AvalonBay Communities', ticker: 'AVB', listing: 'US' },
              { name: 'Equity Residential', ticker: 'EQR', listing: 'US' },
              { name: 'Camden Property Trust', ticker: 'CPT', listing: 'US' }
            ]
          }
        ],
        tags: ['Property Management', 'Tenant Relations', 'Maintenance', 'Operations']
      },
      {
        id: 'real-estate-services',
        name: 'Real Estate Services',
        description: 'Real estate brokerage and advisory services',
        longDescription: 'Professional services supporting real estate transactions and investments, including brokerage, valuation, consulting, and advisory services. These firms assist individuals, businesses, and investors in buying, selling, leasing, and optimizing real estate assets.',
        companiesDetailed: [
          { name: 'CBRE Group', ticker: 'CBRE', listing: 'US' },
          { name: 'JLL', ticker: 'JLL', listing: 'US' },
          { name: 'Colliers International', ticker: 'CIGI', listing: 'US' },
          { name: 'Cushman & Wakefield', ticker: 'CWK', listing: 'US' },
          { name: 'Marcus & Millichap', ticker: 'MMI', listing: 'US' },
          { name: 'Newmark Group', ticker: 'NMRK', listing: 'US' },
          { name: 'Compass', ticker: 'COMP', listing: 'US' },
          { name: 'Redfin', ticker: 'RDFN', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'commercial-brokerage',
            name: 'Commercial Brokerage',
            description: 'Commercial real estate transactions',
            longDescription: 'Brokerage services specializing in facilitating the buying, selling, and leasing of commercial properties such as office buildings, retail spaces, industrial facilities, and land for development. Commercial brokers provide market expertise, property marketing, and negotiation support.',
            companiesDetailed: [
              { name: 'CBRE Group', ticker: 'CBRE', listing: 'US' },
              { name: 'JLL', ticker: 'JLL', listing: 'US' },
              { name: 'Colliers International', ticker: 'CIGI', listing: 'US' }
            ]
          },
          {
            id: 'residential-brokerage',
            name: 'Residential Brokerage',
            description: 'Residential real estate transactions',
            longDescription: 'Brokerage services focused on assisting individuals with the buying and selling of homes, including single-family residences, condominiums, and co-ops. Residential brokers provide market analysis, property showings, negotiation, and closing support.',
            companiesDetailed: [
              { name: 'Compass', ticker: 'COMP', listing: 'US' },
              { name: 'Redfin', ticker: 'RDFN', listing: 'US' },
              { name: 'Zillow', ticker: 'Z', listing: 'US' }
            ]
          }
        ],
        tags: ['Brokerage', 'Advisory', 'Transactions', 'Services']
      }
    ]
  }
]
