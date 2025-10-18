import { ValueChainStageProducts } from "@/lib/data/industries"

export const hospitalityProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Property Development',
    layout: 'grid',
    products: [
      {
        id: 'property-development-hosp',
        name: 'Property Development',
        description: 'Hotel and resort development',
        longDescription: 'Development, acquisition, and ownership of hotel and resort properties. This includes site selection, design, financing, construction, and renovation of hospitality assets, often managed by third-party operators or branded chains.',
        companiesDetailed: [
          { name: 'Host Hotels & Resorts', ticker: 'HST', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Operations',
    layout: 'hybrid',
    products: [
      {
        id: 'hotels-resorts',
        name: 'Hotels & Resorts',
        description: 'Hotel brands and operators',
        longDescription: 'Operation and branding of hotels and resorts, ranging from luxury to economy segments. This involves managing guest services, accommodations, food & beverage, and amenities, often under a franchised or managed contract model.',
        companiesDetailed: [
          { name: 'Marriott International', ticker: 'MAR', listing: 'US' },
          { name: 'Hilton Worldwide', ticker: 'HLT', listing: 'US' }
        ]
      },
      {
        id: 'casinos-gaming',
        name: 'Casinos & Gaming',
        description: 'Integrated resorts and casinos',
        longDescription: 'Development and operation of integrated resorts that combine casinos, hotels, entertainment venues, and convention facilities. This segment focuses on gaming revenue, hospitality services, and attracting diverse leisure and business travelers.',
        companiesDetailed: [
          { name: 'Las Vegas Sands', ticker: 'LVS', listing: 'US' },
          { name: 'MGM Resorts', ticker: 'MGM', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Travel Services',
    layout: 'grid',
    products: [
      {
        id: 'online-travel',
        name: 'Online Travel',
        description: 'Online travel agencies and platforms',
        longDescription: 'Digital platforms that facilitate booking of flights, hotels, rental cars, and vacation packages. Online travel agencies (OTAs) leverage technology and extensive networks to provide convenience and competitive pricing to travelers worldwide.',
        companiesDetailed: [
          { name: 'Booking Holdings', ticker: 'BKNG', listing: 'US' },
          { name: 'Expedia Group', ticker: 'EXPE', listing: 'US' }
        ]
      }
    ]
  }
]


