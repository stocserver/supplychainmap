import { ValueChainStageProducts } from "@/lib/data/industries"

export const insuranceProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Risk Assessment & Data',
    layout: 'flow',
    products: [
      {
        id: 'reinsurance',
        name: 'Reinsurance',
        description: 'Risk transfer and reinsurance services',
        longDescription: 'Companies that provide reinsurance services to primary insurers, helping them manage risk exposure and capital requirements.',
        companiesDetailed: [
          { name: 'Berkshire Hathaway', ticker: 'BRK.B', listing: 'US' },
          { name: 'Munich Re', ticker: 'MURGY', listing: 'ADR' },
          { name: 'Swiss Re', ticker: 'SSREY', listing: 'ADR' },
          { name: 'Hannover Re', ticker: 'HVRRF', listing: 'ADR' },
          { name: 'Everest Re', ticker: 'RE', listing: 'US' },
          { name: 'Arch Capital Group', ticker: 'ACGL', listing: 'US' },
          { name: 'RenaissanceRe', ticker: 'RNR', listing: 'US' },
          { name: 'Validus Holdings', ticker: 'VR', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'property-casualty-re',
            name: 'Property & Casualty Reinsurance',
            description: 'P&C risk transfer services',
            longDescription: 'Reinsurance coverage that protects primary insurers from large or accumulated losses arising from property and liability lines. Structures include quota share, excess of loss, and catastrophe reinsurance to manage volatility and capital needs.',
            companiesDetailed: [
              { name: 'Munich Re', ticker: 'MURGY', listing: 'ADR' },
              { name: 'Swiss Re', ticker: 'SSREY', listing: 'ADR' },
              { name: 'Everest Re', ticker: 'RE', listing: 'US' }
            ]
          },
          {
            id: 'life-reinsurance',
            name: 'Life Reinsurance',
            description: 'Life insurance risk transfer',
            longDescription: 'Reinsurance solutions for life and health portfolios that help primary insurers manage mortality, longevity, lapse, and morbidity risks, optimize capital, and support new product development.',
            companiesDetailed: [
              { name: 'Swiss Re', ticker: 'SSREY', listing: 'ADR' },
              { name: 'Hannover Re', ticker: 'HVRRF', listing: 'ADR' }
            ]
          }
        ],
        tags: ['Reinsurance', 'Risk Transfer', 'Capital Management']
      },
      {
        id: 'actuarial-data',
        name: 'Actuarial & Data Analytics',
        description: 'Risk modeling and data analytics services',
        longDescription: 'Companies that provide actuarial services, risk modeling, and data analytics to support insurance underwriting and pricing.',
        companiesDetailed: [
          { name: 'Verisk Analytics', ticker: 'VRSK', listing: 'US' },
          { name: 'CoreLogic', ticker: 'CLGX', listing: 'US' },
          { name: 'Guidewire Software', ticker: 'GWRE', listing: 'US' },
          { name: 'Duck Creek Technologies', ticker: 'DCT', listing: 'US' },
          { name: 'EIS Group', ticker: 'EIS', listing: 'Private' },
          { name: 'Insurity', ticker: 'INS', listing: 'Private' }
        ],
        subProducts: [
          {
            id: 'risk-modeling',
            name: 'Risk Modeling',
            description: 'Catastrophe and risk modeling',
            longDescription: 'Analytical modeling of catastrophic events (e.g., hurricanes, earthquakes), frequency/severity distributions, and portfolio risk to inform underwriting, pricing, reinsurance purchasing, and capital allocation.',
            companiesDetailed: [
              { name: 'Verisk Analytics', ticker: 'VRSK', listing: 'US' },
              { name: 'CoreLogic', ticker: 'CLGX', listing: 'US' }
            ]
          },
          {
            id: 'insurance-software',
            name: 'Insurance Software',
            description: 'Core insurance systems and platforms',
            longDescription: 'Policy administration, billing, and claims platforms used by insurers to manage the full policy lifecycle, integrate data sources, and automate workflows across underwriting, servicing, and finance.',
            companiesDetailed: [
              { name: 'Guidewire Software', ticker: 'GWRE', listing: 'US' },
              { name: 'Duck Creek Technologies', ticker: 'DCT', listing: 'US' }
            ]
          }
        ],
        tags: ['Actuarial', 'Risk Modeling', 'Data Analytics', 'Software']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Insurance Products',
    layout: 'hybrid',
    products: [
      {
        id: 'life-insurance',
        name: 'Life Insurance',
        description: 'Life insurance and annuity products',
        longDescription: 'Companies that provide life insurance, annuities, and related products for individuals and families.',
        companiesDetailed: [
          { name: 'MetLife', ticker: 'MET', listing: 'US' },
          { name: 'Prudential Financial', ticker: 'PRU', listing: 'US' },
          { name: 'Aflac', ticker: 'AFL', listing: 'US' },
          { name: 'Lincoln National', ticker: 'LNC', listing: 'US' },
          { name: 'Principal Financial', ticker: 'PFG', listing: 'US' },
          { name: 'Unum Group', ticker: 'UNM', listing: 'US' },
          { name: 'Brighthouse Financial', ticker: 'BHF', listing: 'US' },
          { name: 'Voya Financial', ticker: 'VOYA', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'term-life',
            name: 'Term Life Insurance',
            description: 'Temporary life insurance coverage',
            longDescription: 'Fixed-term life coverage providing a death benefit if the insured passes away during the policy term. Often used to cover time-bound obligations like mortgages or income replacement.',
            companiesDetailed: [
              { name: 'MetLife', ticker: 'MET', listing: 'US' },
              { name: 'Prudential Financial', ticker: 'PRU', listing: 'US' },
              { name: 'Aflac', ticker: 'AFL', listing: 'US' }
            ]
          },
          {
            id: 'annuities',
            name: 'Annuities',
            description: 'Retirement income products',
            longDescription: 'Contracts that provide a stream of payments in retirement, funded either immediately or deferred. Variants include fixed, variable, and indexed annuities with different risk/return profiles.',
            companiesDetailed: [
              { name: 'Prudential Financial', ticker: 'PRU', listing: 'US' },
              { name: 'Lincoln National', ticker: 'LNC', listing: 'US' },
              { name: 'Principal Financial', ticker: 'PFG', listing: 'US' }
            ]
          }
        ],
        tags: ['Life Insurance', 'Annuities', 'Retirement', 'Protection']
      },
      {
        id: 'pc-insurance',
        name: 'Property & Casualty Insurance',
        description: 'Property, casualty, and liability insurance',
        longDescription: 'Companies that provide property, casualty, auto, and liability insurance coverage for individuals and businesses.',
        companiesDetailed: [
          { name: 'Berkshire Hathaway', ticker: 'BRK.B', listing: 'US' },
          { name: 'Progressive', ticker: 'PGR', listing: 'US' },
          { name: 'Allstate', ticker: 'ALL', listing: 'US' },
          { name: 'Travelers', ticker: 'TRV', listing: 'US' },
          { name: 'Chubb', ticker: 'CB', listing: 'US' },
          { name: 'Hartford Financial', ticker: 'HIG', listing: 'US' },
          { name: 'Cincinnati Financial', ticker: 'CINF', listing: 'US' },
          { name: 'W.R. Berkley', ticker: 'WRB', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'auto-insurance',
            name: 'Auto Insurance',
            description: 'Personal and commercial auto coverage',
            longDescription: 'Insurance policies that protect against financial loss from auto accidents, theft, and liability. Includes personal auto, commercial auto, and specialty lines for fleets.',
            companiesDetailed: [
              { name: 'Progressive', ticker: 'PGR', listing: 'US' },
              { name: 'Allstate', ticker: 'ALL', listing: 'US' },
              { name: 'Berkshire Hathaway', ticker: 'BRK.B', listing: 'US' }
            ]
          },
          {
            id: 'homeowners-insurance',
            name: 'Homeowners Insurance',
            description: 'Property and homeowners coverage',
            longDescription: 'Policies covering damage to residential property and liability for accidents that occur on the property. Typical perils include fire, storm damage, theft, and certain water damage.',
            companiesDetailed: [
              { name: 'Allstate', ticker: 'ALL', listing: 'US' },
              { name: 'Travelers', ticker: 'TRV', listing: 'US' },
              { name: 'Chubb', ticker: 'CB', listing: 'US' }
            ]
          }
        ],
        tags: ['Property', 'Casualty', 'Auto', 'Liability']
      },
      {
        id: 'health-insurance',
        name: 'Health Insurance',
        description: 'Health and medical insurance products',
        longDescription: 'Companies that provide health insurance, Medicare, and related healthcare coverage products.',
        companiesDetailed: [
          { name: 'UnitedHealth Group', ticker: 'UNH', listing: 'US' },
          { name: 'Anthem', ticker: 'ANTM', listing: 'US' },
          { name: 'Humana', ticker: 'HUM', listing: 'US' },
          { name: 'Cigna', ticker: 'CI', listing: 'US' },
          { name: 'Molina Healthcare', ticker: 'MOH', listing: 'US' },
          { name: 'Centene', ticker: 'CNC', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'commercial-health',
            name: 'Commercial Health Insurance',
            description: 'Employer-sponsored health plans',
            longDescription: 'Group health insurance plans offered by employers to their employees, often including medical, dental, and vision coverage with shared premium contributions.',
            companiesDetailed: [
              { name: 'UnitedHealth Group', ticker: 'UNH', listing: 'US' },
              { name: 'Anthem', ticker: 'ANTM', listing: 'US' },
              { name: 'Cigna', ticker: 'CI', listing: 'US' }
            ]
          },
          {
            id: 'medicare-medicaid',
            name: 'Medicare & Medicaid',
            description: 'Government health programs',
            longDescription: 'Public health insurance programs in the United States—Medicare for seniors and certain disabled individuals; Medicaid for low-income individuals and families—administered through public-private partnerships with managed care organizations.',
            companiesDetailed: [
              { name: 'Humana', ticker: 'HUM', listing: 'US' },
              { name: 'Molina Healthcare', ticker: 'MOH', listing: 'US' },
              { name: 'Centene', ticker: 'CNC', listing: 'US' }
            ]
          }
        ],
        tags: ['Health Insurance', 'Medicare', 'Medicaid', 'Healthcare']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Distribution & Services',
    layout: 'grid',
    products: [
      {
        id: 'insurance-brokers',
        name: 'Insurance Brokers',
        description: 'Insurance brokerage and distribution services',
        longDescription: 'Companies that act as intermediaries between insurance buyers and insurers, providing brokerage and advisory services.',
        companiesDetailed: [
          { name: 'Marsh & McLennan', ticker: 'MMC', listing: 'US' },
          { name: 'Aon', ticker: 'AON', listing: 'US' },
          { name: 'Willis Towers Watson', ticker: 'WTW', listing: 'US' },
          { name: 'Arthur J. Gallagher', ticker: 'AJG', listing: 'US' },
          { name: 'Brown & Brown', ticker: 'BRO', listing: 'US' },
          { name: 'HUB International', ticker: 'HUB', listing: 'Private' }
        ],
        subProducts: [
          {
            id: 'commercial-brokers',
            name: 'Commercial Brokers',
            description: 'Business insurance brokerage',
            longDescription: 'Brokerage firms that specialize in placing commercial insurance for businesses across property, casualty, specialty lines, and employee benefits. They provide risk advisory, program design, and claims advocacy services.',
            companiesDetailed: [
              { name: 'Marsh & McLennan', ticker: 'MMC', listing: 'US' },
              { name: 'Aon', ticker: 'AON', listing: 'US' },
              { name: 'Willis Towers Watson', ticker: 'WTW', listing: 'US' }
            ]
          },
          {
            id: 'retail-brokers',
            name: 'Retail Brokers',
            description: 'Personal lines brokerage',
            longDescription: 'Intermediaries that distribute personal insurance lines such as auto, homeowners, renters, and life policies to individuals and households. They compare carriers, advise on coverage, and assist with policy service and claims.',
            companiesDetailed: [
              { name: 'Arthur J. Gallagher', ticker: 'AJG', listing: 'US' },
              { name: 'Brown & Brown', ticker: 'BRO', listing: 'US' }
            ]
          }
        ],
        tags: ['Brokers', 'Distribution', 'Advisory', 'Intermediaries']
      },
      {
        id: 'claims-processing',
        name: 'Claims Processing',
        description: 'Insurance claims management and processing',
        longDescription: 'Companies that provide claims processing, management, and related services to insurance companies.',
        companiesDetailed: [
          { name: 'Crawford & Company', ticker: 'CRD.B', listing: 'US' },
          { name: 'Sedgwick', ticker: 'SEDG', listing: 'Private' },
          { name: 'Gallagher Bassett', ticker: 'AJG', listing: 'US' },
          { name: 'York Risk Services', ticker: 'YORK', listing: 'Private' },
          { name: 'Genex Services', ticker: 'GENEX', listing: 'Private' }
        ],
        tags: ['Claims', 'Processing', 'Management', 'Services']
      }
    ]
  }
]
