import { ValueChainStageProducts } from "@/lib/data/industries"

export const constructionEngineeringProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Design & Engineering',
    layout: 'grid',
    products: [
      {
        id: 'engineering-design',
        name: 'Engineering & Design',
        description: 'Engineering, design, and architecture services',
        longDescription: 'Provision of specialized engineering, architectural, and design services for infrastructure, industrial, and commercial projects. This includes feasibility studies, detailed design, project management, and consulting across various disciplines like civil, structural, mechanical, and electrical engineering.',
        companiesDetailed: [
          { name: 'Jacobs Solutions', ticker: 'J', listing: 'US' },
          { name: 'AECOM', ticker: 'ACM', listing: 'US' },
          { name: 'Tetra Tech', ticker: 'TTEK', listing: 'US' },
          { name: 'Stantec', ticker: 'STN', listing: 'US' },
          { name: 'KBR', ticker: 'KBR', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Construction Services & Equipment',
    layout: 'hybrid',
    products: [
      {
        id: 'construction-services',
        name: 'Construction Services',
        description: 'General contractors and specialty services',
        longDescription: 'Execution of construction projects, including general contracting, project management, and specialized services such as electrical, pipeline, and utility infrastructure installation. This segment involves site preparation, building, and infrastructure development from conception to completion.',
        companiesDetailed: [
          { name: 'Quanta Services', ticker: 'PWR', listing: 'US' },
          { name: 'MasTec', ticker: 'MTZ', listing: 'US' },
          { name: 'EMCOR Group', ticker: 'EME', listing: 'US' },
          { name: 'Fluor', ticker: 'FLR', listing: 'US' },
          { name: 'Primoris Services', ticker: 'PRIM', listing: 'US' },
          { name: 'Tutor Perini', ticker: 'TPC', listing: 'US' },
          { name: 'Granite Construction', ticker: 'GVA', listing: 'US' },
          { name: 'Sterling Infrastructure', ticker: 'STRL', listing: 'US' },
          { name: 'MYR Group', ticker: 'MYRG', listing: 'US' }
        ]
      },
      {
        id: 'construction-equipment',
        name: 'Construction Equipment',
        description: 'Heavy machinery and equipment',
        longDescription: 'Manufacturing and distribution of heavy construction machinery, including excavators, loaders, bulldozers, cranes, and concrete mixers. This equipment is essential for earthmoving, material handling, and building infrastructure projects.',
        companiesDetailed: [
          { name: 'Caterpillar', ticker: 'CAT', listing: 'US' },
          { name: 'Deere', ticker: 'DE', listing: 'US' },
          { name: 'United Rentals', ticker: 'URI', listing: 'US' },
          { name: 'Terex', ticker: 'TEX', listing: 'US' },
          { name: 'Oshkosh', ticker: 'OSK', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Building Products & HVAC',
    layout: 'grid',
    products: [
      {
        id: 'building-products',
        name: 'Building Products',
        description: 'Materials and finished building products',
        longDescription: 'Manufacturing and supply of a wide range of building materials and finished products, including insulation, roofing, HVAC systems, windows, doors, and plumbing fixtures. These products are used in residential, commercial, and industrial construction.',
        companiesDetailed: [
          { name: 'Owens Corning', ticker: 'OC', listing: 'US' },
          { name: 'Carrier', ticker: 'CARR', listing: 'US' },
          { name: 'Johnson Controls', ticker: 'JCI', listing: 'US' },
          { name: 'Trane Technologies', ticker: 'TT', listing: 'US' },
          { name: 'Masco', ticker: 'MAS', listing: 'US' },
          { name: 'Builders FirstSource', ticker: 'BLDR', listing: 'US' },
          { name: 'Fastenal', ticker: 'FAST', listing: 'US' },
          { name: 'Beacon Roofing Supply', ticker: 'BECN', listing: 'US' },
          { name: 'Armstrong World Industries', ticker: 'AWI', listing: 'US' }
        ]
      }
    ]
  }
]


