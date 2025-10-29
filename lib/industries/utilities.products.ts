import { ValueChainStageProducts } from "@/lib/data/industries"

export const utilitiesProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Power Generation',
    layout: 'flow',
    products: [
      {
        id: 'power-generation',
        name: 'Power Generation',
        description: 'Electricity generation facilities and technologies',
        longDescription: 'Companies that operate power generation facilities using various technologies including fossil fuels, nuclear, hydroelectric, and renewable energy sources.',
        companiesDetailed: [
          { name: 'NextEra Energy', ticker: 'NEE', listing: 'US' },
          { name: 'Southern Company', ticker: 'SO', listing: 'US' },
          { name: 'Duke Energy', ticker: 'DUK', listing: 'US' },
          { name: 'American Electric Power', ticker: 'AEP', listing: 'US' },
          { name: 'Exelon', ticker: 'EXC', listing: 'US' },
          { name: 'Dominion Energy', ticker: 'D', listing: 'US' },
          { name: 'Xcel Energy', ticker: 'XEL', listing: 'US' },
          { name: 'Consolidated Edison', ticker: 'ED', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'fossil-fuel-generation',
            name: 'Fossil Fuel Generation',
            description: 'Coal, natural gas, and oil power plants',
            longDescription: 'Thermal power plants that convert energy from coal, natural gas, or oil into electricity using boilers/turbines or combined cycle gas turbines. Operations focus on heat rate efficiency, emissions controls, and grid reliability.',
            companiesDetailed: [
              { name: 'Southern Company', ticker: 'SO', listing: 'US' },
              { name: 'Duke Energy', ticker: 'DUK', listing: 'US' },
              { name: 'American Electric Power', ticker: 'AEP', listing: 'US' }
            ]
          },
          {
            id: 'nuclear-generation',
            name: 'Nuclear Generation',
            description: 'Nuclear power plants',
            longDescription: 'Baseload power plants that use nuclear fission to generate heat for steam turbines. Emphasizes stringent safety protocols, refueling outages, spent fuel management, and regulatory compliance (NRC).',
            companiesDetailed: [
              { name: 'Exelon', ticker: 'EXC', listing: 'US' },
              { name: 'Dominion Energy', ticker: 'D', listing: 'US' },
              { name: 'Southern Company', ticker: 'SO', listing: 'US' }
            ]
          }
        ],
        tags: ['Power Generation', 'Electricity', 'Fossil Fuels', 'Nuclear']
      },
      {
        id: 'renewable-generation',
        name: 'Renewable Energy Generation',
        description: 'Solar, wind, and other renewable power sources',
        longDescription: 'Companies that develop, own, and operate renewable energy facilities including solar farms, wind farms, and hydroelectric plants.',
        companiesDetailed: [
          { name: 'NextEra Energy', ticker: 'NEE', listing: 'US' },
          { name: 'Brookfield Renewable', ticker: 'BEP', listing: 'US' },
          { name: 'Clearway Energy', ticker: 'CWEN', listing: 'US' },
          { name: 'Pattern Energy', ticker: 'PEGI', listing: 'US' },
          { name: 'TerraForm Power', ticker: 'TERP', listing: 'US' },
          { name: 'SunPower', ticker: 'SPWR', listing: 'US' },
          { name: 'First Solar', ticker: 'FSLR', listing: 'US' },
          { name: 'Vestas Wind Systems', ticker: 'VWDRY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'solar-power',
            name: 'Solar Power',
            description: 'Solar photovoltaic generation',
            longDescription: 'Utility-scale photovoltaic installations that convert sunlight into electricity. Key considerations include module efficiency, inverters, single-axis tracking, and interconnection to the grid.',
            companiesDetailed: [
              { name: 'NextEra Energy', ticker: 'NEE', listing: 'US' },
              { name: 'SunPower', ticker: 'SPWR', listing: 'US' },
              { name: 'First Solar', ticker: 'FSLR', listing: 'US' }
            ]
          },
          {
            id: 'wind-power',
            name: 'Wind Power',
            description: 'Wind turbine generation',
            longDescription: 'Onshore and offshore wind projects that convert kinetic energy into electricity via turbines. Performance hinges on capacity factor, turbine siting, O&M, and grid integration.',
            companiesDetailed: [
              { name: 'NextEra Energy', ticker: 'NEE', listing: 'US' },
              { name: 'Pattern Energy', ticker: 'PEGI', listing: 'US' },
              { name: 'Vestas Wind Systems', ticker: 'VWDRY', listing: 'ADR' }
            ]
          }
        ],
        tags: ['Renewable Energy', 'Solar', 'Wind', 'Hydroelectric']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Transmission & Distribution',
    layout: 'hybrid',
    products: [
      {
        id: 'transmission',
        name: 'Electric Transmission',
        description: 'High-voltage power transmission infrastructure',
        longDescription: 'Companies that own and operate high-voltage transmission lines and substations that move electricity from generation facilities to distribution networks.',
        companiesDetailed: [
          { name: 'American Electric Power', ticker: 'AEP', listing: 'US' },
          { name: 'Duke Energy', ticker: 'DUK', listing: 'US' },
          { name: 'Southern Company', ticker: 'SO', listing: 'US' },
          { name: 'Exelon', ticker: 'EXC', listing: 'US' },
          { name: 'Dominion Energy', ticker: 'D', listing: 'US' },
          { name: 'Xcel Energy', ticker: 'XEL', listing: 'US' },
          { name: 'Consolidated Edison', ticker: 'ED', listing: 'US' },
          { name: 'PPL Corporation', ticker: 'PPL', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'transmission-lines',
            name: 'Transmission Lines',
            description: 'High-voltage power lines',
            longDescription: 'Overhead and underground high-voltage lines that transmit bulk power over long distances. Planning considers rights-of-way, thermal limits, reactive power, and system protection schemes.',
            companiesDetailed: [
              { name: 'American Electric Power', ticker: 'AEP', listing: 'US' },
              { name: 'Duke Energy', ticker: 'DUK', listing: 'US' },
              { name: 'Southern Company', ticker: 'SO', listing: 'US' }
            ]
          },
          {
            id: 'substations',
            name: 'Substations',
            description: 'Power transformation and switching facilities',
            longDescription: 'Facilities that step voltage up/down and provide switching, protection, and control for the grid. Includes transformers, breakers, relays, and SCADA for monitoring and automation.',
            companiesDetailed: [
              { name: 'Exelon', ticker: 'EXC', listing: 'US' },
              { name: 'Dominion Energy', ticker: 'D', listing: 'US' },
              { name: 'Xcel Energy', ticker: 'XEL', listing: 'US' }
            ]
          }
        ],
        tags: ['Transmission', 'High Voltage', 'Infrastructure', 'Grid']
      },
      {
        id: 'gas-utilities',
        name: 'Natural Gas Utilities',
        description: 'Natural gas distribution and pipeline operations',
        longDescription: 'Companies that distribute natural gas to residential, commercial, and industrial customers through pipeline networks.',
        companiesDetailed: [
          { name: 'Southern Company', ticker: 'SO', listing: 'US' },
          { name: 'Dominion Energy', ticker: 'D', listing: 'US' },
          { name: 'Sempra Energy', ticker: 'SRE', listing: 'US' },
          { name: 'Kinder Morgan', ticker: 'KMI', listing: 'US' },
          { name: 'Williams Companies', ticker: 'WMB', listing: 'US' },
          { name: 'ONEOK', ticker: 'OKE', listing: 'US' },
          { name: 'TC Energy', ticker: 'TRP', listing: 'US' },
          { name: 'Enbridge', ticker: 'ENB', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'gas-distribution',
            name: 'Gas Distribution',
            description: 'Local natural gas distribution',
            longDescription: 'Local distribution companies (LDCs) that deliver natural gas from city gates to homes and businesses via low/medium-pressure networks, with metering, leak detection, and safety compliance.',
            companiesDetailed: [
              { name: 'Southern Company', ticker: 'SO', listing: 'US' },
              { name: 'Dominion Energy', ticker: 'D', listing: 'US' },
              { name: 'Sempra Energy', ticker: 'SRE', listing: 'US' }
            ]
          },
          {
            id: 'gas-pipelines',
            name: 'Gas Pipelines',
            description: 'Long-distance natural gas transportation',
            longDescription: 'High-pressure transmission pipelines that move gas across regions, supported by compressor stations, line pack management, and interconnections with storage and LNG facilities.',
            companiesDetailed: [
              { name: 'Kinder Morgan', ticker: 'KMI', listing: 'US' },
              { name: 'Williams Companies', ticker: 'WMB', listing: 'US' },
              { name: 'TC Energy', ticker: 'TRP', listing: 'US' }
            ]
          }
        ],
        tags: ['Natural Gas', 'Distribution', 'Pipelines', 'Utilities']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Retail & Services',
    layout: 'grid',
    products: [
      {
        id: 'retail-electric',
        name: 'Retail Electricity',
        description: 'Electricity sales to end customers',
        longDescription: 'Companies that sell electricity directly to residential, commercial, and industrial customers in competitive markets.',
        companiesDetailed: [
          { name: 'NextEra Energy', ticker: 'NEE', listing: 'US' },
          { name: 'Vistra', ticker: 'VST', listing: 'US' },
          { name: 'NRG Energy', ticker: 'NRG', listing: 'US' },
          { name: 'Constellation Energy', ticker: 'CEG', listing: 'US' },
          { name: 'Calpine', ticker: 'CPN', listing: 'US' },
          { name: 'Direct Energy', ticker: 'NRG', listing: 'US' },
          { name: 'Green Mountain Energy', ticker: 'NRG', listing: 'US' },
          { name: 'EDP Energias', ticker: 'EDPFY', listing: 'ADR' },
          { name: 'Engie', ticker: 'ENGIY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'residential-retail',
            name: 'Residential Retail',
            description: 'Home electricity sales',
            longDescription: 'Electric retail providers that sell electricity to residential customers in competitive markets, offering fixed/variable plans, renewable options, and customer support.',
            companiesDetailed: [
              { name: 'NextEra Energy', ticker: 'NEE', listing: 'US' },
              { name: 'Vistra', ticker: 'VST', listing: 'US' },
              { name: 'NRG Energy', ticker: 'NRG', listing: 'US' }
            ]
          },
          {
            id: 'commercial-retail',
            name: 'Commercial Retail',
            description: 'Business electricity sales',
            longDescription: 'Power marketers that serve commercial and industrial loads, offering tailored procurement strategies (hedging, block & index), demand response, and energy efficiency services.',
            companiesDetailed: [
              { name: 'Constellation Energy', ticker: 'CEG', listing: 'US' },
              { name: 'Calpine', ticker: 'CPN', listing: 'US' },
              { name: 'Vistra', ticker: 'VST', listing: 'US' }
            ]
          }
        ],
        tags: ['Retail Electricity', 'Competitive Markets', 'Customer Service']
      },
      {
        id: 'water-utilities',
        name: 'Water Utilities',
        description: 'Water and wastewater services',
        longDescription: 'Companies that provide water treatment, distribution, and wastewater services to communities and businesses.',
        companiesDetailed: [
          { name: 'American Water Works', ticker: 'AWK', listing: 'US' },
          { name: 'Aqua America', ticker: 'WTR', listing: 'US' },
          { name: 'Essential Utilities', ticker: 'WTRG', listing: 'US' },
          { name: 'California Water Service', ticker: 'CWT', listing: 'US' },
          { name: 'Middlesex Water', ticker: 'MSEX', listing: 'US' },
          { name: 'SJW Group', ticker: 'SJW', listing: 'US' },
          { name: 'York Water', ticker: 'YORW', listing: 'US' },
          { name: 'Connecticut Water Service', ticker: 'CTWS', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'water-treatment',
            name: 'Water Treatment',
            description: 'Water purification and treatment',
            longDescription: 'Treatment plants and processes that purify raw water for safe consumption, including coagulation, filtration, disinfection, and advanced treatments (RO, UV).',
            companiesDetailed: [
              { name: 'American Water Works', ticker: 'AWK', listing: 'US' },
              { name: 'Aqua America', ticker: 'WTR', listing: 'US' },
              { name: 'Essential Utilities', ticker: 'WTRG', listing: 'US' }
            ]
          },
          {
            id: 'wastewater-treatment',
            name: 'Wastewater Treatment',
            description: 'Sewage and wastewater processing',
            longDescription: 'Systems that collect and treat municipal and industrial wastewater using primary, secondary, and tertiary processes before safe discharge or reuse.',
            companiesDetailed: [
              { name: 'American Water Works', ticker: 'AWK', listing: 'US' },
              { name: 'Essential Utilities', ticker: 'WTRG', listing: 'US' },
              { name: 'California Water Service', ticker: 'CWT', listing: 'US' }
            ]
          }
        ],
        tags: ['Water', 'Wastewater', 'Treatment', 'Distribution']
      }
    ]
  }
]
