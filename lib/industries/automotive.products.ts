import { ValueChainStageProducts } from "@/lib/data/industries"

export const automotiveProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Components & Suppliers',
    layout: 'flow',
    products: [
      {
        id: 'auto-parts-suppliers',
        name: 'Auto Parts Suppliers',
        description: 'Tier 1 and Tier 2 automotive component suppliers',
        longDescription: 'Companies that manufacture automotive components and systems for vehicle assembly, including engines, transmissions, electronics, and interior/exterior parts.',
        companiesDetailed: [
          { name: 'Magna International', ticker: 'MGA', listing: 'US' },
          { name: 'Aptiv', ticker: 'APTV', listing: 'US' },
          { name: 'Lear Corporation', ticker: 'LEA', listing: 'US' },
          { name: 'Visteon', ticker: 'VC', listing: 'US' },
          { name: 'Gentex', ticker: 'GNTX', listing: 'US' },
          { name: 'BorgWarner', ticker: 'BWA', listing: 'US' },
          { name: 'Dana Incorporated', ticker: 'DAN', listing: 'US' },
          { name: 'American Axle & Manufacturing', ticker: 'AXL', listing: 'US' },
          { name: 'Autoliv', ticker: 'ALV', listing: 'US' },
          { name: 'DENSO', ticker: 'DNZOY', listing: 'ADR' },
          { name: 'Valeo', ticker: 'VLEEY', listing: 'ADR' },
          { name: 'Aisin', ticker: 'ASEKY', listing: 'ADR' },
          { name: 'Forvia (Faurecia)', ticker: 'FURCF', listing: 'ADR' },
          { name: 'JTEKT', ticker: 'JTEKY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'engine-components',
            name: 'Engine Components',
            description: 'Engine parts and powertrain components',
            longDescription: 'Powertrain subsystems and components including pistons, turbochargers, crankshafts, axles, transmissions, and thermal systems that deliver durability, emissions compliance, and fuel efficiency across ICE and hybrid applications.',
            companiesDetailed: [
              { name: 'BorgWarner', ticker: 'BWA', listing: 'US' },
              { name: 'Dana Incorporated', ticker: 'DAN', listing: 'US' },
              { name: 'American Axle & Manufacturing', ticker: 'AXL', listing: 'US' }
            ]
          },
          {
            id: 'electronics',
            name: 'Automotive Electronics',
            description: 'Electronic systems and components',
            longDescription: 'In-vehicle electronics and software platforms including ADAS sensors, infotainment, connectivity modules, body controllers, and wire harnesses that enable safety, comfort, and digital experiences.',
            companiesDetailed: [
              { name: 'Aptiv', ticker: 'APTV', listing: 'US' },
              { name: 'Visteon', ticker: 'VC', listing: 'US' },
              { name: 'Gentex', ticker: 'GNTX', listing: 'US' },
              { name: 'Mobileye', ticker: 'MBLY', listing: 'US' }
            ]
          }
        ],
        tags: ['Tier 1 Suppliers', 'Components', 'Electronics', 'Powertrain']
      },
      {
        id: 'tires',
        name: 'Tires & Rubber',
        description: 'Tire manufacturing and rubber products',
        longDescription: 'Companies that manufacture tires, rubber products, and related automotive components.',
        companiesDetailed: [
          { name: 'Goodyear Tire & Rubber', ticker: 'GT', listing: 'US' },
          { name: 'Michelin', ticker: 'MGDDY', listing: 'ADR' },
          { name: 'Bridgestone', ticker: 'BRDCY', listing: 'ADR' },
          { name: 'Continental', ticker: 'CTTAF', listing: 'ADR' }
        ],
        tags: ['Tires', 'Rubber', 'Automotive Components']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Vehicle Manufacturing',
    layout: 'hybrid',
    products: [
      {
        id: 'auto-manufacturing',
        name: 'Vehicle Manufacturing',
        description: 'Automotive assembly and manufacturing',
        longDescription: 'Companies that design, engineer, and manufacture complete vehicles including cars, trucks, SUVs, and commercial vehicles.',
        companiesDetailed: [
          { name: 'General Motors', ticker: 'GM', listing: 'US' },
          { name: 'Ford Motor Company', ticker: 'F', listing: 'US' },
          { name: 'Stellantis', ticker: 'STLA', listing: 'US' },
          { name: 'Toyota Motor', ticker: 'TM', listing: 'ADR' },
          { name: 'Honda Motor', ticker: 'HMC', listing: 'ADR' },
          { name: 'Nissan Motor', ticker: 'NSANY', listing: 'ADR' },
          { name: 'Volkswagen', ticker: 'VWAGY', listing: 'ADR' },
          { name: 'BMW', ticker: 'BMWYY', listing: 'ADR' },
          { name: 'Mercedes-Benz Group', ticker: 'MBGYY', listing: 'ADR' },
          { name: 'Tata Motors', ticker: 'TTM', listing: 'US' },
          { name: 'Hyundai Motor', ticker: 'HYMTF', listing: 'ADR' },
          { name: 'Kia', ticker: 'KIMTF', listing: 'ADR' },
          { name: 'Subaru', ticker: 'FUJHY', listing: 'ADR' },
          { name: 'Mazda', ticker: 'MZDAY', listing: 'ADR' },
          { name: 'Renault', ticker: 'RNLSY', listing: 'ADR' },
          { name: 'Isuzu Motors', ticker: 'ISUZY', listing: 'ADR' },
          { name: 'Hino Motors', ticker: 'HINOY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'luxury-vehicles',
            name: 'Luxury Vehicles',
            description: 'Premium and luxury vehicle brands',
            companiesDetailed: [
              { name: 'BMW', ticker: 'BMWYY', listing: 'ADR' },
              { name: 'Mercedes-Benz Group', ticker: 'MBGYY', listing: 'ADR' },
              { name: 'Ferrari', ticker: 'RACE', listing: 'US' }
            ]
          },
          {
            id: 'mass-market',
            name: 'Mass Market Vehicles',
            description: 'Mainstream passenger vehicles',
            companiesDetailed: [
              { name: 'General Motors', ticker: 'GM', listing: 'US' },
              { name: 'Ford Motor Company', ticker: 'F', listing: 'US' },
              { name: 'Toyota Motor', ticker: 'TM', listing: 'ADR' },
              { name: 'Honda Motor', ticker: 'HMC', listing: 'ADR' },
              { name: 'Hyundai Motor', ticker: 'HYMTF', listing: 'ADR' },
              { name: 'Kia', ticker: 'KIMTF', listing: 'ADR' }
            ]
          },
          {
            id: 'commercial-vehicles',
            name: 'Commercial & Heavy Vehicles',
            description: 'Trucks, buses, and heavy-duty vehicles',
            companiesDetailed: [
              { name: 'PACCAR', ticker: 'PCAR', listing: 'US' },
              { name: 'Volvo AB', ticker: 'VLVLY', listing: 'ADR' },
              { name: 'Isuzu Motors', ticker: 'ISUZY', listing: 'ADR' },
              { name: 'Hino Motors', ticker: 'HINOY', listing: 'ADR' },
              { name: 'Tata Motors', ticker: 'TTM', listing: 'US' }
            ]
          }
        ],
        tags: ['Vehicle Assembly', 'Manufacturing', 'OEMs', 'Brands']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Sales & Services',
    layout: 'grid',
    products: [
      {
        id: 'dealers',
        name: 'Automotive Dealers',
        description: 'New and used vehicle dealerships',
        longDescription: 'Companies that operate automotive dealerships selling new and used vehicles, providing financing, insurance, and service.',
        companiesDetailed: [
          { name: 'AutoNation', ticker: 'AN', listing: 'US' },
          { name: 'Lithia Motors', ticker: 'LAD', listing: 'US' },
          { name: 'Penske Automotive Group', ticker: 'PAG', listing: 'US' },
          { name: 'Group 1 Automotive', ticker: 'GPI', listing: 'US' },
          { name: 'Sonic Automotive', ticker: 'SAH', listing: 'US' },
          { name: 'Asbury Automotive Group', ticker: 'ABG', listing: 'US' },
          { name: 'CarMax', ticker: 'KMX', listing: 'US' },
          { name: 'Carvana', ticker: 'CVNA', listing: 'US' },
          { name: 'America\'s Car-Mart', ticker: 'CRMT', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'new-vehicle-dealers',
            name: 'New Vehicle Dealers',
            description: 'Franchised new vehicle dealerships',
            companiesDetailed: [
              { name: 'AutoNation', ticker: 'AN', listing: 'US' },
              { name: 'Lithia Motors', ticker: 'LAD', listing: 'US' },
              { name: 'Penske Automotive Group', ticker: 'PAG', listing: 'US' }
            ]
          },
          {
            id: 'used-vehicle-dealers',
            name: 'Used Vehicle Dealers',
            description: 'Used vehicle sales and auctions',
            companiesDetailed: [
              { name: 'CarMax', ticker: 'KMX', listing: 'US' },
              { name: 'Carvana', ticker: 'CVNA', listing: 'US' },
              { name: 'Vroom', ticker: 'VRM', listing: 'US' },
              { name: 'America\'s Car-Mart', ticker: 'CRMT', listing: 'US' }
            ]
          },
          {
            id: 'auctions-remarketing',
            name: 'Auctions & Remarketing',
            description: 'Salvage and wholesale auctions, digital remarketing',
            companiesDetailed: [
              { name: 'Copart', ticker: 'CPRT', listing: 'US' },
              { name: 'KAR Global', ticker: 'KAR', listing: 'US' }
            ]
          }
        ],
        tags: ['Dealerships', 'Sales', 'Financing', 'Service']
      },
      {
        id: 'aftermarket',
        name: 'Aftermarket Parts & Services',
        description: 'Replacement parts and maintenance services',
        longDescription: 'Companies providing replacement parts, maintenance services, and aftermarket accessories for vehicles.',
        companiesDetailed: [
          { name: 'AutoZone', ticker: 'AZO', listing: 'US' },
          { name: 'O\'Reilly Automotive', ticker: 'ORLY', listing: 'US' },
          { name: 'Advance Auto Parts', ticker: 'AAP', listing: 'US' },
          { name: 'Genuine Parts Company', ticker: 'GPC', listing: 'US' },
          { name: 'LKQ Corporation', ticker: 'LKQ', listing: 'US' },
          { name: 'Monro', ticker: 'MNRO', listing: 'US' },
          { name: 'Driven Brands', ticker: 'DRVN', listing: 'US' },
          { name: 'Mister Car Wash', ticker: 'MCW', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'parts-retailers',
            name: 'Parts Retailers',
            description: 'Retail chains selling automotive parts',
            companiesDetailed: [
              { name: 'AutoZone', ticker: 'AZO', listing: 'US' },
              { name: 'O\'Reilly Automotive', ticker: 'ORLY', listing: 'US' },
              { name: 'Advance Auto Parts', ticker: 'AAP', listing: 'US' }
            ]
          },
          {
            id: 'service-centers',
            name: 'Service Centers',
            description: 'Automotive repair and maintenance',
            companiesDetailed: [
              { name: 'Monro', ticker: 'MNRO', listing: 'US' },
              { name: 'Driven Brands', ticker: 'DRVN', listing: 'US' }
            ]
          }
        ],
        tags: ['Aftermarket', 'Parts', 'Service', 'Maintenance']
      }
    ]
  }
]
