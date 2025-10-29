import { ValueChainStageProducts } from "@/lib/data/industries"

export const oilGasProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Exploration & Production',
    layout: 'flow',
    products: [
      {
        id: 'exploration',
        name: 'Exploration & Drilling',
        description: 'Oil and gas exploration, drilling, and production',
        longDescription: 'Companies involved in finding, drilling, and extracting oil and natural gas from underground reservoirs.',
        companiesDetailed: [
          { name: 'ExxonMobil', ticker: 'XOM', listing: 'US' },
          { name: 'Chevron', ticker: 'CVX', listing: 'US' },
          { name: 'ConocoPhillips', ticker: 'COP', listing: 'US' },
          { name: 'EOG Resources', ticker: 'EOG', listing: 'US' },
          { name: 'Pioneer Natural Resources', ticker: 'PXD', listing: 'US' },
          { name: 'Diamondback Energy', ticker: 'FANG', listing: 'US' },
          { name: 'Devon Energy', ticker: 'DVN', listing: 'US' },
          { name: 'Marathon Oil', ticker: 'MRO', listing: 'US' },
          { name: 'Hess Corporation', ticker: 'HES', listing: 'US' },
          { name: 'Occidental Petroleum', ticker: 'OXY', listing: 'US' },
          { name: 'Coterra Energy', ticker: 'CTRA', listing: 'US' },
          { name: 'APA Corporation', ticker: 'APA', listing: 'US' },
          { name: 'Antero Resources', ticker: 'AR', listing: 'US' },
          { name: 'Range Resources', ticker: 'RRC', listing: 'US' },
          { name: 'Southwestern Energy', ticker: 'SWN', listing: 'US' },
          { name: 'EQT Corporation', ticker: 'EQT', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'offshore-drilling',
            name: 'Offshore Drilling',
            description: 'Deepwater and offshore oil exploration',
            longDescription: 'Exploration and production activities conducted in offshore environments using floating rigs or platforms in shallow, deep, and ultra-deepwater. Operations involve subsea well construction, blowout prevention, and complex logistics in harsh conditions.',
            companiesDetailed: [
              { name: 'Transocean', ticker: 'RIG', listing: 'US' },
              { name: 'Noble Corporation', ticker: 'NE', listing: 'US' },
              { name: 'Valaris', ticker: 'VAL', listing: 'US' },
              { name: 'Seadrill', ticker: 'SDRL', listing: 'US' },
              { name: 'Borr Drilling', ticker: 'BORR', listing: 'US' }
            ]
          },
          {
            id: 'shale-production',
            name: 'Shale Production',
            description: 'Unconventional shale oil and gas production',
            longDescription: 'Development of hydrocarbons from tight shale formations using horizontal drilling and multi-stage hydraulic fracturing. Emphasizes pad drilling, decline curve management, and water/sand logistics for cost-efficient production.',
            companiesDetailed: [
              { name: 'EOG Resources', ticker: 'EOG', listing: 'US' },
              { name: 'Pioneer Natural Resources', ticker: 'PXD', listing: 'US' },
              { name: 'Diamondback Energy', ticker: 'FANG', listing: 'US' },
              { name: 'Coterra Energy', ticker: 'CTRA', listing: 'US' },
              { name: 'Antero Resources', ticker: 'AR', listing: 'US' },
              { name: 'Range Resources', ticker: 'RRC', listing: 'US' }
            ]
          }
        ],
        tags: ['Exploration', 'Drilling', 'Production', 'Shale', 'Offshore']
      },
      {
        id: 'oilfield-services',
        name: 'Oilfield Services',
        description: 'Equipment and services for oil and gas operations',
        longDescription: 'Companies providing specialized equipment, technology, and services to support oil and gas exploration and production activities.',
        companiesDetailed: [
          { name: 'Schlumberger', ticker: 'SLB', listing: 'US' },
          { name: 'Halliburton', ticker: 'HAL', listing: 'US' },
          { name: 'Baker Hughes', ticker: 'BKR', listing: 'US' },
          { name: 'National Oilwell Varco', ticker: 'NOV', listing: 'US' },
          { name: 'TechnipFMC', ticker: 'FTI', listing: 'US' },
          { name: 'Oceaneering International', ticker: 'OII', listing: 'US' },
          { name: 'Weatherford International', ticker: 'WFRD', listing: 'US' },
          { name: 'ChampionX', ticker: 'CHX', listing: 'US' },
          { name: 'Helmerich & Payne', ticker: 'HP', listing: 'US' },
          { name: 'Patterson-UTI Energy', ticker: 'PTEN', listing: 'US' },
          { name: 'Nabors Industries', ticker: 'NBR', listing: 'US' },
          { name: 'Tetra Technologies', ticker: 'TTI', listing: 'US' },
          { name: 'Core Laboratories', ticker: 'CLB', listing: 'US' }
        ],
        tags: ['Oilfield Services', 'Drilling Equipment', 'Well Services']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Transportation & Processing',
    layout: 'hybrid',
    products: [
      {
        id: 'pipelines',
        name: 'Pipeline Transportation',
        description: 'Oil and gas pipeline infrastructure and transportation',
        longDescription: 'Companies that own and operate pipelines for transporting crude oil, natural gas, and refined products across regions.',
        companiesDetailed: [
          { name: 'Kinder Morgan', ticker: 'KMI', listing: 'US' },
          { name: 'Enterprise Products Partners', ticker: 'EPD', listing: 'US' },
          { name: 'Energy Transfer', ticker: 'ET', listing: 'US' },
          { name: 'Plains All American Pipeline', ticker: 'PAA', listing: 'US' },
          { name: 'Magellan Midstream Partners', ticker: 'MMP', listing: 'US' },
          { name: 'Williams Companies', ticker: 'WMB', listing: 'US' },
          { name: 'ONEOK', ticker: 'OKE', listing: 'US' },
          { name: 'TC Energy', ticker: 'TRP', listing: 'US' },
          { name: 'MPLX', ticker: 'MPLX', listing: 'US' },
          { name: 'Enbridge', ticker: 'ENB', listing: 'US' },
          { name: 'NuStar Energy', ticker: 'NS', listing: 'US' },
          { name: 'USA Compression Partners', ticker: 'USAC', listing: 'US' },
          { name: 'Archrock', ticker: 'AROC', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'crude-pipelines',
            name: 'Crude Oil Pipelines',
            description: 'Transportation of crude oil',
            longDescription: 'Pipeline networks dedicated to transporting unrefined crude oil from production areas and gathering systems to refineries and export terminals, focusing on throughput, integrity management, and leak detection.',
            companiesDetailed: [
              { name: 'Kinder Morgan', ticker: 'KMI', listing: 'US' },
              { name: 'Plains All American Pipeline', ticker: 'PAA', listing: 'US' },
              { name: 'NuStar Energy', ticker: 'NS', listing: 'US' },
              { name: 'Magellan Midstream Partners', ticker: 'MMP', listing: 'US' }
            ]
          },
          {
            id: 'natural-gas-pipelines',
            name: 'Natural Gas Pipelines',
            description: 'Transportation of natural gas',
            longDescription: 'Interstate and intrastate transmission systems moving processed natural gas to utilities, LNG facilities, and end-users. Involves compressor stations, SCADA control, and tariff-based regulated returns.',
            companiesDetailed: [
              { name: 'Williams Companies', ticker: 'WMB', listing: 'US' },
              { name: 'TC Energy', ticker: 'TRP', listing: 'US' },
              { name: 'ONEOK', ticker: 'OKE', listing: 'US' }
            ]
          }
        ],
        tags: ['Pipelines', 'Midstream', 'Transportation', 'Infrastructure']
      },
      {
        id: 'refining',
        name: 'Refining & Processing',
        description: 'Oil refining and petrochemical processing',
        longDescription: 'Companies that refine crude oil into petroleum products and process natural gas liquids into various petrochemicals.',
        companiesDetailed: [
          { name: 'Valero Energy', ticker: 'VLO', listing: 'US' },
          { name: 'Marathon Petroleum', ticker: 'MPC', listing: 'US' },
          { name: 'Phillips 66', ticker: 'PSX', listing: 'US' },
          { name: 'PBF Energy', ticker: 'PBF', listing: 'US' },
          { name: 'HollyFrontier', ticker: 'HFC', listing: 'US' },
          { name: 'Delek US Holdings', ticker: 'DK', listing: 'US' },
          { name: 'CVR Energy', ticker: 'CVI', listing: 'US' },
          { name: 'Par Pacific Holdings', ticker: 'PARR', listing: 'US' },
          { name: 'Calumet Specialty Products', ticker: 'CLMT', listing: 'US' },
          { name: 'World Fuel Services', ticker: 'INT', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'petroleum-refining',
            name: 'Petroleum Refining',
            description: 'Crude oil refining into fuels and products',
            longDescription: 'Refinery processes such as distillation, cracking, reforming, and treating that convert crude oil into gasoline, diesel, jet fuel, LPG, and specialty products, optimized for margins and product slate.',
            companiesDetailed: [
              { name: 'Valero Energy', ticker: 'VLO', listing: 'US' },
              { name: 'Marathon Petroleum', ticker: 'MPC', listing: 'US' },
              { name: 'Phillips 66', ticker: 'PSX', listing: 'US' }
            ]
          },
          {
            id: 'petrochemicals',
            name: 'Petrochemicals',
            description: 'Chemical products from oil and gas',
            longDescription: 'Downstream conversion of NGLs and refinery streams (e.g., ethane, propane, naphtha) into olefins and aromatics that serve as feedstocks for plastics, solvents, and synthetic materials.',
            companiesDetailed: [
              { name: 'Dow Inc.', ticker: 'DOW', listing: 'US' },
              { name: 'LyondellBasell', ticker: 'LYB', listing: 'US' },
              { name: 'Westlake Chemical', ticker: 'WLK', listing: 'US' },
              { name: 'Eastman Chemical', ticker: 'EMN', listing: 'US' },
              { name: 'Huntsman Corporation', ticker: 'HUN', listing: 'US' },
              { name: 'Celanese Corporation', ticker: 'CE', listing: 'US' },
              { name: 'Trinseo', ticker: 'TSE', listing: 'US' }
            ]
          }
        ],
        tags: ['Refining', 'Petrochemicals', 'Processing', 'Fuels']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Marketing & Distribution',
    layout: 'grid',
    products: [
      {
        id: 'marketing-distribution',
        name: 'Marketing & Distribution',
        description: 'Retail fuel distribution and marketing',
        longDescription: 'Companies involved in the retail distribution of petroleum products including gasoline stations, fuel distribution, and convenience stores.',
        companiesDetailed: [
          { name: 'ExxonMobil', ticker: 'XOM', listing: 'US' },
          { name: 'Chevron', ticker: 'CVX', listing: 'US' },
          { name: 'Shell', ticker: 'SHEL', listing: 'ADR' },
          { name: 'BP', ticker: 'BP', listing: 'ADR' },
          { name: 'Marathon Petroleum', ticker: 'MPC', listing: 'US' },
          { name: 'Phillips 66', ticker: 'PSX', listing: 'US' },
          { name: 'Murphy USA', ticker: 'MUSA', listing: 'US' },
          { name: "Casey's General Stores", ticker: 'CASY', listing: 'US' },
          { name: 'TotalEnergies', ticker: 'TTE', listing: 'ADR' },
          { name: 'Eni', ticker: 'E', listing: 'ADR' },
          { name: 'Sunoco', ticker: 'SUN', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'gas-stations',
            name: 'Gas Stations',
            description: 'Retail gasoline stations',
            longDescription: 'Fuel retail outlets that sell gasoline and diesel directly to consumers and commercial drivers, often co-located with convenience stores and service bays.',
            companiesDetailed: [
              { name: 'Murphy USA', ticker: 'MUSA', listing: 'US' },
              { name: "Casey's General Stores", ticker: 'CASY', listing: 'US' },
              { name: 'TravelCenters of America', ticker: 'TA', listing: 'US' }
            ]
          },
          {
            id: 'fuel-distribution',
            name: 'Fuel Distribution',
            description: 'Wholesale fuel distribution',
            longDescription: 'Distribution of refined products (gasoline, diesel, jet) to retail stations, fleets, and end-customers via terminals and tanker trucking, coordinating supply contracts and rack pricing.',
            companiesDetailed: [
              { name: 'Marathon Petroleum', ticker: 'MPC', listing: 'US' },
              { name: 'Phillips 66', ticker: 'PSX', listing: 'US' },
              { name: 'Sunoco', ticker: 'SUN', listing: 'US' },
              { name: 'Valero Energy', ticker: 'VLO', listing: 'US' },
              { name: 'World Fuel Services', ticker: 'INT', listing: 'US' }
            ]
          }
        ],
        tags: ['Retail', 'Gas Stations', 'Fuel Distribution', 'Convenience Stores']
      },
      {
        id: 'lng-export',
        name: 'LNG Export & Trading',
        description: 'Liquefied natural gas export and trading',
        longDescription: 'Companies involved in liquefied natural gas (LNG) export facilities, trading, and international energy markets.',
        companiesDetailed: [
          { name: 'Cheniere Energy', ticker: 'LNG', listing: 'US' },
          { name: 'Tellurian', ticker: 'TELL', listing: 'US' },
          { name: 'NextDecade', ticker: 'NEXT', listing: 'US' },
          { name: 'Sempra Energy', ticker: 'SRE', listing: 'US' },
          { name: 'Kinder Morgan', ticker: 'KMI', listing: 'US' },
          { name: 'Energy Transfer', ticker: 'ET', listing: 'US' },
          { name: 'Williams Companies', ticker: 'WMB', listing: 'US' },
          { name: 'New Fortress Energy', ticker: 'NFE', listing: 'US' }
        ],
        tags: ['LNG', 'Export', 'Trading', 'International']
      }
    ]
  }
]
